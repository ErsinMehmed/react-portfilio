// Coarse device buckets from the User-Agent header.
//
// Three low-cardinality strings — form factor, OS family, browser family — and
// nothing else. The raw UA is never stored: a full UA string plus IP is a
// serviceable fingerprint, while "мобилно / iOS / Safari" answers the only
// question worth asking here, which is whether recruiters read the CV on a
// phone. Version numbers are deliberately dropped for the same reason.

const has = (ua, needle) => ua.includes(needle);

/** "mobile" | "tablet" | "desktop" */
export const deviceOf = (ua = "") => {
  const s = ua.toLowerCase();
  if (has(s, "ipad") || (has(s, "android") && !has(s, "mobile")) || has(s, "tablet")) {
    return "tablet";
  }
  if (has(s, "mobi") || has(s, "iphone") || has(s, "ipod") || has(s, "android")) {
    return "mobile";
  }
  return "desktop";
};

export const osOf = (ua = "") => {
  const s = ua.toLowerCase();
  if (has(s, "iphone") || has(s, "ipad") || has(s, "ipod")) return "iOS";
  if (has(s, "android")) return "Android";
  if (has(s, "windows")) return "Windows";
  // "Mac OS X" also appears in iPadOS desktop-mode UAs, so it must come last.
  if (has(s, "mac os")) return "macOS";
  if (has(s, "cros")) return "ChromeOS";
  if (has(s, "linux")) return "Linux";
  return "друга";
};

// Order matters: every Chromium browser claims "Chrome", and Chrome itself
// claims "Safari", so the specific brands have to be tested first.
export const browserOf = (ua = "") => {
  const s = ua.toLowerCase();
  if (has(s, "edg/")) return "Edge";
  if (has(s, "opr/") || has(s, "opera")) return "Opera";
  if (has(s, "samsungbrowser")) return "Samsung Internet";
  if (has(s, "firefox") || has(s, "fxios")) return "Firefox";
  if (has(s, "crios") || has(s, "chrome") || has(s, "chromium")) return "Chrome";
  if (has(s, "safari")) return "Safari";
  return "друг";
};

export const classifyUa = (ua = "") => ({
  device: deviceOf(ua),
  os: osOf(ua),
  browser: browserOf(ua),
});
