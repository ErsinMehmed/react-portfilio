import { putRecord, KIND } from "./analytics-store.mjs";
import { isExcluded } from "./exclude.mjs";
import { classifyUa } from "./ua.mjs";

// Beacon sink for the private /stats dashboard. Deliberately tiny: it records
// what a visitor did, never who they are. No IP is stored (only the country
// Netlify already resolved at the edge) and no cookie is ever set for visitors
// — the one cookie this site can set is the owner's own opt-out (see
// exclude.mjs), which suppresses recording rather than enabling it.

const ALLOWED_ORIGINS = [
  "https://ersin-mehmed.netlify.app",
  "http://localhost:5173",
  "http://localhost:8888",
];

// Known event names; anything else is dropped so a stray caller can't invent
// event types and pollute the dashboard.
const EVENTS = new Set([
  "pageview",
  "cv_download",
  "askcv_open",
  "case_study_open",
  "project_open",
  "copy_email",
  "lang_switch",
  "theme_switch",
  "outbound_click",
  "scroll_depth",
  "section_view",
]);

const BOT = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|preview|monitor|curl|wget|python-requests/i;

const clean = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : undefined;

export default async (req, context) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });

  const origin = req.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(null, { status: 403 });
  }

  // Crawlers and uptime checks would drown the real numbers.
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT.test(ua)) return new Response(null, { status: 204 });

  // The owner's own visits, likewise. Silent 204: the client can't tell the
  // difference and never retries.
  if (await isExcluded(req, context)) return new Response(null, { status: 204 });

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const type = clean(body?.type, 40);
  if (!type || !EVENTS.has(type)) return new Response(null, { status: 400 });

  await putRecord(KIND.event, {
    type,
    // Per-tab random id: lets the dashboard count visits rather than raw
    // pageviews. Dies with the tab, so it never links two visits together.
    sid: clean(body?.sid, 16),
    path: clean(body?.path, 200) ?? "/",
    // First-touch attribution: which link the visit came in through.
    ref: clean(body?.ref, 40),
    referrer: clean(body?.referrer, 200),
    utmSource: clean(body?.utmSource, 60),
    utmMedium: clean(body?.utmMedium, 60),
    utmCampaign: clean(body?.utmCampaign, 60),
    // Free-form extra for a couple of events (e.g. the case-study slug).
    meta: clean(body?.meta, 120),
    lang: clean(body?.lang, 5),
    country: context?.geo?.country?.code ?? undefined,
    // Been here on an earlier day. A boolean the client derives from a stored
    // date, never an id — see the note in src/lib/track.ts.
    returning: body?.returning === true ? true : body?.returning === false ? false : undefined,
    // Coarse buckets only; the raw UA string is not stored.
    ...classifyUa(ua),
  });

  return new Response(null, { status: 204 });
};
