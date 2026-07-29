// Server-rendered markup for the private dashboard, in Bulgarian.
//
// Two hard constraints shape this file:
//   1. No JavaScript at all. The site ships a strict CSP with no 'unsafe-inline'
//      for scripts, and adding a hash for a dashboard script would mean editing
//      netlify.toml on every copy change. Everything interactive here is a plain
//      form POST or a link — including the theme switch and the sign-in screen.
//   2. Same design language as the portfolio: brand #1b74e4, the slate scale,
//      Bricolage Grotesque for display type and Hanken Grotesk for text, with
//      Onest covering Cyrillic exactly as tailwind.config.js sets it up.

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);

/* ---- Bulgarian labels ---- */

export const REF_LABELS = {
  "cv-devbg": "CV в dev.bg",
  "cv-jobsbg": "CV в jobs.bg",
  cv: "CV (директно копие)",
  linkedin: "LinkedIn",
  github: "GitHub",
  email: "Имейл подпис",
  qr: "QR код",
};

export const EVENT_LABELS = {
  cv_download: "Изтеглено CV",
  askcv_open: "Отворен „Питай за мен“",
  case_study_open: "Отворен case study",
  project_open: "Отворен проект",
  copy_email: "Копиран имейл",
  lang_switch: "Смяна на език",
  theme_switch: "Смяна на тема",
};

const MODE_LABELS = {
  ask: "въпрос",
  interview: "интервю",
  decision: "решения",
};

/* ---- formatting ---- */

const nf = new Intl.NumberFormat("bg-BG");
export const num = (value) => nf.format(value);

const pillDate = new Intl.DateTimeFormat("bg-BG", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});
const longDate = new Intl.DateTimeFormat("bg-BG", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const weekday = new Intl.DateTimeFormat("bg-BG", { weekday: "short", timeZone: "UTC" });

const asDate = (day) => new Date(`${day}T00:00:00Z`);
export const shortDay = (day) => pillDate.format(asDate(day));
export const longDay = (day) => longDate.format(asDate(day));
export const dayOfWeek = (day) => weekday.format(asDate(day)).replace(".", "");

// Days are bucketed in UTC (see analytics-store), but a clock time only reads
// naturally in local time, so timestamps are shown in Sofia's zone.
const sofiaTime = new Intl.DateTimeFormat("bg-BG", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Sofia",
});
export const clock = (ts) => (ts ? sofiaTime.format(new Date(ts)) : "");

export const sofiaHour = (ts) => {
  if (!ts) return null;
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Europe/Sofia",
    }).format(new Date(ts))
  );
  return Number.isFinite(hour) ? hour % 24 : null;
};

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["bg"], { type: "region" });
  } catch {
    return null;
  }
})();

/**
 * "BG" -> "България"; unknown codes pass through untouched. No flag emoji:
 * Windows ships no glyphs for regional-indicator pairs, so they'd render as
 * stray letter boxes on the machine this dashboard is read from.
 */
export const countryLabel = (code) => {
  if (!code || code.length !== 2) return code || "—";
  const upper = code.toUpperCase();
  try {
    return regionNames?.of(upper) ?? upper;
  } catch {
    return upper;
  }
};

/* ---- styles ---- */

// Subsets and unicode-ranges copied from src/index.css so this page renders in
// the same faces as the site, from the same self-hosted files.
const FONTS = `
@font-face{font-family:"Bricolage Grotesque";font-style:normal;font-weight:500 800;font-display:swap;src:url("/fonts/bricolage-grotesque-latin.woff2") format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Hanken Grotesk";font-style:normal;font-weight:400 700;font-display:swap;src:url("/fonts/hanken-grotesk-latin.woff2") format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Onest";font-style:normal;font-weight:400 800;font-display:swap;src:url("/fonts/onest-cyrillic.woff2") format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
`;

