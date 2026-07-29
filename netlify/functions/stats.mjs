import {
  KIND,
  listDays,
  readDays,
  countsByDay,
  pruneExpired,
  readSettings,
  writeSettings,
  hashIp,
  RETENTION_DAYS,
  dayOf,
} from "./analytics-store.mjs";
import { clientIp, invalidateExclusions, OPT_OUT_COOKIE } from "./exclude.mjs";
import {
  SESSION_COOKIE,
  THEME_COOKIE,
  buildCookie,
  checkCredentials,
  clearedSessionCookie,
  clearFailures,
  hasSession,
  isConfigured,
  isSecure,
  readCookie,
  recordFailure,
  sessionCookie,
  throttleState,
} from "./stats-auth.mjs";
import {
  DEVICE_LABELS,
  EVENT_LABELS,
  LANG_LABELS,
  OUTBOUND_LABELS,
  REF_LABELS,
  SECTION_LABELS,
  barChart,
  clock,
  compareTable,
  countryLabel,
  dayOfWeek,
  esc,
  groupHeading,
  header,
  kpi,
  loginPage,
  longDay,
  num,
  page,
  privacyPanel,
  qaList,
  rangePills,
  rankedList,
  shortDay,
  sofiaHour,
  statCard,
} from "./stats-view.mjs";

// Private analytics dashboard, served straight from this function at /stats
// (see the rewrite in netlify.toml). It is deliberately NOT a React route: the
// HTML only exists after the credential check, so nothing about it ships in the
// public bundle. Sign-in is this function's own screen backed by a signed
// session cookie (stats-auth.mjs), and everything renders server-side with no
// inline <script>, which keeps the page inside the site's strict CSP.

const PRIVATE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

const html = (body, { status = 200, cookies = [] } = {}) => {
  const headers = new Headers({
    ...PRIVATE_HEADERS,
    "Content-Type": "text/html; charset=utf-8",
  });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(body, { status, headers });
};

/** POST-redirect-GET, so a refresh never replays an action. */
const seeOther = (location, cookies = []) => {
  const headers = new Headers({ ...PRIVATE_HEADERS, Location: location });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 303, headers });
};

/* ---- request helpers ---- */

const THEMES = ["light", "dark"];
const RANGES = [1, 7, 30];

const themeOf = (req, url) => {
  const asked = url.searchParams.get("theme");
  if (THEMES.includes(asked)) return asked;
  const stored = readCookie(req, THEME_COOKIE);
  // No cookie and no query means "follow the OS", which the CSS already does.
  return THEMES.includes(stored) ? stored : "";
};

const statsUrl = (day, range) => {
  const params = new URLSearchParams();
  if (day) params.set("day", day);
  if (range && range !== 1) params.set("range", String(range));
  const query = params.toString();
  return query ? `/stats?${query}` : "/stats";
};

const rangeOf = (value) => (RANGES.includes(Number(value)) ? Number(value) : 1);

// SameSite=Strict on the session cookie already blocks cross-site form posts;
// this is the belt to that pair of braces.
const sameOrigin = (req) => {
  const origin = req.headers.get("origin");
  if (!origin) return true; // no Origin header at all (non-browser client)
  try {
    return new URL(origin).host === (req.headers.get("host") ?? new URL(req.url).host);
  } catch {
    return false;
  }
};

/* ---- aggregation ---- */

