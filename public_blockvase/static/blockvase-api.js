/**
 * Blockvase API: try same-origin /api on :443 first, then :9090 (Cloudflare often blocks non-443;
 * Apache→Docker→host proxy may break if mod_proxy or host.docker.internal is wrong).
 */
function isBlockvasePreviewHost() {
  return window.location.hostname === "dev.blockvase.com";
}

function showBlockvasePreviewBanner() {
  return;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showBlockvasePreviewBanner);
} else {
  showBlockvasePreviewBanner();
}

function blockvaseApiBases() {
  const h = window.location.hostname;
  const proto = window.location.protocol;
  if (h === "blockvase.com" || h === "www.blockvase.com" || h === "dev.blockvase.com") {
    const bases = [window.location.origin + "/api/blockvase"];
    if (h !== "dev.blockvase.com") {
      bases.push(proto + "//blockvase.com:9090/api/blockvase");
    }
    return [...new Set(bases)];
  }
  return [proto + "//" + h + ":9090/api/blockvase"];
}

/** First base (for legacy string concat); prefer blockvaseFetch() for requests. */
const API_BASE = blockvaseApiBases()[0];

/** Public stats on /api/pool and /api/shares. Same-origin :443 only. */
function blockvasePublicFetch(path, options) {
  const raw = String(path || "").trim();
  const suffix = raw.replace(/^\/api\//, "/").replace(/^\//, "");
  return fetch("/api/" + suffix, Object.assign({ credentials: "omit" }, options || {}));
}

/**
 * GET JSON API path (e.g. "/blockchain-info"). Tries each base until one returns 2xx.
 */
async function blockvaseFetch(path, options) {
  const bases = blockvaseApiBases();
  let lastErr = null;
  const requestOptions = Object.assign({ credentials: "include" }, options || {});
  for (const base of bases) {
    try {
      const r = await fetch(base + path, requestOptions);
      if (r.ok) return r;
      if (r.status >= 400 && r.status < 500) return r;
      let hint = "";
      try {
        const t = await r.clone().text();
        if (t && t.length < 240) hint = ": " + t.replace(/\s+/g, " ").trim();
      } catch (_) {}
      lastErr = new Error("HTTP " + r.status + hint);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Failed to fetch");
}

async function blockvaseFetchWithTimeout(path, timeoutMs, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await blockvaseFetch(path, Object.assign({ signal: controller.signal }, options || {}));
  } finally {
    clearTimeout(timer);
  }
}