const STYLE = `
${FONTS}
:root{
  --brand:#1b74e4;--brand-dark:#1667cf;
  --bg:#f8fafc;--bg-glow:rgba(27,116,228,.10);
  --surface:#ffffff;--surface-2:#f1f5f9;--line:#e2e8f0;
  --text:#0f172a;--text-2:#334155;--muted:#64748b;--faint:#94a3b8;
  --up:#059669;--down:#e11d48;--shadow:0 1px 2px rgba(15,23,42,.05),0 12px 32px -18px rgba(15,23,42,.30);
  color-scheme:light;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#020617;--bg-glow:rgba(27,116,228,.18);
  --surface:#0f172a;--surface-2:#1e293b;--line:#1e293b;
  --text:#e2e8f0;--text-2:#cbd5e1;--muted:#94a3b8;--faint:#64748b;
  --up:#34d399;--down:#fb7185;--shadow:0 1px 2px rgba(0,0,0,.4),0 18px 40px -22px rgba(0,0,0,.9);
  color-scheme:dark;
}}
:root[data-theme="dark"]{
  --bg:#020617;--bg-glow:rgba(27,116,228,.18);
  --surface:#0f172a;--surface-2:#1e293b;--line:#1e293b;
  --text:#e2e8f0;--text-2:#cbd5e1;--muted:#94a3b8;--faint:#64748b;
  --up:#34d399;--down:#fb7185;--shadow:0 1px 2px rgba(0,0,0,.4),0 18px 40px -22px rgba(0,0,0,.9);
  color-scheme:dark;
}

*{box-sizing:border-box}
html,body{min-height:100%}
body{
  margin:0;padding:28px 20px 56px;background:var(--bg);color:var(--text);
  font:15px/1.6 "Hanken Grotesk","Onest",ui-sans-serif,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  background-image:radial-gradient(90rem 34rem at 50% -20rem,var(--bg-glow),transparent 70%);
  background-repeat:no-repeat;
}
h1,h2,h3,.display{font-family:"Bricolage Grotesque","Onest",ui-sans-serif,system-ui,sans-serif}
.wrap{max-width:1140px;margin:0 auto}
a{color:var(--brand);text-decoration:none}
a:hover{color:var(--brand-dark)}
:focus-visible{outline:2px solid var(--brand);outline-offset:2px;border-radius:8px}
.tnum{font-variant-numeric:tabular-nums}

/* header */
.top{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;margin-bottom:22px}
.brandline{display:flex;align-items:center;gap:12px;min-width:0}
.mark{
  width:40px;height:40px;flex:none;border-radius:13px;display:grid;place-items:center;
  background:linear-gradient(140deg,var(--brand),#7c3aed);color:#fff;
  font-family:"Bricolage Grotesque","Onest",sans-serif;font-weight:800;font-size:15px;letter-spacing:.02em;
  box-shadow:0 8px 20px -8px rgba(27,116,228,.7);
}
.top h1{margin:0;font-size:21px;font-weight:700;letter-spacing:-.01em}
.top .sub{margin:1px 0 0;color:var(--muted);font-size:12.5px}
.tools{display:flex;align-items:center;gap:8px}
.btn{
  display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);
  background:var(--surface);color:var(--text-2);border-radius:10px;padding:7px 12px;
  font:inherit;font-size:13px;font-weight:600;cursor:pointer;
  transition:background .18s cubic-bezier(.23,1,.32,1),border-color .18s,transform .18s;
}
.btn:hover{background:var(--surface-2);border-color:var(--faint);color:var(--text)}
.btn:active{transform:translateY(1px)}
.btn.primary{background:var(--brand);border-color:var(--brand);color:#fff;padding:11px 18px;font-size:14px;width:100%;justify-content:center}
.btn.primary:hover{background:var(--brand-dark);border-color:var(--brand-dark);color:#fff}
.btn.ghost{background:transparent}
form.inline{display:inline}

/* day pills */
.days{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:22px}
.day{
  display:inline-flex;align-items:baseline;gap:7px;padding:6px 12px;border-radius:999px;
  border:1px solid var(--line);background:var(--surface);color:var(--text-2);
  font-size:13px;font-weight:600;transition:border-color .18s,background .18s;
}
.day:hover{border-color:var(--brand);color:var(--brand)}
.day b{font-weight:700}
.day .c{font-size:11.5px;font-weight:600;color:var(--faint)}
.day.on{background:var(--brand);border-color:var(--brand);color:#fff;box-shadow:0 8px 18px -10px rgba(27,116,228,.9)}
.day.on .c{color:rgba(255,255,255,.72)}

/* cards */
.card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px;box-shadow:var(--shadow)}
.card h2{
  margin:0 0 14px;font-size:11.5px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:var(--muted);
}
.kpis{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-bottom:16px}
.kpi .v{font-family:"Bricolage Grotesque","Onest",sans-serif;font-size:32px;font-weight:700;line-height:1.1;letter-spacing:-.02em}
.kpi .l{display:block;margin-top:4px;color:var(--muted);font-size:12.5px}
.kpi .row{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}
.delta{font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--surface-2);color:var(--muted)}
.delta.up{color:var(--up)}
.delta.down{color:var(--down)}
/* start, not stretch: a card with two rows shouldn't grow to match a card with
   eight, which just leaves a pane of empty surface. */
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start;margin-bottom:16px}
.wide{margin-bottom:16px}

/* bar chart */
/* align-items:stretch is load-bearing: it gives every column a definite
   height, which is what the bars' percentage heights resolve against. */
.chart{display:flex;align-items:stretch;gap:6px;height:112px}
.col{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;min-width:0}
.col .bar{
  border-radius:6px 6px 3px 3px;background:linear-gradient(180deg,var(--brand),rgba(27,116,228,.45));
  min-height:3px;transition:filter .18s;
}
.col.on .bar{background:linear-gradient(180deg,#7c3aed,var(--brand))}
.col.zero .bar{background:var(--surface-2)}
.col:hover .bar{filter:brightness(1.12)}
.xaxis{display:flex;gap:6px;margin-top:8px}
.xaxis span{flex:1;text-align:center;font-size:10.5px;color:var(--faint);white-space:nowrap;overflow:hidden}

/* ranked lists */
.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:11px}
.list li{display:grid;grid-template-columns:1fr auto;gap:4px 12px;align-items:baseline}
.list .k{font-size:13.5px;color:var(--text-2);overflow-wrap:anywhere}
.list .n{font-size:13.5px;font-weight:700;color:var(--text)}
.list .track{grid-column:1/-1;height:5px;border-radius:999px;background:var(--surface-2);overflow:hidden}
.list .fill{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--brand),#7c3aed)}
.empty{margin:0;color:var(--faint);font-size:13.5px}

/* Q&A */
.qa{display:flex;flex-direction:column;gap:0}
.qa .item{padding:14px 0;border-top:1px solid var(--line)}
.qa .item:first-child{border-top:0;padding-top:0}
.qa .meta{display:flex;flex-wrap:wrap;gap:8px;align-items:center;color:var(--faint);font-size:11.5px;margin-bottom:6px}
.tag{background:var(--surface-2);color:var(--muted);border-radius:999px;padding:1px 8px;font-weight:600}
.qa .q{margin:0 0 6px;font-weight:600;font-size:14.5px}
.qa .a{margin:0;color:var(--muted);font-size:13.5px;white-space:pre-wrap}

/* privacy panel */
.privacy{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between}
.privacy p{margin:0;color:var(--muted);font-size:13px;max-width:62ch}
.privacy b{color:var(--text-2)}
.state{display:inline-flex;align-items:center;gap:7px;font-weight:700;font-size:13px;color:var(--text-2)}
.dot{width:8px;height:8px;border-radius:999px;background:var(--up);box-shadow:0 0 0 3px color-mix(in srgb,var(--up) 20%,transparent)}
.dot.off{background:var(--faint);box-shadow:0 0 0 3px color-mix(in srgb,var(--faint) 20%,transparent)}
.foot{margin:26px 0 0;text-align:center;color:var(--faint);font-size:12px}

/* sign-in */
.auth{min-height:calc(100vh - 84px);display:grid;place-items:center;padding:20px 0}
.modal{
  width:100%;max-width:392px;background:var(--surface);border:1px solid var(--line);
  border-radius:20px;padding:30px 28px;box-shadow:0 30px 70px -30px rgba(2,6,23,.55);
  animation:pop .34s cubic-bezier(.23,1,.32,1) both;
}
@keyframes pop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
.modal .mark{margin-bottom:16px}
.modal h1{margin:0;font-size:23px;font-weight:700;letter-spacing:-.01em}
.modal .sub{margin:6px 0 22px;color:var(--muted);font-size:13.5px}
.field{display:block;margin-bottom:14px}
.field span{display:block;margin-bottom:6px;font-size:12.5px;font-weight:600;color:var(--text-2)}
.field input{
  width:100%;padding:11px 13px;border-radius:11px;border:1px solid var(--line);
  background:var(--bg);color:var(--text);font:inherit;font-size:14.5px;
  transition:border-color .18s,box-shadow .18s;
}
.field input:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px color-mix(in srgb,var(--brand) 22%,transparent)}
.err{
  margin:0 0 16px;padding:10px 12px;border-radius:11px;font-size:13px;font-weight:600;
  background:color-mix(in srgb,var(--down) 12%,transparent);color:var(--down);
  border:1px solid color-mix(in srgb,var(--down) 30%,transparent);
}
.fine{margin:16px 0 0;text-align:center;color:var(--faint);font-size:11.5px}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
}
`;