/** Count occurrences of `pick(row)`, most frequent first. */
const tally = (rows, pick) => {
  const counts = new Map();
  for (const row of rows) {
    const value = pick(row);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};

const hostOf = (referrer) => {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
};

// Scroll depth and section reach are fired by observers, not by a person
// deciding to click something. They are signals worth their own cards, but
// counting them as "Действия" would make every visit look engaged.
const AUTO_TYPES = new Set(["scroll_depth", "section_view"]);
const isAction = (e) => e.type !== "pageview" && !AUTO_TYPES.has(e.type);

const visitsIn = (events) =>
  new Set(
    events.filter((e) => e.type === "pageview").map((e) => e.sid).filter(Boolean)
  ).size;

/**
 * Regroup a flat event list into visits, keyed by the per-tab session id.
 * Everything below — bounce rate, duration, entry/exit pages, the source
 * funnel — is a question about a visit, not about an event, and the sid is
 * already there: no extra tracking was needed for any of it.
 */
const buildSessions = (events) => {
  const sessions = new Map();

  for (const event of events) {
    if (!event.sid) continue;

    let session = sessions.get(event.sid);
    if (!session) {
      session = {
        sid: event.sid,
        first: event.ts,
        last: event.ts,
        ref: event.ref,
        country: event.country,
        device: event.device,
        returning: event.returning === true,
        paths: [],
        types: new Set(),
        outbound: new Set(),
      };
      sessions.set(event.sid, session);
    }

    if (String(event.ts) < String(session.first)) session.first = event.ts;
    if (String(event.ts) > String(session.last)) session.last = event.ts;
    if (!session.ref && event.ref) session.ref = event.ref;
    if (!session.device && event.device) session.device = event.device;
    if (event.returning === true) session.returning = true;

    if (event.type === "pageview") session.paths.push(event.path || "/");
    else session.types.add(event.type);
    if (event.type === "outbound_click" && event.meta) session.outbound.add(event.meta);
  }

  return [...sessions.values()].map((session) => {
    const ms = Math.max(0, Date.parse(session.last) - Date.parse(session.first));
    const acted = [...session.types].some((type) => !AUTO_TYPES.has(type));
    return {
      ...session,
      ms,
      acted,
      // GA-style engagement: more than one page, or half a minute, or an
      // intentional action. Anything else is a bounce.
      engaged: session.paths.length > 1 || ms >= 30_000 || acted,
      entry: session.paths[0],
      exit: session.paths[session.paths.length - 1],
    };
  });
};

const median = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
};

