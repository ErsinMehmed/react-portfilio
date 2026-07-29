import { readSettings, hashIp } from "./analytics-store.mjs";

// "Don't count me" filter, shared by every endpoint that records something
// (the beacon and the AI Q&A log). Own visits would otherwise dominate a
// portfolio site's numbers, since the owner opens it far more often than any
// recruiter does.
//
// Three independent ways to be excluded, checked cheapest-first:
//   1. the `stats_optout` cookie, set from the dashboard — follows the browser,
//      so it survives a changing home/mobile IP;
//   2. STATS_EXCLUDE_IPS, a comma-separated env list for fixed addresses
//      (office egress, VPN) that needs no dashboard visit;
//   3. the dashboard-managed list of salted IP digests in the settings blob —
//      self-service, and the raw address is never stored (see hashIp).

export const OPT_OUT_COOKIE = "stats_optout";

/** Netlify resolves the client address at the edge; the header is the fallback. */
export const clientIp = (req, context) =>
  context?.ip || req.headers.get("x-nf-client-connection-ip") || "";

const envIps = () =>
  (process.env.STATS_EXCLUDE_IPS ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

// One blob read per minute per warm instance instead of one per beacon: the
// list changes about once a year, and a beacon must stay fast.
const CACHE_MS = 60_000;
let cache = { at: 0, hashes: null };

const excludedHashes = async () => {
  if (cache.hashes && Date.now() - cache.at < CACHE_MS) return cache.hashes;
  const { excludedIps } = await readSettings();
  cache = { at: Date.now(), hashes: new Set(excludedIps) };
  return cache.hashes;
};

/**
 * Called by the dashboard right after it edits the list. Only clears the
 * instance that handled the click — any other warm instance catches up within
 * CACHE_MS, which is why the dashboard reads the blob directly rather than
 * trusting this cache for what it displays.
 */
export const invalidateExclusions = () => {
  cache = { at: 0, hashes: null };
};

/** True when this request must not be recorded. Never throws. */
export const isExcluded = async (req, context) => {
  try {
    if ((req.headers.get("cookie") ?? "").includes(`${OPT_OUT_COOKIE}=1`)) return true;

    const ip = clientIp(req, context);
    if (!ip) return false;
    if (envIps().includes(ip)) return true;

    return (await excludedHashes()).has(hashIp(ip));
  } catch {
    // Failing open only means one extra recorded visit — never a broken page.
    return false;
  }
};