/* ---- shell ---- */

export const page = ({ title, theme, body }) => `<!doctype html>
<html lang="bg"${theme ? ` data-theme="${esc(theme)}"` : ""}><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>
<style>${STYLE}</style>
</head><body><div class="wrap">${body}</div></body></html>`;

const MARK = '<div class="mark">EM</div>';

/** Theme switch as a link: no JS, and the choice sticks in a cookie. */
const themeToggle = (theme, query) => {
  const next = theme === "dark" ? "light" : "dark";
  const label = theme === "dark" ? "Светла тема" : "Тъмна тема";
  const icon = theme === "dark" ? "☀" : "☾";
  return `<a class="btn ghost" href="?${query}theme=${next}" title="${esc(label)}" aria-label="${esc(
    label
  )}">${icon}</a>`;
};

/* ---- sign-in screen ---- */

export const loginPage = ({ theme, error }) =>
  page({
    title: "Вход · Статистика",
    theme,
    body: `<main class="auth">
  <form class="modal" method="post" action="/stats">
    ${MARK}
    <h1>Статистика</h1>
    <p class="sub">Частен панел за сайта. Достъпен само за собственика.</p>
    ${error ? `<p class="err" role="alert">${esc(error)}</p>` : ""}
    <input type="hidden" name="action" value="login">
    <label class="field">
      <span>Потребител</span>
      <input name="user" autocomplete="username" autocapitalize="none" spellcheck="false" autofocus required>
    </label>
    <label class="field">
      <span>Парола</span>
      <input name="pass" type="password" autocomplete="current-password" required>
    </label>
    <button class="btn primary" type="submit">Вход</button>
    <p class="fine">Сесията остава активна 12 часа на това устройство.</p>
  </form>
</main>`,
  });

