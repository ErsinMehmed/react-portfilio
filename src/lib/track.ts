/**
 * Tiny first-party analytics beacon feeding the private /stats dashboard.
 * No cookies, no third party, no IP — the function only adds the country
 * Netlify already resolved at the edge.
 *
 * The owner's own visits are dropped server-side (netlify/functions/exclude.mjs),
 * toggled from the dashboard; nothing about that is decided here.
 *
 * Attribution: append `?ref=<source>` to any link pointing here and the first
 * page of the visit records where it came from. The ref is then remembered for
 * the rest of the session, so later events stay attributed to the same source,
 * and stripped from the address bar so a shared URL never carries it onward.
 *
 * Canonical refs (keep in sync with the labels in netlify/functions/stats.mjs):
 *   cv-devbg   — the CV uploaded to dev.bg
 *   cv-jobsbg  — the CV uploaded to jobs.bg
 *   cv         — the CV handed out directly / any other copy
 *   linkedin   — LinkedIn profile + posts
 *   github     — GitHub profile
 *   email      — email signature
 *   qr         — the phone QR code
 */

const ENDPOINT = "/.netlify/functions/track";
const REF_KEY = "ref";
const UTM_KEY = "utm";
const SID_KEY = "sid";
const FIRST_SEEN_KEY = "firstSeen";
const RETURNING_KEY = "returning";

/**
 * Per-tab random id, used only to count one visit as one visit instead of N
 * pageviews. It lives in sessionStorage, so it dies with the tab and can never
 * link two visits — not a cookie, not an identity.
 */
export const sessionId = (): string | undefined => {
  try {
    let sid = sessionStorage.getItem(SID_KEY);
    if (!sid) {
      sid = Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return undefined;
  }
};

/**
 * Whether this visitor has been here on an earlier day.
 *
 * Deliberately a boolean, not an identifier: localStorage holds only the date
 * of the first visit, which can't link two sessions to each other or single
 * anyone out. Computed once per tab and cached in sessionStorage so every
 * event in a visit reports the same value.
 */
const isReturning = (): boolean | undefined => {
  try {
    const cached = sessionStorage.getItem(RETURNING_KEY);
    if (cached) return cached === "1";

    const firstSeen = localStorage.getItem(FIRST_SEEN_KEY);
    const today = new Date().toISOString().slice(0, 10);
    const returning = Boolean(firstSeen && firstSeen !== today);

    if (!firstSeen) localStorage.setItem(FIRST_SEEN_KEY, today);
    sessionStorage.setItem(RETURNING_KEY, returning ? "1" : "0");
    return returning;
  } catch {
    return undefined;
  }
};

export type TrackEvent =
  | "pageview"
  | "cv_download"
  | "askcv_open"
  | "case_study_open"
  | "project_open"
  | "copy_email"
  | "lang_switch"
  | "theme_switch"
  | "outbound_click"
  | "scroll_depth"
  | "section_view";

interface Utm {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 40);

/**
 * Reads `?ref` / `?utm_*` off the first URL of the visit, stores them for the
 * session and scrubs them from the address bar. Safe to call on every render:
 * once stored, the stored value wins.
 */
export const captureAttribution = (): void => {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && !sessionStorage.getItem(REF_KEY)) {
      sessionStorage.setItem(REF_KEY, slug(ref));
    }

    const utm: Utm = {};
    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    if (source) utm.utmSource = slug(source);
    if (medium) utm.utmMedium = slug(medium);
    if (campaign) utm.utmCampaign = slug(campaign);
    if (Object.keys(utm).length && !sessionStorage.getItem(UTM_KEY)) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    }

    // Drop the tracking params from the visible URL without a navigation.
    if (ref || source || medium || campaign) {
      ["ref", "utm_source", "utm_medium", "utm_campaign"].forEach((k) =>
        params.delete(k)
      );
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash
      );
    }
  } catch {
    /* private mode / storage disabled — attribution is optional */
  }
};

const storedUtm = (): Utm => {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) ?? "{}") as Utm;
  } catch {
    return {};
  }
};

/** Fire-and-forget; never awaited and never allowed to throw at a caller. */
export const track = (type: TrackEvent, meta?: string): void => {
  try {
    const body = JSON.stringify({
      type,
      sid: sessionId(),
      path: window.location.pathname,
      ref: sessionStorage.getItem(REF_KEY) ?? undefined,
      // Only meaningful on the entry page, which is exactly when it matters.
      referrer: document.referrer || undefined,
      ...storedUtm(),
      meta,
      lang: document.documentElement.lang || undefined,
      returning: isReturning(),
    });

    // keepalive so the beacon still leaves during an unload/navigation.
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* analytics must never break the page */
  }
};

/* ---- automatic signals ---- */

/**
 * Label for a link leaving the site. Hostname plus a short path, so
 * "github.com/ErsinMehmed/x" and "github.com/ErsinMehmed/y" don't collapse
 * into one row while the dashboard still stays readable.
 */
export const outboundLabel = (href: string): string | undefined => {
  try {
    const url = new URL(href, window.location.href);

    if (url.protocol === "mailto:") return "mailto";
    if (url.protocol === "tel:") return "tel";
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    if (url.host === window.location.host) return undefined;

    const path = url.pathname.replace(/\/$/, "");
    return `${url.host.replace(/^www\./, "")}${path}`.slice(0, 60);
  } catch {
    return undefined;
  }
};

/** One delegated listener for every link that leaves the site. */
export const trackOutboundClicks = (): (() => void) => {
  const onClick = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest?.("a[href]");
    const href = link?.getAttribute("href");
    if (!href) return;

    const label = outboundLabel(href);
    if (label) track("outbound_click", label);
  };

  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
};

const DEPTHS = [50, 90] as const;

/** Sections and depths already reported, so a scroll back up sends nothing. */
const seen = new Set<string>();

/**
 * Per-route engagement: how far down the page the visitor got, and which
 * marked sections actually entered the viewport. Call once per pathname and
 * dispose on navigation — the SPA remounts the route subtree, so both the
 * observers and the "already sent" keys are path-scoped.
 */
export const trackPageEngagement = (pathname: string): (() => void) => {
  const once = (key: string, type: TrackEvent, meta: string) => {
    const id = `${pathname}|${key}`;
    if (seen.has(id)) return;
    seen.add(id);
    track(type, meta);
  };

  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // A page that barely scrolls would report 100% for everyone.
      if (scrollable < 240) return;

      const percent = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const depth of DEPTHS) {
        if (percent >= depth) once(`depth:${depth}`, "scroll_depth", `${depth}%`);
      }
    });
  };

  // Sections are marked in the JSX with data-track-section. The route's chunk
  // is lazy, so the nodes usually appear after this runs — hence the
  // MutationObserver rather than a single querySelectorAll.
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const name = (entry.target as HTMLElement).dataset.trackSection;
        if (name) once(`section:${name}`, "section_view", name);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.35 }
  );

  const watched = new WeakSet<Element>();
  const scan = () => {
    document.querySelectorAll("[data-track-section]").forEach((el) => {
      if (watched.has(el)) return;
      watched.add(el);
      io.observe(el);
    });
  };

  const mo = new MutationObserver(scan);

  scan();
  onScroll();
  mo.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", onScroll);
    if (frame) window.cancelAnimationFrame(frame);
    mo.disconnect();
    io.disconnect();
  };
};