const duration = (ms) => {
  if (!ms) return "0 сек";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds} сек`;
  return `${Math.floor(seconds / 60)} мин ${String(seconds % 60).padStart(2, "0")} сек`;
};

const share = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);

/** Did this visit signal any intent to get in touch? */
const reachedContact = (session) =>
  session.types.has("copy_email") ||
  session.types.has("askcv_open") ||
  session.outbound.has("mailto") ||
  session.outbound.has("tel");

/**
 * Sessions per traffic source, with the share of each that got to the CV page,
 * downloaded the PDF, or reached out. This is the table that says which job
 * board is worth re-posting to.
 */
const sourceFunnel = (sessions) => {
  const groups = new Map();

  for (const session of sessions) {
    const key = session.ref || "direct";
    const group = groups.get(key) ?? { key, total: 0, resume: 0, cv: 0, contact: 0 };
    group.total += 1;
    if (session.paths.some((path) => path.startsWith("/resume"))) group.resume += 1;
    if (session.types.has("cv_download")) group.cv += 1;
    if (reachedContact(session)) group.contact += 1;
    groups.set(key, group);
  }

  return [...groups.values()].sort((a, b) => b.total - a.total);
};

/** First three distinct pages of a visit, as one row. */
const journey = (session) => {
  const steps = session.paths.filter((path, i) => path !== session.paths[i - 1]);
  return steps.length > 1 ? steps.slice(0, 3).join("  ›  ") : "";
};

// Phrases the model uses when the CV context doesn't cover a question. Each
// hit is a gap worth filling in netlify/functions/cv-knowledge.mjs.
const GAP = /нямам (тази )?информация|няма информация|не разполагам с|не е посочен|not covered|do(?:n't| not) have (?:that )?information|isn'?t mentioned/i;

/** The N calendar days ending at `day`, oldest first. */
const dayWindow = (day, length) => {
  const end = new Date(`${day}T00:00:00Z`).getTime();
  return Array.from({ length }, (_, i) =>
    dayOf(new Date(end - (length - 1 - i) * 86_400_000))
  );
};

const shiftDay = (day, deltaDays) =>
  dayOf(new Date(new Date(`${day}T00:00:00Z`).getTime() + deltaDays * 86_400_000));

/* ---- render ---- */

const dashboard = ({
  day,
  range,
  windowDays,
  days,
  dayCounts,
  events,
  qa,
  previous,
  theme,
  excluded,
  excludedCount,
}) => {
  const pageviews = events.filter((e) => e.type === "pageview");
  const actions = events.filter(isAction);
  const opens = actions.filter(
    (e) => e.type === "case_study_open" || e.type === "project_open"
  );
  const scrolls = events.filter((e) => e.type === "scroll_depth");
  const sections = events.filter((e) => e.type === "section_view");
  const outbound = actions.filter((e) => e.type === "outbound_click");
  const downloads = actions.filter((e) => e.type === "cv_download");

  const sessions = buildSessions(events);
  const engaged = sessions.filter((s) => s.engaged);
  const durations = sessions.filter((s) => s.ms > 0).map((s) => s.ms);
  const avgMs = durations.length
    ? Math.round(durations.reduce((sum, ms) => sum + ms, 0) / durations.length)
    : 0;

  const qaSessions = new Set(qa.map((r) => r.sid).filter(Boolean));
  const qaTimes = qa.map((r) => r.ms).filter((ms) => Number.isFinite(ms) && ms > 0);
  const gaps = qa.filter((r) => GAP.test(String(r.answer ?? "")));

  // Only the most recent fortnight gets a pill; older days stay reachable
  // through the 7- and 30-day views and the chart below.
  const dayLinks = days.length
    ? days
        .slice(0, 14)
        .map(
          (d) =>
            `<a class="day${d === day ? " on" : ""}" href="${statsUrl(d, range)}" title="${esc(
              longDay(d)
            )}"><b class="tnum">${esc(shortDay(d))}</b><span class="c tnum">${num(
              dayCounts[d] ?? 0
            )}</span></a>`
        )
        .join("")
    : '<span class="empty">Още няма записани данни.</span>';

  // The chart always shows at least a fortnight of context, even in day view.
  const chartDays = dayWindow(day, Math.max(14, range));
  const dayBars = chartDays.map((d) => ({
    key: d,
    label: `${dayOfWeek(d)} ${shortDay(d)}`,
    axis: String(Number(d.slice(8))),
    value: dayCounts[d] ?? 0,
    active: windowDays.includes(d),
  }));

  const byHour = new Array(24).fill(0);
  for (const event of events) {
    const hour = sofiaHour(event.ts);
    if (hour !== null) byHour[hour] += 1;
  }
  const hourBars = byHour.map((value, hour) => ({
    key: hour,
    label: `${String(hour).padStart(2, "0")}:00`,
    axis: hour % 3 === 0 ? String(hour) : "",
    value,
    active: false,
  }));

  const funnelRows = sourceFunnel(sessions).map((row) => [
    REF_LABELS[row.key] ?? (row.key === "direct" ? "Без маркер" : row.key),
    { v: num(row.total), cls: "strong" },
    { v: `${share(row.resume, row.total)}%`, cls: share(row.resume, row.total) ? "rate" : "rate low" },
    { v: `${share(row.cv, row.total)}%`, cls: share(row.cv, row.total) ? "rate" : "rate low" },
    {
      v: `${share(row.contact, row.total)}%`,
      cls: share(row.contact, row.total) ? "rate" : "rate low",
    },
  ]);

  const periodLabel =
    range === 1
      ? longDay(day)
      : `${longDay(windowDays[0])} – ${longDay(day)} · ${range} дни`;

  return page({
    title: `Статистика · ${day}`,
    theme,
    body: `
${header({
  subtitle: `${periodLabel} · собствен анализ, без външни услуги`,
  theme,
  query: `day=${encodeURIComponent(day)}&range=${range}&`,
})}