/* ---- dashboard pieces ---- */

const pct = (value, max) => (max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0);

/** Ranked list with proportional bars. `rows` is [key, count][], sorted. */
export const rankedList = (title, rows, label = (k) => k, limit = 8) => {
  if (!rows.length) {
    return `<section class="card"><h2>${esc(title)}</h2><p class="empty">Няма данни.</p></section>`;
  }
  const max = rows[0][1];
  const shown = rows.slice(0, limit);
  const rest = rows.slice(limit).reduce((sum, [, n]) => sum + n, 0);

  const items = shown
    .map(
      ([key, count]) => `<li>
      <span class="k">${esc(label(key))}</span>
      <span class="n tnum">${num(count)}</span>
      <span class="track"><i class="fill" style="width:${pct(count, max)}%"></i></span>
    </li>`
    )
    .join("");

  const more = rest
    ? `<li><span class="k" style="color:var(--faint)">още ${rows.length - limit}</span><span class="n tnum" style="color:var(--faint)">${num(
        rest
      )}</span></li>`
    : "";

  return `<section class="card"><h2>${esc(title)}</h2><ul class="list">${items}${more}</ul></section>`;
};

/** Vertical bar chart. `bars` is [{ key, label, value, active }]. */
export const barChart = (title, bars, hint = "") => {
  const max = Math.max(1, ...bars.map((b) => b.value));
  const cols = bars
    .map(
      (b) =>
        `<div class="col${b.active ? " on" : ""}${b.value ? "" : " zero"}" title="${esc(
          `${b.label}: ${num(b.value)}`
        )}"><span class="bar" style="height:${b.value ? pct(b.value, max) : 3}%"></span></div>`
    )
    .join("");
  const axis = bars.map((b) => `<span>${esc(b.axis ?? b.label)}</span>`).join("");

  return `<section class="card wide">
  <h2>${esc(title)}${hint ? ` <span style="text-transform:none;letter-spacing:0;font-weight:600">· ${esc(hint)}</span>` : ""}</h2>
  <div class="chart">${cols}</div>
  <div class="xaxis">${axis}</div>
</section>`;
};

