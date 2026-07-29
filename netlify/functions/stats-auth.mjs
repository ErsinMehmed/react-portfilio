import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Session handling for the private dashboard. Replaces HTTP Basic Auth: the
// browser's native credential prompt is unstyled, unbranded and impossible to
// localise, so /stats now renders its own sign-in screen and keeps the session
// in a signed cookie.
//
// The cookie is stateless — `<expiry>.<HMAC(expiry)>`, keyed by the site
// secret. Nothing is stored server-side, a tampered expiry fails the MAC, and
// rotating STATS_PASS invalidates every outstanding session for free.

export const SESSION_COOKIE = "stats_session";
export const THEME_COOKIE = "stats_theme";

/** How long one sign-in lasts. */
export const SESSION_HOURS = 12;
const SESSION_MS = SESSION_HOURS * 60 * 60 * 1000;

/** Credentials unset means locked, never open. */
export const isConfigured = () =>
  Boolean(process.env.STATS_USER && process.env.STATS_PASS);

const secret = () => `${process.env.STATS_USER}::${process.env.STATS_PASS}`;

const sign = (payload) => createHmac("sha256", secret()).update(payload).digest("base64url");

const digest = (value) => createHash("sha256").update(String(value)).digest();

// Hashing first makes both sides the same length, so timingSafeEqual can do its
// job without leaking the credential length via an early throw.
const safeEqual = (a, b) => timingSafeEqual(digest(a), digest(b));

/* ---- cookies ---- */

export const readCookie = (req, name) => {
  for (const part of (req.headers.get("cookie") ?? "").split(";")) {
    const sep = part.indexOf("=");
    if (sep === -1) continue;
    if (part.slice(0, sep).trim() === name) {
      return decodeURIComponent(part.slice(sep + 1).trim());
    }
  }
  return "";
};

/** Netlify runs on https; localhost doesn't, and `Secure` would be dropped there. */
export const isSecure = (req) =>
  (req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "")) ===
  "https";

export const buildCookie = (name, value, { maxAge, secure, sameSite = "Strict" }) =>
  [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    `SameSite=${sameSite}`,
    secure ? "Secure" : null,
    `Max-Age=${maxAge}`,
  ]
    .filter(Boolean)
    .join("; ");

/* ---- session ---- */

export const issueSession = () => {
  const expiry = String(Date.now() + SESSION_MS);
  return `${expiry}.${sign(expiry)}`;
};

export const sessionCookie = (req) =>
  buildCookie(SESSION_COOKIE, issueSession(), {
    maxAge: SESSION_MS / 1000,
    secure: isSecure(req),
  });

export const clearedSessionCookie = (req) =>
  buildCookie(SESSION_COOKIE, "", { maxAge: 0, secure: isSecure(req) });

export const hasSession = (req) => {
  if (!isConfigured()) return false;

  const [expiry, mac] = readCookie(req, SESSION_COOKIE).split(".");
  if (!expiry || !mac || !/^\d+$/.test(expiry)) return false;
  if (Number(expiry) < Date.now()) return false;

  try {
    return safeEqual(mac, sign(expiry));
  } catch {
    return false;
  }
};

/** Both halves are always compared, so a wrong username costs the same time. */
export const checkCredentials = (user, pass) => {
  if (!isConfigured()) return false;
  const okUser = safeEqual(user ?? "", process.env.STATS_USER);
  const okPass = safeEqual(pass ?? "", process.env.STATS_PASS);
  return okUser && okPass;
};

/* ---- brute-force throttle ---- */

// Per-instance and therefore best-effort — serverless instances come and go —
// but it still turns an online password guess into an unattractive one, and
// costs nothing when nobody is attacking.
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map();

export const throttleState = (key) => {
  const rec = attempts.get(key);
  if (!rec || Date.now() - rec.first > WINDOW_MS) return { blocked: false, minutes: 0 };
  if (rec.count < MAX_ATTEMPTS) return { blocked: false, minutes: 0 };
  return {
    blocked: true,
    minutes: Math.max(1, Math.ceil((WINDOW_MS - (Date.now() - rec.first)) / 60000)),
  };
};

export const recordFailure = (key) => {
  const rec = attempts.get(key);
  if (!rec || Date.now() - rec.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: Date.now() });
    return;
  }
  rec.count += 1;
};

export const clearFailures = (key) => attempts.delete(key);