${rangePills(day, range)}
<nav class="days" aria-label="Дни">${dayLinks}</nav>

<div class="kpis">
  ${kpi(sessions.length, "Посещения (уникални сесии)", previous.sessions)}
  ${kpi(pageviews.length, "Прегледи на страници", previous.pageviews)}
  ${kpi(actions.length, "Действия", previous.actions)}
  ${kpi(qa.length, "Въпроса към AI", previous.qa)}
</div>

<div class="grid">
  ${statCard("Ангажираност", [
    ["Ангажирани посещения", `${share(engaged.length, sessions.length)}%`, `${num(engaged.length)} от ${num(sessions.length)}`],
    ["Отпаднали веднага", `${share(sessions.length - engaged.length, sessions.length)}%`, "една страница, без действие"],
    ["Средна продължителност", duration(avgMs)],
    ["Медиана", duration(median(durations))],
    [
      "Страници на посещение",
      sessions.length ? (pageviews.length / sessions.length).toFixed(1) : "0",
    ],
    [
      "Връщащи се",
      `${share(sessions.filter((s) => s.returning).length, sessions.length)}%`,
      "били са тук и в предишен ден",
    ],
  ])}
  ${rankedList("Устройство", tally(events, (e) => e.device), (k) => DEVICE_LABELS[k] ?? k, 3)}
  ${rankedList("Операционна система", tally(events, (e) => e.os), (k) => k, 5)}
</div>

${barChart(range === 1 ? "Последни 14 дни" : `Дни в периода (${range})`, dayBars, "всички събития")}
${barChart("Активност по часове", hourBars, "часова зона София")}

${groupHeading("Придобиване")}

${compareTable(
  "Фуния по източник",
  ["Източник", "Посещения", "Стигат до CV", "Свалят CV", "Търсят контакт"],
  funnelRows,
  "Дял от посещенията с този маркер, стигнали до /resume, свалили PDF-а или посегнали към имейл/телефон/AI."
)}

<div class="grid">
  ${rankedList(
    "Източник на трафика",
    tally(pageviews, (e) => e.ref || "direct"),
    (k) => REF_LABELS[k] ?? (k === "direct" ? "Без маркер" : k)
  )}
  ${rankedList(
    "Препращащ сайт",
    tally(pageviews, (e) => hostOf(e.referrer) || "директно")
  )}
  ${rankedList("Държави", tally(events, (e) => e.country), countryLabel)}
  ${rankedList("Кампании (utm_source)", tally(pageviews, (e) => e.utmSource))}
  ${rankedList("Канал (utm_medium)", tally(pageviews, (e) => e.utmMedium))}
  ${rankedList("Кампания (utm_campaign)", tally(pageviews, (e) => e.utmCampaign))}
</div>

${groupHeading("Поведение")}

<div class="grid">
  ${rankedList("Страници", tally(pageviews, (e) => e.path))}
  ${rankedList("Входна страница", tally(sessions, (s) => s.entry))}
  ${rankedList("Последна страница", tally(sessions, (s) => s.exit))}
  ${rankedList("Действия", tally(actions, (e) => e.type), (k) => EVENT_LABELS[k] ?? k)}
  ${rankedList("Отворени проекти и case studies", tally(opens, (e) => e.meta))}
  ${rankedList("Изходящи клика", tally(outbound, (e) => e.meta), (k) => OUTBOUND_LABELS[k] ?? k)}
  ${rankedList("Дълбочина на скрола", tally(scrolls, (e) => e.meta))}
  ${rankedList("Дочетени страници (90%)", tally(scrolls.filter((e) => e.meta === "90%"), (e) => e.path))}
  ${rankedList("Достигнати секции", tally(sections, (e) => e.meta), (k) => SECTION_LABELS[k] ?? k, 10)}
  ${rankedList("Свалено CV по език", tally(downloads, (e) => e.meta), (k) => LANG_LABELS[k] ?? k, 3)}
  ${rankedList("Език на интерфейса", tally(events, (e) => e.lang), (k) => LANG_LABELS[k] ?? k, 3)}
  ${rankedList("Браузър", tally(events, (e) => e.browser), (k) => k, 5)}