const deltaChip = (current, previous) => {
  if (previous === 0 && current === 0) return "";
  if (previous === 0) return `<span class="delta up">ново</span>`;
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return `<span class="delta">без промяна</span>`;
  const dir = change > 0 ? "up" : "down";
  return `<span class="delta ${dir}">${change > 0 ? "+" : "−"}${Math.abs(change)}%</span>`;
};

export const kpi = (value, label, previous) => `<div class="card kpi">
  <div class="row"><span class="v tnum">${num(value)}</span>${deltaChip(value, previous)}</div>
  <span class="l">${esc(label)}</span>
</div>`;

export const qaList = (rows) => {
  if (!rows.length) return '<p class="empty">Няма зададени въпроси този ден.</p>';
  return `<div class="qa">${rows
    .map(
      (r) => `<div class="item">
      <div class="meta">
        <span class="tnum">${esc(clock(r.ts))}</span>
        <span class="tag">${esc(MODE_LABELS[r.mode] ?? r.mode ?? "въпрос")}</span>
        ${r.lang ? `<span class="tag">${esc(String(r.lang).toUpperCase())}</span>` : ""}
        ${r.country ? `<span>${esc(countryLabel(r.country))}</span>` : ""}
      </div>
      <p class="q">${esc(r.question)}</p>
      <p class="a">${esc(r.answer)}</p>
    </div>`
    )
    .join("")}</div>`;
};

export const header = ({ day, theme, query }) => `<header class="top">
  <div class="brandline">
    ${MARK}
    <div>
      <h1>Статистика</h1>
      <p class="sub">${esc(longDay(day))} · собствен анализ, без външни услуги</p>
    </div>
  </div>
  <div class="tools">
    ${themeToggle(theme, query)}
    <a class="btn ghost" href="/" target="_blank" rel="noopener">Сайтът ↗</a>
    <form class="inline" method="post" action="/stats">
      <input type="hidden" name="action" value="logout">
      <button class="btn" type="submit">Изход</button>
    </form>
  </div>
</header>`;

export const privacyPanel = ({ excluded, day, count }) => `<section class="card privacy">
  <div>
    <span class="state"><span class="dot${excluded ? "" : " off"}"></span>${
      excluded ? "Твоите посещения не се броят" : "Твоите посещения се броят"
    }</span>
    <p style="margin-top:6px">
      ${
        excluded
          ? "Това устройство и текущият ти IP адрес се пропускат при записа. Съхранява се само необратим хеш на адреса, не самият адрес."
          : "Включи изключването, за да не влизат собствените ти посещения в числата. Пази се само необратим хеш на IP адреса, не самият адрес."
      }
      ${count ? `<b>Изключени адреси: ${num(count)}.</b>` : ""}
      Вече записаните събития не се променят с обратна сила.
    </p>
  </div>
  <form method="post" action="/stats">
    <input type="hidden" name="action" value="${excluded ? "include_me" : "exclude_me"}">
    <input type="hidden" name="day" value="${esc(day)}">
    <button class="btn" type="submit">${excluded ? "Брой ме отново" : "Не ме брой"}</button>
  </form>
</section>`;
