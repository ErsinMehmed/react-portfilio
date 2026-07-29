import {
  KIND,
  listDays,
  readDay,
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
  EVENT_LABELS,
  REF_LABELS,
  barChart,
  countryLabel,
  dayOfWeek,
  esc,
  header,
  kpi,
  loginPage,
  longDay,
  num,
  page,
  privacyPanel,
  qaList,
  rankedList,
  shortDay,
  sofiaHour,
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

const themeOf = (req, url) => {
  const asked = url.searchParams.get("theme");
  if (THEMES.includes(asked)) return asked;
  const stored = readCookie(req, THEME_COOKIE);
  // No cookie and no query means "follow the OS", which the CSS already does.
  return THEMES.includes(stored) ? stored : "";
};

const statsUrl = (day) => (day ? `/stats?day=${encodeURIComponent(day)}` : "/stats");

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

const visitsIn = (events) =>
  new Set(
    events.filter((e) => e.type === "pageview").map((e) => e.sid).filter(Boolean)
  ).size;

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
  const actions = events.filter((e) => e.type !== "pageview");
  const opens = actions.filter(
    (e) => e.type === "case_study_open" || e.type === "project_open"
  );

  const dayLinks = days.length
    ? days
        .map(
          (d) =>
            `<a class="day${d === day ? " on" : ""}" href="${statsUrl(d)}" title="${esc(
              longDay(d)
            )}"><b class="tnum">${esc(shortDay(d))}</b><span class="c tnum">${num(
              dayCounts[d] ?? 0
            )}</span></a>`
        )
        .join("")
    : '<span class="empty">Още няма записани данни.</span>';

  const dayBars = dayWindow(day, 14).map((d) => ({
    key: d,
    label: `${dayOfWeek(d)} ${shortDay(d)}`,
    axis: String(Number(d.slice(8))),
    value: dayCounts[d] ?? 0,
    active: d === day,
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

  return page({
    title: `Статистика · ${day}`,
    theme,
    body: `
${header({ day, theme, query: `day=${encodeURIComponent(day)}&` })}

<nav class="days" aria-label="Дни">${dayLinks}</nav>

<div class="kpis">
  ${kpi(visitsIn(events), "Посещения (уникални сесии)", visitsIn(previous.events))}
  ${kpi(pageviews.length, "Прегледи на страници", previous.events.filter((e) => e.type === "pageview").length)}
  ${kpi(actions.length, "Действия", previous.events.filter((e) => e.type !== "pageview").length)}
  ${kpi(qa.length, "Въпроса към AI", previous.qa)}
</div>

${barChart("Последни 14 дни", dayBars, "всички събития")}
${barChart("Активност по часове", hourBars, "часова зона София")}

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
  ${rankedList("Страници", tally(pageviews, (e) => e.path))}
  ${rankedList("Действия", tally(actions, (e) => e.type), (k) => EVENT_LABELS[k] ?? k)}
  ${rankedList("Отворени проекти и case studies", tally(opens, (e) => e.meta))}
  ${rankedList("Език на интерфейса", tally(events, (e) => e.lang), (k) =>
    k === "bg" ? "Български" : k === "en" ? "Английски" : k
  )}
  ${rankedList("Кампании (utm_source)", tally(pageviews, (e) => e.utmSource))}
</div>

<section class="card wide"><h2>Въпроси и отговори от AI</h2>${qaList(qa)}</section>

${privacyPanel({ excluded, day, count: excludedCount })}

<p class="foot">Данните се пазят ${RETENTION_DAYS} дни и се изтриват автоматично. Не се съхраняват IP адреси, нито бисквитки за посетители.</p>
`,
  });
};

/* ---- actions ---- */

const handlePost = async (req, context, theme) => {
  const form = new URLSearchParams(await req.text());
  const action = form.get("action");
  const day = form.get("day") || "";

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

    return seeOther(statsUrl(day), [optOut]);
  }

  return seeOther(statsUrl(day));
};

/* ---- entry ---- */

export default async (req, context) => {
  const url = new URL(req.url);
  const theme = themeOf(req, url);

  // Theme is picked with a plain link; store it and bounce back to a clean URL.
  if (THEMES.includes(url.searchParams.get("theme"))) {
    const day = url.searchParams.get("day") || "";
    return seeOther(statsUrl(day), [
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
  const yesterday = shiftDay(day, -1);

  const [events, qa, dayCounts, prevEvents, prevQa, settings] = await Promise.all([
    readDay(KIND.event, day),
    readDay(KIND.qa, day),
    countsByDay(KIND.event),
    readDay(KIND.event, yesterday),
    readDay(KIND.qa, yesterday),
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
      days,
      dayCounts,
      events,
      qa,
      previous: { events: prevEvents, qa: prevQa.length },
      theme,
      excluded,
      excludedCount: settings.excludedIps.length,
    })
  );
};