</div>

${compareTable(
  "Пътеки в сайта",
  ["Първи три страници", "Посещения"],
  tally(sessions, journey)
    .slice(0, 8)
    .map(([path, count]) => [path, { v: num(count), cls: "strong" }]),
  "Само посещения с повече от една страница."
)}

${groupHeading("AI разговори")}

<div class="grid">
  ${statCard("Как се ползва „Питай за мен“", [
    ["Въпроси", num(qa.length)],
    ["Посещения с въпрос", num(qaSessions.size), `${share(qaSessions.size, sessions.length)}% от всички`],
    [
      "Въпроси на разговор",
      qaSessions.size ? (qa.length / qaSessions.size).toFixed(1) : "0",
    ],
    [
      "От подсказка",
      `${share(qa.filter((r) => r.followup).length, qa.length)}%`,
      "кликнат follow-up вместо писане",
    ],
    ["Средно време за отговор", qaTimes.length ? `${(qaTimes.reduce((a, b) => a + b, 0) / qaTimes.length / 1000).toFixed(1)} сек` : "—"],
    ["Най-бавен отговор", qaTimes.length ? `${(Math.max(...qaTimes) / 1000).toFixed(1)} сек` : "—"],
  ])}
  ${rankedList("Режим", tally(qa, (r) => r.mode), (k) =>
    k === "interview" ? "Подготовка за интервю" : k === "decision" ? "Обяснение на решение" : "Свободен въпрос"
  )}
  ${rankedList("Език на въпросите", tally(qa, (r) => r.lang), (k) => LANG_LABELS[k] ?? k, 3)}
</div>

<section class="card wide">
  <h2>Въпроси без отговор в CV-то${gaps.length ? ` · ${num(gaps.length)}` : ""}</h2>
  ${
    gaps.length
      ? `<ul class="list">${gaps
          .slice(0, 10)
          .map((r) => `<li><span class="k">${esc(r.question)}</span><span class="n tnum">${esc(clock(r.ts))}</span></li>`)
          .join("")}</ul>
         <p class="empty" style="margin-top:12px">Моделът е отговорил, че няма такава информация. Всеки ред е дупка, която си струва да се допълни в cv-knowledge.mjs.</p>`
      : '<p class="empty">Няма такива отговори в този период.</p>'
  }
</section>

<section class="card wide"><h2>Въпроси и отговори от AI</h2>${qaList(qa)}</section>

${privacyPanel({ excluded, day, range, count: excludedCount })}

<p class="foot">Данните се пазят ${RETENTION_DAYS} дни и се изтриват автоматично. Не се съхраняват IP адреси, нито бисквитки за посетители.</p>
`,
  });
};

/* ---- actions ---- */

const handlePost = async (req, context, theme) => {
  const form = new URLSearchParams(await req.text());
  const action = form.get("action");
  const day = form.get("day") || "";
  const range = rangeOf(form.get("range"));

  if (action === "login") {
    const key = clientIp(req, context) || "unknown";
    const throttle = throttleState(key);
    if (throttle.blocked) {
      return html(
        loginPage({
          theme,
          error: `Твърде много опити. Опитай отново след ${throttle.minutes} мин.`,
        }),
        { status: 429 }
      );
    }

    if (!isConfigured()) {
      return html(
        loginPage({ theme, error: "Панелът не е конфигуриран (липсват STATS_USER / STATS_PASS)." }),
        { status: 503 }
      );
    }

    if (!checkCredentials(form.get("user"), form.get("pass"))) {
      recordFailure(key);
      return html(
        loginPage({ theme, error: "Грешно потребителско име или парола." }),
        { status: 401 }
      );
    }

    clearFailures(key);
    return seeOther("/stats", [sessionCookie(req)]);
  }

  // Everything below changes state and needs a live session.
  if (!hasSession(req) || !sameOrigin(req)) return seeOther("/stats");

  if (action === "logout") {
    return seeOther("/stats", [clearedSessionCookie(req)]);
  }

  if (action === "exclude_me" || action === "include_me") {
    const adding = action === "exclude_me";
    const fingerprint = hashIp(clientIp(req, context));
    const { excludedIps } = await readSettings();

    const next = adding
      ? [...new Set([...excludedIps, fingerprint].filter(Boolean))]
      : excludedIps.filter((entry) => entry !== fingerprint);
    await writeSettings({ excludedIps: next });
    invalidateExclusions();

    // The cookie covers the same browser even after the IP changes — home
    // connections and mobile networks hand out new addresses all the time.
    const optOut = buildCookie(OPT_OUT_COOKIE, adding ? "1" : "", {
      maxAge: adding ? 400 * 24 * 60 * 60 : 0,
      secure: isSecure(req),
      sameSite: "Lax",
    });

    return seeOther(statsUrl(day, range), [optOut]);
  }

  return seeOther(statsUrl(day, range));
};

/* ---- entry ---- */

export default async (req, context) => {
  const url = new URL(req.url);
  const theme = themeOf(req, url);

  // Theme is picked with a plain link; store it and bounce back to a clean URL.
  if (THEMES.includes(url.searchParams.get("theme"))) {
    const day = url.searchParams.get("day") || "";
    return seeOther(statsUrl(day, rangeOf(url.searchParams.get("range"))), [
      buildCookie(THEME_COOKIE, theme, {
        maxAge: 400 * 24 * 60 * 60,
        secure: isSecure(req),
      }),
    ]);
  }

  if (req.method === "POST") return handlePost(req, context, theme);
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response(null, { status: 405, headers: PRIVATE_HEADERS });
  }

  // No WWW-Authenticate anywhere in this function: the browser's own credential
  // dialog must never appear.
  if (!hasSession(req)) return html(loginPage({ theme, error: "" }), { status: 200 });

  // Only ever triggered by an authenticated view, so retention costs no
  // visitor-facing latency.
  await pruneExpired();

  const [eventDays, qaDays] = await Promise.all([
    listDays(KIND.event),
    listDays(KIND.qa),
  ]);
  const days = [...new Set([...eventDays, ...qaDays])].sort().reverse();

  const requested = url.searchParams.get("day");
  const day = days.includes(requested) ? requested : (days[0] ?? dayOf());

  // 1 / 7 / 30 days, ending on the selected day. The comparison window is the
  // same length immediately before it, so every delta compares like with like.
  const range = rangeOf(url.searchParams.get("range"));
  const windowDays = dayWindow(day, range);
  const previousDays = dayWindow(shiftDay(windowDays[0], -1), range);

  const [events, qa, dayCounts, prevEvents, prevQa, settings] = await Promise.all([
    readDays(KIND.event, windowDays),
    readDays(KIND.qa, windowDays),
    countsByDay(KIND.event),
    readDays(KIND.event, previousDays),
    readDays(KIND.qa, previousDays),
    readSettings(),
  ]);

  // Read straight from the blob rather than through the beacon's cache, so the
  // panel reflects a toggle the instant it happens.
  const excluded =
    readCookie(req, OPT_OUT_COOKIE) === "1" ||
    settings.excludedIps.includes(hashIp(clientIp(req, context)));

  return html(
    dashboard({
      day,
      range,
      windowDays,
      days,
      dayCounts,
      events,
      qa,
      previous: {
        sessions: visitsIn(prevEvents),
        pageviews: prevEvents.filter((e) => e.type === "pageview").length,
        actions: prevEvents.filter(isAction).length,
        qa: prevQa.length,
      },
      theme,
      excluded,
      excludedCount: settings.excludedIps.length,
    })
  );
};
