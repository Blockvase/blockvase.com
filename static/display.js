let previousHeight = null;
let previousMempool = null;
let previousBlockHeight = null;
let lastAnimatedBlockHeight = null;
let setupStage = "connect";
let hasApClientConnected = false;
let isTransitioning = false;
let mempoolTxIds = new Set();
let lastMempoolTxs = [];
let mempoolPollInFlight = false;
let historicalBlockActive = false;
let mempoolAnimationStarted = false;
let initialKioskMempoolDelayDone = false;
let lastMempoolSuccessAt = 0;
let mempoolStaleNoticeShown = false;
/** Kiosk (/display): overlay stays up until first treemap render or a confirmed empty mempool (avoids flipping vs loading text). */
let kioskMempoolEmptyConfirmed = false;
let mempoolPerfProfile = null;
let mempoolAnimationsPaused = false;
let mempoolPollTimer = null;
let mempoolVisibilityBound = false;
let mempoolIntersectionBound = false;
let mempoolResizeTimer = null;

function isPortalEmbed() {
  try {
    if (new URLSearchParams(location.search).get("embed") === "1") return true;
    return window.self !== window.top;
  } catch (_) {
    return true;
  }
}

function isMobilePerf() {
  return window.matchMedia("(max-width: 768px), (pointer: coarse) and (hover: none)").matches;
}

function getMempoolPerfProfile() {
  if (mempoolPerfProfile) return mempoolPerfProfile;
  const embed = isPortalEmbed();
  const mobile = isMobilePerf();
  const constrained = embed || mobile;
  let apiLimit = null;
  const bodyLim = document.body.dataset.mempoolTxLimit;
  if (bodyLim && /^\d+$/.test(bodyLim)) {
    apiLimit = parseInt(bodyLim, 10);
  } else {
    const qLim = new URLSearchParams(location.search).get("limit");
    if (qLim && /^\d+$/.test(qLim)) apiLimit = parseInt(qLim, 10);
    /* Canvas rendering allows default display/embed/standalone views to request all txs. */
  }
  mempoolPerfProfile = {
    constrained,
    embed,
    mobile,
    apiLimit,
    reduceFlashAt: constrained ? 180 : 500,
    ultraHighAt: constrained ? 320 : 1500,
    extremeAt: constrained ? 450 : 2000,
    minAnimArea: constrained ? 1.25 : 0.8,
    flashRatioExtreme: constrained ? 0.12 : 0.25,
    flashRatioUltra: constrained ? 0.2 : 1 / 3,
    flashRatioHigh: constrained ? 0.32 : 0.5,
    skipAnimStyleJitter: constrained,
    pollMs: embed && mobile ? 8000 : embed ? 7000 : mobile ? 6000 : 5000,
  };
  return mempoolPerfProfile;
}

function mempoolTxsApiUrl() {
  const profile = getMempoolPerfProfile();
  if (profile.apiLimit != null && profile.apiLimit > 0) {
    return "/mempool-txs?limit=" + encodeURIComponent(String(profile.apiLimit));
  }
  return "/mempool-txs";
}

function setMempoolAnimationsPaused(paused) {
  mempoolAnimationsPaused = paused;
  const container = document.getElementById("mempool-treemap");
  if (container) container.classList.toggle("mempool-animations-paused", paused);
  if (mempoolScene) mempoolScene.setPaused(paused);
}

function initMempoolPerfControls() {
  if (!mempoolVisibilityBound) {
    mempoolVisibilityBound = true;
    document.addEventListener("visibilitychange", () => {
      setMempoolAnimationsPaused(document.visibilityState !== "visible");
    });
    setMempoolAnimationsPaused(document.visibilityState !== "visible");
  }
  const container = document.getElementById("mempool-treemap");
  if (container && !mempoolIntersectionBound && typeof IntersectionObserver !== "undefined") {
    mempoolIntersectionBound = true;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.05);
        if (document.visibilityState === "visible") {
          setMempoolAnimationsPaused(!visible);
        }
      },
      { threshold: [0, 0.05, 0.15] }
    );
    io.observe(container);
  }
}

function scheduleMempoolPollLoop() {
  const profile = getMempoolPerfProfile();
  if (mempoolPollTimer) clearInterval(mempoolPollTimer);
  mempoolPollTimer = setInterval(pollMempoolIfLive, profile.pollMs);
}

const ANIM_OUT = 400;
const ANIM_IN = 400;
const CONFIRM_CELEBRATION_COOLDOWN_MS = 10000;
const CONFIRM_EXIT_FADE_MS = 450;
const CONFIRM_ENTER_FADE_MS = 650;
const CONFIRM_SLOT_MS = 18;
const CONFIRM_BLOCKS_PER_SLOT = 24;
const CONFIRM_SETTLE_MS = 900;
const MINER_CONFIRMATION_MS = 9000;
const MINER_FLASH_MS = 950;
const MINER_FLASH_TICK_MS = 100;
let lastCelebrationAt = 0;
let confirmFlashTimer = null;
let confirmationRebuildInProgress = false;
let suppressNextNetworkConfirmation = false;
let minerConfirmationTimer = null;
const confirmationCleanupTimers = new Set();
let mempoolScene = null;
/** Ignore BroadcastChannel echoes from this tab (same page posts and receives block-confirmed). */
const blockvaseBcInstanceId =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "bc-" + Math.random().toString(36).slice(2);

const BLOCK_COLORS_DEFAULT = [
  "#f7931a", "#f59e0b", "#ea580c", "#d97706", "#b45309",
  "#92400e", "#78350f", "#fbbf24", "#fcd34d", "#fde68a",
];
const BLOCK_COLORS_OCEAN = [
  "#0ea5e9", "#06b6d4", "#22d3ee", "#2dd4bf", "#34d399",
  "#14b8a6", "#0d9488", "#0891b2", "#0284c7", "#0c4a6e",
  "#155e75", "#164e63", "#5eead4", "#67e8f9", "#99f6e4",
];
const BLOCK_COLORS_BW_BLACK = [
  "#111111", "#2a2a2a", "#444444", "#1a1a1a", "#000000",
  "#3a3a3a", "#222222", "#4a4a4a", "#333333", "#141414",
];
const BLOCK_COLORS_BW_WHITE = [
  "#ffffff", "#e8e8e8", "#cfcfcf", "#b3b3b3", "#969696",
  "#7a7a7a", "#d9d9d9", "#f5f5f5", "#a6a6a6", "#ececec",
];
const BLOCK_COLORS_BW_GLOW = [
  "#1a1208", "#2a1a0c", "#3d2410", "#24160a", "#4a2c12",
  "#1c1409", "#5c3614", "#2e1c0e", "#6b3e16", "#16100a",
];

function normalizeBwMode(mode) {
  const raw = String(mode || "").trim().toLowerCase();
  if (raw === "white" || raw === "black" || raw === "glow") return raw;
  return "glow";
}

function currentBwMode() {
  const raw = (document.body && document.body.getAttribute("data-bw")) || document.documentElement.getAttribute("data-bw") || "";
  return normalizeBwMode(raw);
}

function applyBwMode() {
  document.documentElement.removeAttribute("data-bw");
  document.documentElement.classList.remove("soft-skin");
  document.documentElement.style.backgroundColor = "#110f0d";
  if (document.body) {
    document.body.removeAttribute("data-bw");
    document.body.classList.remove("soft-skin");
    document.body.style.backgroundColor = "#110f0d";
  }
}

const BLOCK_COLORS_STUDIO = [
  "#e4b07a", "#e09a52", "#c46a2e", "#b85a2e", "#d4894a",
  "#8c4a28", "#a85224", "#c67a3a", "#d4a06a", "#9a5230",
];

function mempoolColorPalette() {
  return BLOCK_COLORS_STUDIO;
}

function mempoolHighlightColor() {
  return "#e4b07a";
}

function mixHex(a, b, t) {
  const parse = function (hex) {
    const n = String(hex || "").replace("#", "");
    const full = n.length === 3 ? n[0] + n[0] + n[1] + n[1] + n[2] + n[2] : n;
    return {
      r: parseInt(full.slice(0, 2), 16) || 0,
      g: parseInt(full.slice(2, 4), 16) || 0,
      b: parseInt(full.slice(4, 6), 16) || 0,
    };
  };
  const pa = parse(a);
  const pb = parse(b);
  const to = function (n) {
    return ("0" + Math.max(0, Math.min(255, Math.round(n))).toString(16)).slice(-2);
  };
  return "#" + to(pa.r + (pb.r - pa.r) * t) + to(pa.g + (pb.g - pa.g) * t) + to(pa.b + (pb.b - pa.b) * t);
}

function mempoolTileFill(ctx, color, rect) {
  const g = ctx.createLinearGradient(rect.x, rect.y + rect.height, rect.x + rect.width, rect.y);
  g.addColorStop(0, mixHex(color, "#5c2a14", 0.12));
  g.addColorStop(0.38, color);
  g.addColorStop(0.72, mixHex(color, "#e4a86a", 0.14));
  g.addColorStop(1, mixHex(color, "#e8b070", 0.22));
  return g;
}

function recolorMempoolScene() {
  const container = document.getElementById("mempool-treemap");
  if (!container) return;
  const scene = typeof getMempoolScene === "function" ? getMempoolScene(container) : mempoolScene;
  if (!scene || !scene.blocks) return;
  const palette = mempoolColorPalette();
  for (const [txid, block] of scene.blocks) {
    const id = (block.tx && block.tx.txid) || txid;
    const colorIdx = Math.floor(txidHash(id) * palette.length) % palette.length;
    block.color = palette[colorIdx];
  }
  scene.requestDraw();
}
/* Per-session random offset so animations don't sync across different browser instances */
const ANIM_OFFSET = Math.random() * 20;
function fmt(v) {
  return Number(v || 0).toLocaleString();
}

/* Deterministic 0..1 from txid for stable per-block values */
function txidHash(txid) {
  if (!txid) return 0;
  let h = 0;
  for (let i = 0; i < txid.length; i++) h = ((h << 5) - h + txid.charCodeAt(i)) | 0;
  return ((h >>> 0) % 10007) / 10007;
}

/* Second hash (FNV-style, reverse order) for decorrelated values */
function txidHash2(txid) {
  if (!txid) return 0;
  let h = 2166136261;
  for (let i = txid.length - 1; i >= 0; i--) {
    h ^= txid.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10007) / 10007;
}

function setVisible(elId, visible) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.classList.toggle("hidden", !visible);
}

function isDisplayKiosk() {
  return document.body.classList.contains("display-kiosk");
}

function hasUsableMempoolAnimation() {
  return mempoolAnimationStarted && lastMempoolTxs.length > 0;
}

function hasRecentMempoolUpdate() {
  return (
    hasUsableMempoolAnimation() &&
    lastMempoolSuccessAt &&
    Date.now() - lastMempoolSuccessAt < DISPLAY_MEMPOOL_STALE_MS
  );
}

function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function randomizedGroupedDelays(count, slotMs, groupSize) {
  if (count <= 1) return [0];
  const delays = Array.from({ length: count }, (_, i) => Math.floor(i / groupSize) * slotMs);
  for (let i = delays.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [delays[i], delays[j]] = [delays[j], delays[i]];
  }
  return delays;
}

function isConfirmationBusy() {
  return (
    confirmationRebuildInProgress ||
    confirmFlashTimer !== null ||
    minerConfirmationTimer !== null ||
    Boolean(mempoolScene?.confirmationBusy)
  );
}

function trackConfirmationCleanupTimer(timer) {
  confirmationCleanupTimers.add(timer);
  return timer;
}

function clearConfirmationCleanupTimers() {
  for (const timer of confirmationCleanupTimers) clearInterval(timer);
  confirmationCleanupTimers.clear();
}

function resetConfirmationEnterBlock(block) {
  block.classList.remove("confirmation-enter");
  block.style.removeProperty("--confirmation-enter-delay");
  block.style.removeProperty("--confirmation-fade-duration");
  block.style.removeProperty("--confirmation-fly-x");
  block.style.removeProperty("--confirmation-fly-y");
}

function confirmationCenterVectorForElement(el, container) {
  const c = container.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return {
    x: (c.left + c.width / 2 - (r.left + r.width / 2)).toFixed(1) + "px",
    y: (c.top + c.height / 2 - (r.top + r.height / 2)).toFixed(1) + "px",
  };
}

function confirmationCenterVectorForRect(rect, containerWidth, containerHeight) {
  return {
    x: (((50 - (rect.x + rect.width / 2)) / 100) * containerWidth).toFixed(1) + "px",
    y: (((50 - (rect.y + rect.height / 2)) / 100) * containerHeight).toFixed(1) + "px",
  };
}

function freezeBlockAtCurrentRect(el, container) {
  const c = container.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  if (!c.width || !c.height || !r.width || !r.height) return;
  el.style.transition = "none";
  el.style.setProperty("--tx", (((r.left - c.left) / c.width) * 100).toFixed(4) + "%");
  el.style.setProperty("--ty", (((r.top - c.top) / c.height) * 100).toFixed(4) + "%");
  el.style.setProperty("--tw", (r.width / c.width).toFixed(4));
  el.style.setProperty("--th", (r.height / c.height).toFixed(4));
}

function metricEscape(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function radialRingSvg(percent, opts) {
  opts = opts || {};
  const size = opts.size || 56;
  const stroke = opts.stroke || 4;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const c = 2 * Math.PI * r;
  let fill = "";
  if (percent != null && Number.isFinite(Number(percent))) {
    const pct = Math.min(100, Math.max(0, Number(percent)));
    const offset = c * (1 - pct / 100);
    const accent = opts.accent ? " radial-ring-fill--accent" : "";
    fill =
      '<circle class="radial-ring-fill' +
      accent +
      '" cx="' +
      cx +
      '" cy="' +
      cx +
      '" r="' +
      r +
      '" fill="none" stroke-width="' +
      stroke +
      '" stroke-dasharray="' +
      c.toFixed(2) +
      '" stroke-dashoffset="' +
      offset.toFixed(2) +
      '" transform="rotate(-90 ' +
      cx +
      " " +
      cx +
      ')"/>';
  }
  return (
    '<svg class="radial-ring" width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 ' +
    size +
    " " +
    size +
    '" aria-hidden="true"><circle class="radial-ring-track" cx="' +
    cx +
    '" cy="' +
    cx +
    '" r="' +
    r +
    '" fill="none" stroke-width="' +
    stroke +
    '"/>' +
    fill +
    "</svg>"
  );
}

function radialMetricHtml(opts) {
  const label = opts.label || "";
  const value = opts.value != null ? opts.value : "N/A";
  const sub = opts.sub || "";
  const unit = opts.unit || "";
  const sizeKey = opts.size === "lg" ? "lg" : opts.size === "sm" ? "sm" : "md";
  const sizes = { sm: 58, md: 66, lg: 84 };
  const svgSize = sizes[sizeKey];
  const accent = opts.accent ? " radial-metric--accent" : "";
  const highlight = opts.highlight ? " radial-metric--highlight" : "";
  const valueClass = opts.valueClass || "";
  const ring = radialRingSvg(opts.percent, {
    size: svgSize,
    stroke: sizeKey === "lg" ? 5 : 4,
    accent: opts.accent || opts.highlight,
  });
  const valueHtml =
    typeof value === "string" && value.indexOf("<") >= 0 ? value : metricEscape(String(value));
  const unitHtml = unit
    ? '<span class="radial-metric-unit">' + metricEscape(unit) + "</span>"
    : "";
  const subHtml = sub
    ? '<span class="radial-metric-sub">' +
      (typeof sub === "string" && sub.indexOf("<") >= 0 ? sub : metricEscape(sub)) +
      "</span>"
    : "";
  return (
    '<div class="radial-metric radial-metric--' +
    sizeKey +
    accent +
    highlight +
    '" role="group" aria-label="' +
    metricEscape(label) +
    '"><div class="radial-metric-graphic">' +
    ring +
    '<div class="radial-metric-value-stack ' +
    valueClass +
    '"><span class="radial-metric-value">' +
    valueHtml +
    "</span>" +
    unitHtml +
    '</div></div><span class="radial-metric-label">' +
    metricEscape(label) +
    "</span>" +
    subHtml +
    "</div>"
  );
}

function syncCellHtml(label, value) {
  const valueHtml =
    typeof value === "string" && value.indexOf("<") >= 0 ? value : metricEscape(String(value ?? "N/A"));
  return (
    '<span class="sync-metric-value">' +
    valueHtml +
    '</span><span class="sync-metric-label">' +
    metricEscape(label) +
    "</span>"
  );
}

const SYNC_SPINNER = '<span class="sync-spinner" aria-hidden="true"></span>';

const syncMetricsCache = {
  blocks: null,
  headers: null,
  progress: null,
  disk: null,
  peers: null,
  verificationProgress: null,
};

let lastSyncUiState = { connected: false, ibd: false, showOverlay: false };
let syncOverlayFetchInFlight = false;
/** Once display-sync reports IBD, keep "Syncing" titles if a later response is briefly disconnected. */
let lastSeenIbdFromDisplaySync = false;

function formatBytes(b) {
  const n = Number(b) || 0;
  if (n >= 1e9) return (n / 1e9).toFixed(2) + " GB";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + " MB";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + " KB";
  return n + " B";
}

function resetSyncMetricsCache() {
  syncMetricsCache.blocks = null;
  syncMetricsCache.headers = null;
  syncMetricsCache.progress = null;
  syncMetricsCache.disk = null;
  syncMetricsCache.peers = null;
  syncMetricsCache.verificationProgress = null;
  lastSyncUiState = { connected: false, ibd: false, showOverlay: false };
  lastSeenIbdFromDisplaySync = false;
  kioskMempoolEmptyConfirmed = false;
}

function showKnotsStartingOverlay() {
  if (!isDisplayKiosk()) return;
  const titleEl = document.getElementById("sync-status-title");
  const subEl = document.getElementById("sync-status-sub");
  if (titleEl) titleEl.textContent = "Bitcoin Knots is starting";
  if (subEl) subEl.textContent = "Mempool updates have not succeeded for several minutes. The display will resume automatically when the node responds.";
  applySyncMetricsToDom();
  lastSyncUiState = { connected: false, ibd: false, showOverlay: true };
  setSyncOverlayVisible(true);
}

function maybeShowDisplayStaleOverlay() {
  if (!isDisplayKiosk() || mempoolAnimationStarted || !hasUsableMempoolAnimation() || !lastMempoolSuccessAt) return false;
  if (hasRecentMempoolUpdate()) return false;
  showKnotsStartingOverlay();
  mempoolStaleNoticeShown = true;
  return true;
}

function setSyncOverlayVisible(visible) {
  const overlay = document.getElementById("sync-status-overlay");
  if (!overlay) return;
  overlay.classList.toggle("hidden", !visible);
  overlay.setAttribute("aria-hidden", visible ? "false" : "true");
}

function applySyncMetricsToDom() {
  const setMetricHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  const c = syncMetricsCache;
  const vpPct = c.verificationProgress != null ? c.verificationProgress * 100 : null;

  const progressRadial = document.getElementById("sync-progress-radial");
  if (progressRadial) {
    if (vpPct != null) {
      progressRadial.innerHTML = radialMetricHtml({
        label: "Chain verification",
        value: c.progress != null ? c.progress : SYNC_SPINNER,
        percent: vpPct,
        size: "lg",
        highlight: true,
      });
      progressRadial.setAttribute("aria-hidden", "false");
    } else {
      progressRadial.innerHTML = "";
      progressRadial.setAttribute("aria-hidden", "true");
    }
  }

  setMetricHtml(
    "sync-metric-blocks",
    syncCellHtml("Block height", c.blocks != null ? c.blocks : SYNC_SPINNER)
  );
  setMetricHtml(
    "sync-metric-headers",
    syncCellHtml("Headers", c.headers != null ? c.headers : SYNC_SPINNER)
  );
  setMetricHtml(
    "sync-metric-progress",
    syncCellHtml("Verified", c.progress != null ? c.progress : SYNC_SPINNER)
  );
  setMetricHtml(
    "sync-metric-disk",
    syncCellHtml("Chain data", c.disk != null ? c.disk : SYNC_SPINNER)
  );
  setMetricHtml(
    "sync-metric-peers",
    syncCellHtml("Server node peers", c.peers != null ? c.peers : SYNC_SPINNER)
  );
}

function fillSyncMetricsCacheFromApi(d) {
  const vp = d.verificationprogress != null ? Number(d.verificationprogress) : 0;
  syncMetricsCache.blocks = fmt(d.blocks);
  syncMetricsCache.headers = fmt(d.headers != null ? d.headers : d.blocks);
  syncMetricsCache.progress = (vp * 100).toFixed(2) + "%";
  syncMetricsCache.disk = formatBytes(d.size_on_disk);
  syncMetricsCache.peers = fmt(d.connections);
  syncMetricsCache.verificationProgress = vp;
}

async function updateSyncOverlay() {
  if (!document.body.classList.contains("display-kiosk")) {
    setSyncOverlayVisible(false);
    return;
  }
  const overlay = document.getElementById("sync-status-overlay");
  if (!overlay) return;
  const liveScreen = document.getElementById("live-screen");
  if (!liveScreen || liveScreen.classList.contains("hidden")) {
    setSyncOverlayVisible(false);
    return;
  }

  if (maybeShowDisplayStaleOverlay()) return;

  if (syncOverlayFetchInFlight) return;
  syncOverlayFetchInFlight = true;

  try {
    let d;
    try {
      const resp = await blockvaseFetch("/display-sync");
      if (!resp.ok) {
        applySyncMetricsToDom();
        setSyncOverlayVisible(mempoolAnimationStarted || hasRecentMempoolUpdate() ? false : lastSyncUiState.showOverlay);
        return;
      }
      d = await resp.json();
    } catch (_) {
      applySyncMetricsToDom();
      setSyncOverlayVisible(mempoolAnimationStarted || hasRecentMempoolUpdate() ? false : lastSyncUiState.showOverlay);
      return;
    }

    if (!d || typeof d !== "object") {
      applySyncMetricsToDom();
      setSyncOverlayVisible(mempoolAnimationStarted || hasRecentMempoolUpdate() ? false : lastSyncUiState.showOverlay);
      return;
    }

    const connected = d.connected === true;
    const ibd = Boolean(d.initialblockdownload);
    const mempoolAlreadyRendered = mempoolAnimationStarted || hasRecentMempoolUpdate();
    /* Keep full-screen sync / "Knots starting" on kiosk until treemap has actually painted
       (or we've confirmed an empty mempool on a live node). Do not rely only on JSON-RPC sync status. */
    const kioskMempoolRevealPending =
      isDisplayKiosk() &&
      connected &&
      !ibd &&
      !mempoolAnimationStarted &&
      !kioskMempoolEmptyConfirmed;

    const showOverlay =
      (ibd && !mempoolAlreadyRendered) || (!connected && !mempoolAlreadyRendered) || kioskMempoolRevealPending;

    const titleEl = document.getElementById("sync-status-title");
    const subEl = document.getElementById("sync-status-sub");

    if (connected) {
      fillSyncMetricsCacheFromApi(d);
      applySyncMetricsToDom();
      if (ibd) {
        lastSeenIbdFromDisplaySync = true;
      } else {
        lastSeenIbdFromDisplaySync = false;
      }
      if (kioskMempoolRevealPending) {
        if (titleEl) titleEl.textContent = "Bitcoin Knots is starting";
        if (subEl) subEl.textContent = "Preparing the mempool animation…";
      } else if (titleEl)
        titleEl.textContent = ibd ? "Syncing blockchain" : "Blockchain sync";
      if (!kioskMempoolRevealPending && subEl) {
        subEl.textContent = ibd
          ? "Initial block download and verification in progress."
          : "";
      }
    } else {
      applySyncMetricsToDom();
      if (titleEl) {
        titleEl.textContent = lastSeenIbdFromDisplaySync ? "Syncing blockchain" : "Bitcoin Knots is starting";
      }
      if (subEl) {
        subEl.textContent = lastSeenIbdFromDisplaySync
          ? "Initial block download and verification in progress."
          : "Metrics will appear when the node is ready.";
      }
    }

    lastSyncUiState = { connected, ibd, showOverlay };
    setSyncOverlayVisible(showOverlay);
  } finally {
    syncOverlayFetchInFlight = false;
  }
}

function tickSyncOverlay() {
  if (!document.body.classList.contains("display-kiosk")) return;
  const liveScreen = document.getElementById("live-screen");
  if (!liveScreen || liveScreen.classList.contains("hidden")) return;
  updateSyncOverlay();
}

/* ── Treemap layout (recursive slice by half) ───────────── */
function layoutTreemapRec(items, rect, result) {
  if (items.length === 0) return;
  if (items.length === 1) {
    result.push({
      ...items[0],
      x: rect.x, y: rect.y, width: rect.width, height: rect.height,
    });
    return;
  }
  const total = items.reduce((s, c) => s + (c.size || 1), 0);
  if (total <= 0) return;
  let acc = 0;
  const half = total / 2;
  let i = 0;
  for (; i < items.length && acc < half; i++) {
    acc += items[i].size || 1;
  }
  const left = items.slice(0, i);
  const right = items.slice(i);
  const leftSum = left.reduce((s, c) => s + (c.size || 1), 0);
  const rightSum = right.reduce((s, c) => s + (c.size || 1), 0);
  if (leftSum <= 0 || rightSum <= 0) {
    items.forEach((it) => result.push({ ...it, x: rect.x, y: rect.y, width: rect.width, height: rect.height }));
    return;
  }
  const ratio = leftSum / (leftSum + rightSum);
  if (rect.width >= rect.height) {
    const w = rect.width * ratio;
    layoutTreemapRec(left, { x: rect.x, y: rect.y, width: w, height: rect.height }, result);
    layoutTreemapRec(right, { x: rect.x + w, y: rect.y, width: rect.width - w, height: rect.height }, result);
  } else {
    const h = rect.height * ratio;
    layoutTreemapRec(left, { x: rect.x, y: rect.y, width: rect.width, height: h }, result);
    layoutTreemapRec(right, { x: rect.x, y: rect.y + h, width: rect.width, height: rect.height - h }, result);
  }
}

function layoutTreemap(items, width, height) {
  const total = items.reduce((s, i) => s + (i.size || 1), 0);
  if (total <= 0 || width <= 0 || height <= 0) return [];
  const normalized = items.map((i) => ({ ...i, size: Math.max(i.size || 1, 1) }));
  const result = [];
  layoutTreemapRec(normalized, { x: 0, y: 0, width, height }, result);
  return result.map((r) => ({
    ...r,
    x: (r.x / width) * 100,
    y: (r.y / height) * 100,
    width: (r.width / width) * 100,
    height: (r.height / height) * 100,
  }));
}

/* ── QR transition helpers ────────────────────────────── */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function transitionQr(newStage) {
  if (isTransitioning) return;
  isTransitioning = true;

  const qr = document.getElementById("setup-qr");
  const label = document.getElementById("setup-stage-label");

  if (qr) qr.classList.add("qr-exit");
  if (label) label.classList.add("qr-exit");
  await sleep(ANIM_OUT);

  if (newStage === "connect") {
    if (label) label.textContent = "Scan to connect to the Blockvase setup Wi\u2011Fi";
    if (qr) qr.src = "/api/setup-qr.svg?kind=connect";
  } else {
    if (label) label.textContent = "Scan to open the setup page";
    if (qr) qr.src = "/api/setup-qr.svg?kind=settings";
  }

  if (qr) { qr.classList.remove("qr-exit"); qr.classList.add("qr-enter"); }
  if (label) { label.classList.remove("qr-exit"); label.classList.add("qr-enter"); }
  void (qr && qr.offsetWidth);
  await sleep(80);

  if (qr) qr.classList.remove("qr-enter");
  if (label) label.classList.remove("qr-enter");
  await sleep(ANIM_IN);

  isTransitioning = false;
}

function setQrImmediate(stage) {
  const qr = document.getElementById("setup-qr");
  const label = document.getElementById("setup-stage-label");

  if (stage === "connect") {
    if (label) label.textContent = "Scan to connect to the Blockvase setup Wi\u2011Fi";
    if (qr) qr.src = "/api/setup-qr.svg?kind=connect";
  } else {
    if (label) label.textContent = "Scan to open the setup page";
    if (qr) qr.src = "/api/setup-qr.svg?kind=settings";
  }
}

/* ── Polling ──────────────────────────────────────────── */

async function pollSetupState() {
  await ensureTheme();
  let status;
  try {
    const resp = await blockvaseFetch("/setup-status");
    if (!resp.ok) return;
    status = await resp.json();
  } catch (_) {
    return;
  }

  if (!status.setup_complete) {
    setVisible("setup-screen", true);
    setVisible("live-screen", false);
    resetSyncMetricsCache();
    setSyncOverlayVisible(false);
    await renderSetupQr();
    return;
  }

  setVisible("setup-screen", false);
  setVisible("live-screen", true);

  try {
    await pollMempool();
    await updateSyncOverlay();
  } catch (_) {
  }
}

async function renderSetupQr() {
  try {
    const apInfo = await (await blockvaseFetch("/ap-info")).json();
    if (Number(apInfo.ap_clients || 0) > 0) hasApClientConnected = true;
  } catch (_) {
    return;
  }

  const newStage = hasApClientConnected ? "settings" : "connect";

  if (firstRender) {
    firstRender = false;
    setupStage = newStage;
    setQrImmediate(newStage);
    return;
  }

  if (newStage !== setupStage) {
    setupStage = newStage;
    await transitionQr(newStage);
  }
}

let firstRender = true;

async function ensureTheme() {
  try {
    const r = await blockvaseFetch("/theme");
    const d = await r.json();
    if (d.theme) document.body.dataset.theme = d.theme;
  } catch (_) {}
}

let pendingResumeSelectTxid = null;

function applyHistoricalBlock(txs, selectTxid) {
  historicalBlockActive = true;
  pendingResumeSelectTxid = null;
  const list = Array.isArray(txs) ? txs.filter((t) => t && t.txid) : [];
  lastMempoolTxs = list;
  const container = document.getElementById("mempool-treemap");
  if (!container) return;
  setMempoolAnimationsPaused(false);
  const scene = getMempoolScene(container);
  scene.lastTxs = [];
  scene.clear();
  if (!list.length) {
    showMempoolMessage(container, "No transactions in this block.");
    return;
  }
  scene.setTransactions(list, { forceNewBlocks: true, blockFound: false });
  scene.setPaused(false);
  scene.start();
  scene.requestDraw();
  if (selectTxid) selectMempoolTransaction(selectTxid);
}

function resumeLiveMempool(selectTxid) {
  pendingResumeSelectTxid = selectTxid || null;
  historicalBlockActive = false;
  setMempoolAnimationsPaused(false);
  const container = document.getElementById("mempool-treemap");
  if (container) {
    const scene = getMempoolScene(container);
    scene.setPaused(false);
    scene.start();
  }
  if (selectTxid && selectMempoolTransaction(selectTxid)) pendingResumeSelectTxid = null;
  pollMempool();
}

async function pollMempool() {
  if (historicalBlockActive || mempoolPollInFlight) return;
  mempoolPollInFlight = true;
  try {
    const container = document.getElementById("mempool-treemap");
    let d;
    try {
      const resp = await blockvaseFetchWithTimeout(mempoolTxsApiUrl(), MEMPOOL_FETCH_TIMEOUT_MS);
      if (!resp.ok) {
        if (resp.status === 404) {
          if (isDisplayKiosk()) kioskMempoolEmptyConfirmed = false;
          if (!hasUsableMempoolAnimation() && container) {
            showMempoolMessage(container, "API not found (404). Run: sudo systemctl restart blockvase");
          }
          void updateSyncOverlay();
          return;
        }
        throw new Error("HTTP " + resp.status);
      }
      d = await resp.json();
    } catch (err) {
      if (isDisplayKiosk()) kioskMempoolEmptyConfirmed = false;
      if (hasUsableMempoolAnimation()) {
        maybeShowDisplayStaleOverlay();
      } else if (container) {
        showMempoolMessage(container, "Loading mempool data...");
      }
      void updateSyncOverlay();
      return;
    }

    if (!d.connected) {
      if (isDisplayKiosk()) kioskMempoolEmptyConfirmed = false;
      if (hasUsableMempoolAnimation()) {
        maybeShowDisplayStaleOverlay();
      } else if (container) {
        showMempoolMessage(container, "Waiting for node connection...");
      }
      void updateSyncOverlay();
      return;
    }

    lastMempoolSuccessAt = Date.now();
    mempoolStaleNoticeShown = false;
    const txs = d.txs || [];
    const previousTxIds = new Set(lastMempoolTxs.map((t) => t.txid).filter(Boolean));
    const nextTxIds = new Set(txs.map((t) => t.txid).filter(Boolean));
    let removedTxCount = 0;
    previousTxIds.forEach((txid) => {
      if (!nextTxIds.has(txid)) removedTxCount += 1;
    });
    const blockHeight = d.blocks != null ? Number(d.blocks) : null;
    const headerHeight = d.headers != null ? Number(d.headers) : blockHeight;
    const verificationProgress = d.verificationprogress != null ? Number(d.verificationprogress) : 1;
    const heightDelta =
      previousBlockHeight != null && blockHeight != null ? blockHeight - previousBlockHeight : 0;
    const chainLiveEnoughForConfirmation =
      d.initialblockdownload !== true &&
      Number.isFinite(verificationProgress) &&
      verificationProgress >= 0.99999 &&
      (headerHeight == null || blockHeight == null || headerHeight - blockHeight <= 1);
    const minerBlockFound = Boolean(d.miner_block);
    const networkBlockFound =
      chainLiveEnoughForConfirmation &&
      heightDelta === 1 &&
      previousTxIds.size > 0 &&
      removedTxCount > 0 &&
      blockHeight !== lastAnimatedBlockHeight;
    const simulatedBlockFound = Boolean(d.simulated_block);
    let blockFound = networkBlockFound || simulatedBlockFound || minerBlockFound;
    let confirmationVariant = minerBlockFound ? "miner" : "network";

    if (minerBlockFound) {
      // If the local miner reports a block before Knots advances height, the next
      // network-height bump is that same block. Do not play a second animation for it.
      suppressNextNetworkConfirmation = !networkBlockFound;
    } else if (networkBlockFound && suppressNextNetworkConfirmation) {
      blockFound = simulatedBlockFound;
      suppressNextNetworkConfirmation = false;
    }
    if (networkBlockFound && blockFound) lastAnimatedBlockHeight = blockHeight;

    if (historicalBlockActive) return;
    if (blockHeight != null) previousBlockHeight = blockHeight;
    lastMempoolTxs = txs;

    if (txs.length === 0) {
      if (isDisplayKiosk()) kioskMempoolEmptyConfirmed = true;
      if (container) showMempoolMessage(container, "Mempool empty");
      void updateSyncOverlay();
      return;
    }

    kioskMempoolEmptyConfirmed = false;

    if (isDisplayKiosk() && !initialKioskMempoolDelayDone && !mempoolAnimationStarted) {
      initialKioskMempoolDelayDone = true;
      await sleep(3000);
    }

    renderMempoolTreemap(container, txs, blockFound, {
      confirmationVariant,
    });
    mempoolAnimationStarted = true;
    if (pendingResumeSelectTxid) {
      const tid = pendingResumeSelectTxid;
      pendingResumeSelectTxid = null;
      selectMempoolTransaction(tid);
    }
    void updateSyncOverlay();
  } finally {
    mempoolPollInFlight = false;
  }
}

function rectToPixels(r, width, height) {
  return {
    x: (r.x / 100) * width,
    y: (r.y / 100) * height,
    width: (r.width / 100) * width,
    height: (r.height / 100) * height,
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function mixRect(from, to, t) {
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    width: lerp(from.width, to.width, t),
    height: lerp(from.height, to.height, t),
  };
}

class CanvasMempoolScene {
  constructor(container) {
    this.container = container;
    this.canvas = container.querySelector("#mempool-canvas");
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.id = "mempool-canvas";
      this.canvas.className = "mempool-canvas";
      this.canvas.setAttribute("aria-label", "Live mempool treemap");
      container.prepend(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.blocks = new Map();
    this.frame = null;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.lastTxs = [];
    this.hoverTxid = null;
    this.selectedTxid = null;
    this.timeOffset = 0;
    this.pausedAt = null;
    this.paused = mempoolAnimationsPaused || document.visibilityState !== "visible";
    this.confirmationBusy = false;
    this.bound = false;
    this.resize();
    this.bindInteraction();
    this.start();
  }

  now() {
    return performance.now() - this.timeOffset;
  }

  setPaused(paused) {
    if (paused === this.paused) return;
    this.paused = paused;
    if (paused) {
      this.pausedAt = performance.now();
      this.stop();
      return;
    }
    if (this.pausedAt != null) this.timeOffset += performance.now() - this.pausedAt;
    this.pausedAt = null;
    this.start();
  }

  setSelectedTxid(txid) {
    const next = txid || null;
    if (next === this.selectedTxid) return;
    this.selectedTxid = next;
    this.requestDraw();
  }

  isHighlightedTxid(txid) {
    return txid === this.hoverTxid || txid === this.selectedTxid;
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const nextWidth = Math.max(100, Math.round(rect.width || this.container.clientWidth || 800));
    const nextHeight = Math.max(100, Math.round(rect.height || this.container.clientHeight || 600));
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
    const changed = nextWidth !== this.width || nextHeight !== this.height || nextDpr !== this.dpr;
    this.width = nextWidth;
    this.height = nextHeight;
    this.dpr = nextDpr;
    if (changed) {
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.canvas.style.width = this.width + "px";
      this.canvas.style.height = this.height + "px";
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      if (this.lastTxs.length > 0 && !this.confirmationBusy) this.applyLayout(this.lastTxs, { resizeOnly: true });
      this.requestDraw();
    }
  }

  start() {
    if (this.paused || this.frame != null) return;
    this.frame = requestAnimationFrame((ts) => this.draw(ts));
  }

  stop() {
    if (this.frame != null) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  requestDraw() {
    if (this.frame == null) {
      this.frame = requestAnimationFrame((ts) => this.draw(ts));
    }
  }

  clear() {
    if (confirmFlashTimer) clearTimeout(confirmFlashTimer);
    if (minerConfirmationTimer) clearInterval(minerConfirmationTimer);
    confirmFlashTimer = null;
    minerConfirmationTimer = null;
    confirmationRebuildInProgress = false;
    this.blocks.clear();
    this.hoverTxid = null;
    this.confirmationBusy = false;
    mempoolTxIds = new Set();
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  setTransactions(txs, options = {}) {
    if (!Array.isArray(txs) || txs.length === 0) return;
    this.lastTxs = txs;
    this.container.querySelectorAll(".mempool-empty").forEach((el) => el.remove());
    if (options.blockFound && !options.forceNewBlocks) {
      const nowDate = Date.now();
      if (nowDate - lastCelebrationAt >= CONFIRM_CELEBRATION_COOLDOWN_MS) {
        const started = this.triggerConfirmation(txs, options.confirmationVariant || "network");
        if (!started) return;
        lastCelebrationAt = nowDate;
        try {
          blockvaseBroadcast?.postMessage({
            type: options.confirmationVariant === "miner" ? "miner-block-confirmed" : "block-confirmed",
            source: blockvaseBcInstanceId,
          });
        } catch (_) {}
        return;
      }
    }
    if (!this.confirmationBusy || options.forceNewBlocks) this.applyLayout(txs, options);
  }

  applyLayout(txs, options = {}) {
    this.resize();
    const rects = layoutTreemap(txs, this.width, this.height);
    const newTxIds = new Set(txs.map((t) => t.txid));
    const existingIds = new Set(this.blocks.keys());
    const initialPopulate = this.blocks.size === 0 && mempoolTxIds.size === 0;
    const useConfirmationEnter = options.forceNewBlocks || initialPopulate;
    const enterDelays = useConfirmationEnter
      ? randomizedGroupedDelays(rects.length, CONFIRM_SLOT_MS, CONFIRM_BLOCKS_PER_SLOT)
      : [];
    const palette = mempoolColorPalette();
    const perf = getMempoolPerfProfile();
    const reduceFlashAtHighDensity = txs.length >= perf.reduceFlashAt;
    const ultraHighDensity = txs.length >= perf.ultraHighAt;
    const extremeDensity = txs.length >= perf.extremeAt;
    const flashRatio = extremeDensity
      ? perf.flashRatioExtreme
      : ultraHighDensity
        ? perf.flashRatioUltra
        : reduceFlashAtHighDensity
          ? perf.flashRatioHigh
          : 1;
    const now = this.now();
    this.container.classList.toggle("mempool-high-density", reduceFlashAtHighDensity);

    rects.forEach((r, idx) => {
      const target = rectToPixels(r, this.width, this.height);
      const colorIdx = Math.floor(txidHash(r.txid) * palette.length) % palette.length;
      const th = txidHash(r.txid);
      const th2 = txidHash2(r.txid);
      const areaPct = (r.width / 100) * (r.height / 100) * 10000;
      const animateFlash = areaPct >= perf.minAnimArea && th2 < flashRatio;
      const existing = this.blocks.get(r.txid);
      if (existing) {
        existingIds.delete(r.txid);
        existing.tx = r;
        existing.feeSats = r.fee_sats ?? 0;
        existing.vsize = r.vsize ?? 0;
        existing.color = palette[colorIdx];
        existing.flash = this.flashConfig(th, th2, animateFlash);
        existing.from = this.currentRect(existing, now);
        existing.target = target;
        existing.transitionStart = now;
        existing.transitionDuration = reduceFlashAtHighDensity ? 280 : 550;
        existing.mode = "normal";
        existing.opacity = 1;
        return;
      }

      const center = {
        x: this.width / 2,
        y: this.height / 2,
        width: 0,
        height: 0,
      };
      this.blocks.set(r.txid, {
        txid: r.txid,
        tx: r,
        feeSats: r.fee_sats ?? 0,
        vsize: r.vsize ?? 0,
        color: palette[colorIdx],
        flash: this.flashConfig(th, th2, animateFlash),
        from: center,
        target,
        current: center,
        transitionStart: now + (useConfirmationEnter ? (enterDelays[idx] ?? 0) : 0),
        transitionDuration: useConfirmationEnter ? CONFIRM_ENTER_FADE_MS : 500,
        mode: useConfirmationEnter ? "confirm-enter" : "new",
        opacity: 0,
      });
    });

    existingIds.forEach((txid) => {
      const block = this.blocks.get(txid);
      if (!block) return;
      block.from = this.currentRect(block, now);
      block.target = block.from;
      block.transitionStart = now;
      block.transitionDuration = 450;
      block.mode = "removed";
      block.opacity = 1;
    });

    mempoolTxIds = newTxIds;
    this.requestDraw();
  }

  flashConfig(th, th2, enabled) {
    const durations = [4000, 5000, 6000];
    const phase = Math.floor(th * 8) % 8;
    return {
      enabled,
      dip: 0.33 + th2 * 0.17,
      delay: (phase * 500 + ANIM_OFFSET * 20) % 6000,
      duration: durations[Math.floor(th2 * durations.length)] || 5000,
      reverse: th2 >= 0.33 && th2 < 0.66,
      alternate: th2 >= 0.66,
    };
  }

  currentRect(block, now = this.now()) {
    const duration = Math.max(1, block.transitionDuration || 1);
    const raw = (now - (block.transitionStart ?? now)) / duration;
    const t = Math.max(0, Math.min(1, raw));
    const eased = block.mode === "confirm-enter" || block.mode === "confirm-exit" ? easeInOut(t) : easeOutCubic(t);
    return mixRect(block.from || block.target, block.target, eased);
  }

  triggerConfirmation(txs, variant = "network") {
    const rebuildTxs = Array.isArray(txs) && txs.length > 0 ? txs : lastMempoolTxs;
    if (!rebuildTxs.length || this.confirmationBusy) return false;
    clearConfirmationCleanupTimers();
    if (confirmFlashTimer) clearTimeout(confirmFlashTimer);
    if (minerConfirmationTimer) clearInterval(minerConfirmationTimer);
    confirmFlashTimer = null;
    minerConfirmationTimer = null;

    if (this.blocks.size === 0) {
      this.applyLayout(rebuildTxs, { forceNewBlocks: true });
      return true;
    }

    const now = this.now();
    const blocks = Array.from(this.blocks.values());
    this.confirmationBusy = true;
    confirmationRebuildInProgress = true;

    if (variant === "miner") {
      const maxStart = Math.max(1, MINER_CONFIRMATION_MS - MINER_FLASH_MS - 600);
      blocks.forEach((block) => {
        block.from = this.currentRect(block, now);
        block.target = block.from;
        block.transitionStart = now;
        block.transitionDuration = MINER_FLASH_MS;
        block.minerFlashAt = now + Math.floor(Math.random() * maxStart / MINER_FLASH_TICK_MS) * MINER_FLASH_TICK_MS;
        block.mode = "miner-exit";
      });
      confirmFlashTimer = setTimeout(() => {
        confirmFlashTimer = null;
        this.finishConfirmation(rebuildTxs, "network");
      }, MINER_CONFIRMATION_MS);
      this.requestDraw();
      return true;
    }

    const delays = randomizedGroupedDelays(blocks.length, CONFIRM_SLOT_MS, CONFIRM_BLOCKS_PER_SLOT);
    let maxDelay = 0;
    blocks.forEach((block, idx) => {
      const delay = delays[idx] ?? 0;
      maxDelay = Math.max(maxDelay, delay);
      const current = this.currentRect(block, now);
      block.from = current;
      block.target = {
        x: this.width / 2,
        y: this.height / 2,
        width: Math.max(0, current.width * 0.05),
        height: Math.max(0, current.height * 0.05),
      };
      block.transitionStart = now + delay;
      block.transitionDuration = CONFIRM_EXIT_FADE_MS;
      block.mode = "confirm-exit";
      block.opacity = 1;
    });
    confirmFlashTimer = setTimeout(() => {
      confirmFlashTimer = null;
      this.finishConfirmation(rebuildTxs, variant);
    }, maxDelay + CONFIRM_EXIT_FADE_MS);
    this.requestDraw();
    return true;
  }

  finishConfirmation(txs, variant) {
    mempoolTxIds = new Set();
    this.blocks.clear();
    this.confirmationBusy = false;
    confirmationRebuildInProgress = false;
    this.applyLayout(txs, { forceNewBlocks: true, confirmationVariant: variant });
  }

  draw(rawTs) {
    this.frame = null;
    const now = (rawTs || performance.now()) - this.timeOffset;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    let needsNext = false;

    for (const [txid, block] of this.blocks) {
      const state = this.drawState(block, now);
      if (state.remove) {
        this.blocks.delete(txid);
        continue;
      }
      block.current = state.rect;
      if (state.animating) needsNext = true;
      const color = this.isHighlightedTxid(txid) ? mempoolHighlightColor() : state.color;
      ctx.globalAlpha = state.opacity;
      ctx.fillStyle = mempoolTileFill(ctx, color, state.rect);
      const bleed = state.rect.width > 1 && state.rect.height > 1 ? 0.75 : 0;
      ctx.fillRect(
        Math.max(0, state.rect.x - bleed),
        Math.max(0, state.rect.y - bleed),
        Math.min(this.width, state.rect.width + bleed * 2),
        Math.min(this.height, state.rect.height + bleed * 2)
      );
    }
    ctx.globalAlpha = 1;
    if (this.paused && !this.hoverTxid && !this.selectedTxid && !needsNext) return;
    if (needsNext || this.blocks.size > 0) this.start();
  }

  drawState(block, now) {
    const raw = (now - block.transitionStart) / Math.max(1, block.transitionDuration || 1);
    const t = Math.max(0, Math.min(1, raw));
    let rect = this.currentRect(block, now);
    let opacity = 1;
    let animating = raw < 1;
    let color = block.color;

    if (block.mode === "new" || block.mode === "confirm-enter") {
      opacity = t;
      animating = raw < 1;
      if (raw >= 1) block.mode = "normal";
    } else if (block.mode === "removed") {
      opacity = 1 - t;
      if (raw >= 1) return { remove: true };
    } else if (block.mode === "confirm-exit") {
      opacity = 1 - t;
      if (raw >= 1) opacity = 0;
    } else if (block.mode === "miner-exit") {
      const flashRaw = (now - block.minerFlashAt) / MINER_FLASH_MS;
      if (flashRaw >= 0) {
        const ft = Math.max(0, Math.min(1, flashRaw));
        color = ft < 0.4 ? block.color : mempoolHighlightColor();
        opacity = 1 - Math.max(0, (ft - 0.4) / 0.6);
      }
      animating = true;
    }

    if (block.mode === "normal" && block.flash.enabled && txidHash2(block.txid) >= 0) {
      opacity *= this.flashOpacity(block, now);
      animating = true;
    }

    return { rect, opacity: Math.max(0, Math.min(1, opacity)), color, animating };
  }

  flashOpacity(block, now) {
    const flash = block.flash;
    if (!flash?.enabled || this.isHighlightedTxid(block.txid)) return 1;
    const theme = document.body.dataset.theme || "default";
    let p = ((now + flash.delay) % flash.duration) / flash.duration;
    if (flash.reverse) p = 1 - p;
    if (flash.alternate && Math.floor((now + flash.delay) / flash.duration) % 2 === 1) p = 1 - p;
    if (theme === "ocean") {
      const wave = (1 - Math.cos(p * Math.PI * 4)) / 2;
      return 1 - wave * (1 - flash.dip);
    }
    const wave = Math.max(0, Math.sin(p * Math.PI * 5));
    return 1 - wave * (1 - flash.dip);
  }

  bindInteraction() {
    if (this.bound) return;
    this.bound = true;
    if (document.body.classList.contains("display-kiosk")) return;

    this.canvas.addEventListener("pointermove", (e) => {
      const hit = this.hitEvent(e);
      const nextTxid = hit?.txid || null;
      if (nextTxid !== this.hoverTxid) {
        this.hoverTxid = nextTxid;
        this.requestDraw();
      }
    });
    this.canvas.addEventListener("pointerleave", () => {
      this.hoverTxid = null;
      this.requestDraw();
    });

    this.canvas.addEventListener("click", (e) => {
      const hit = this.hitEvent(e);
      if (!hit?.txid) return;
      selectMempoolTransaction(hit.txid);
    });
  }

  hitEvent(e) {
    const rect = this.canvas.getBoundingClientRect();
    return this.hitTest(e.clientX - rect.left, e.clientY - rect.top);
  }

  hitTest(x, y) {
    const blocks = Array.from(this.blocks.values()).reverse();
    for (const block of blocks) {
      if (block.mode === "removed" || block.mode === "confirm-exit" || block.mode === "miner-exit") continue;
      const r = block.current || block.target;
      if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) return block;
    }
    return null;
  }
}

function getMempoolScene(container) {
  if (!mempoolScene || mempoolScene.container !== container) {
    mempoolScene = new CanvasMempoolScene(container);
  }
  return mempoolScene;
}

function postMempoolTxSelect(txid) {
  const msg = { type: "blockvase-tx-select", txid };
  const targetOrigin = window.location.origin;
  try {
    if (isPortalEmbed() || window !== window.top) {
      window.parent.postMessage(msg, targetOrigin);
    } else if (window.opener) {
      window.opener.postMessage(msg, targetOrigin);
    }
  } catch (_) {}
}

function resolveMempoolBlock(scene, txid) {
  if (!scene || !txid) return null;
  const direct = scene.blocks.get(txid);
  if (direct) return direct;
  const needle = String(txid).toLowerCase();
  for (const [id, block] of scene.blocks) {
    if (String(id).toLowerCase() === needle) return block;
  }
  return null;
}

function selectMempoolTransaction(txid) {
  if (!txid) return false;
  const container = document.getElementById("mempool-treemap");
  const scene = container ? getMempoolScene(container) : mempoolScene;
  const block = resolveMempoolBlock(scene, txid);
  const resolved = (block && block.txid) || txid;
  if (scene) {
    scene.setSelectedTxid(resolved);
    scene.requestDraw();
  }
  postMempoolTxSelect(resolved);
  return !!block;
}

function findMempoolTransactions(query) {
  const raw = String(query || "").trim();
  const q = raw.toLowerCase().replace(/,/g, "");
  if (!q) return [];
  const hex = /^[0-9a-f]+$/.test(q);
  if (!hex || (/^\d+$/.test(q) && q.length < 64)) return [];
  const scored = [];
  lastMempoolTxs.forEach(function (tx) {
    const txid = String(tx.txid || "").toLowerCase();
    let score = 0;
    if (txid && txid === q) score = 100;
    else if (hex && q.length >= 4 && txid.startsWith(q)) score = 90;
    else if (hex && q.length >= 4 && txid.includes(q)) score = 80;
    if (score > 0) scored.push({ tx: tx, score: score });
  });
  scored.sort(function (a, b) {
    return b.score - a.score;
  });
  return scored;
}

function setMempoolSearchStatus(message, isMiss, txid, extra) {
  const status = document.getElementById("mempoolTxSearchStatus");
  const text = String(message || "").trim();
  extra = extra || {};
  if (status) {
    clearTimeout(setMempoolSearchStatus._timer);
    status.textContent = text;
    status.classList.toggle("is-miss", !!isMiss);
    if (!text) {
      status.hidden = true;
    } else {
      status.hidden = false;
      setMempoolSearchStatus._timer = setTimeout(function () {
        status.hidden = true;
      }, isMiss ? 2200 : 1400);
    }
  }
  if (isPortalEmbed()) {
    try {
      window.parent.postMessage(
        {
          type: "blockvase-tx-search-result",
          status: text,
          isMiss: !!isMiss,
          txid: !isMiss && txid ? txid : null,
          q: extra.q || "",
          seq: extra.seq,
        },
        window.location.origin
      );
    } catch (_) {}
  }
}

function runMempoolSearch(query, seq) {
  const q = String(query || "").trim();
  const extra = { q: q, seq: seq };
  if (!q) {
    setMempoolSearchStatus("", false, null, extra);
    return false;
  }
  if (!lastMempoolTxs.length) {
    setMempoolSearchStatus("Mempool data is still loading.", true, null, extra);
    return false;
  }
  const matches = findMempoolTransactions(q);
  if (!matches.length) {
    setMempoolSearchStatus("No matching transaction in this view.", true, null, extra);
    return false;
  }
  const txid = matches[0].tx.txid;
  selectMempoolTransaction(txid);
  setMempoolSearchStatus(
    matches.length === 1
      ? "Showing the matching transaction."
      : "Showing the closest of " + matches.length + " matches.",
    false,
    txid,
    extra
  );
  return true;
}

function initMempoolSearch() {
  if (isPortalEmbed()) document.body.classList.add("display-embed");
  const form = document.getElementById("mempoolTxSearch");
  const input = document.getElementById("mempoolTxSearchInput");
  if (!form || !input || form.dataset.bound) return;
  if (document.body.classList.contains("display-kiosk") || document.body.classList.contains("display-embed")) return;
  form.dataset.bound = "1";
  let debounce = 0;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    runMempoolSearch(input.value);
  });
  input.addEventListener("input", function () {
    clearTimeout(debounce);
    const q = input.value.trim();
    if (q.length < 4) {
      if (!q) setMempoolSearchStatus("");
      return;
    }
    debounce = setTimeout(function () {
      runMempoolSearch(q);
    }, 280);
  });
}

window.addEventListener("message", (ev) => {
  if (ev.origin !== window.location.origin) return;
  if (ev.data?.type === "blockvase-tx-deselect") {
    mempoolScene?.setSelectedTxid(null);
  }
  if (ev.data?.type === "blockvase-tx-search" && ev.data.q != null) {
    runMempoolSearch(ev.data.q, ev.data.seq);
  }
  if (ev.data?.type === "blockvase-select-tx" && ev.data.txid) {
    selectMempoolTransaction(ev.data.txid);
  }
  if (ev.data?.type === "blockvase-load-block") {
    applyHistoricalBlock(ev.data.txs || [], ev.data.selectTxid);
  }
  if (ev.data?.type === "blockvase-resume-mempool") {
    resumeLiveMempool(ev.data.selectTxid);
  }
  if (ev.data?.type === "bw-mode") {
    applyBwMode(ev.data.mode);
    recolorMempoolScene();
    if (lastMempoolTxs.length > 0) {
      const container = document.getElementById("mempool-treemap");
      if (container && !isConfirmationBusy()) {
        requestAnimationFrame(() => renderMempoolTreemap(container, lastMempoolTxs, false));
      }
    }
  }
});

function showMempoolMessage(container, message) {
  if (!container) return;
  const scene = getMempoolScene(container);
  scene.clear();
  let empty = container.querySelector(".mempool-empty");
  if (!empty) {
    empty = document.createElement("div");
    empty.className = "mempool-empty";
    container.appendChild(empty);
  }
  empty.textContent = message;
}

function renderMempoolTreemap(container, txs, blockFound, options = {}) {
  if (!container || !txs.length) return;
  const scene = getMempoolScene(container);
  scene.setTransactions(txs, { ...options, blockFound });
}

function triggerBlockConfirmation(container, txs, variant = "network") {
  if (!container) return false;
  return getMempoolScene(container).triggerConfirmation(txs, variant);
}

function onMempoolResize() {
  if (lastMempoolTxs.length === 0) return;
  const container = document.getElementById("mempool-treemap");
  const liveScreen = document.getElementById("live-screen");
  if (container && liveScreen && !liveScreen.classList.contains("hidden")) {
    if (isConfirmationBusy()) return;
    mempoolTxIds = new Set(lastMempoolTxs.map((t) => t.txid));
    const scene = getMempoolScene(container);
    scene.resize();
    renderMempoolTreemap(container, lastMempoolTxs, false);
  }
}

window.addEventListener("resize", () => {
  const delay = getMempoolPerfProfile().constrained ? 280 : 120;
  clearTimeout(mempoolResizeTimer);
  mempoolResizeTimer = setTimeout(onMempoolResize, delay);
});

const SETUP_POLL_MS = 6000;
const SYNC_OVERLAY_POLL_MS = 5500;
const MEMPOOL_FETCH_TIMEOUT_MS = 4500;
const DISPLAY_MEMPOOL_STALE_MS = 5 * 60 * 1000;

function pollMempoolIfLive() {
  if (historicalBlockActive) return;
  const liveScreen = document.getElementById("live-screen");
  if (liveScreen && !liveScreen.classList.contains("hidden")) {
    pollMempool();
  }
}

function initMempoolFullscreen() {
  const btn = document.getElementById("mempoolFullscreen");
  if (!btn) return;
  if (window !== window.top) {
    btn.style.display = "none";
    return;
  }
  const el = document.documentElement;
  const fsEl = () => document.fullscreenElement ?? document.webkitFullscreenElement;
  btn.addEventListener("click", () => {
    if (!fsEl()) {
      (el.requestFullscreen ?? el.webkitRequestFullscreen)?.call(el);
    } else {
      (document.exitFullscreen ?? document.webkitExitFullscreen)?.call(document);
    }
  });
  document.addEventListener("fullscreenchange", () => {
    btn.setAttribute("aria-label", fsEl() ? "Exit fullscreen" : "Fullscreen");
  });
  document.addEventListener("webkitfullscreenchange", () => {
    btn.setAttribute("aria-label", fsEl() ? "Exit fullscreen" : "Fullscreen");
  });
}

initMempoolFullscreen();
initMempoolSearch();

let blockvaseBroadcast = null;
try {
  blockvaseBroadcast = new BroadcastChannel("blockvase");
  blockvaseBroadcast.onmessage = (e) => {
    if (e.data?.type === "simulate-block") pollMempool();
    if (e.data?.type === "block-confirmed" || e.data?.type === "miner-block-confirmed") {
      if (isDisplayKiosk()) return;
      if (e.data?.source === blockvaseBcInstanceId) return;
      if (e.data?.type === "miner-block-confirmed") {
        suppressNextNetworkConfirmation = true;
      }
      if (isConfirmationBusy() || Date.now() - lastCelebrationAt < CONFIRM_CELEBRATION_COOLDOWN_MS) return;
      const container = document.getElementById("mempool-treemap");
      if (container) {
        const started = triggerBlockConfirmation(
          container,
          lastMempoolTxs,
          e.data?.type === "miner-block-confirmed" ? "miner" : "network"
        );
        if (started) lastCelebrationAt = Date.now();
      }
    }
    if (e.data?.type === "theme-change" && e.data?.theme) {
      document.body.dataset.theme = e.data.theme;
      if (lastMempoolTxs.length > 0) {
        const container = document.getElementById("mempool-treemap");
        if (container && !isConfirmationBusy()) requestAnimationFrame(() => renderMempoolTreemap(container, lastMempoolTxs, false));
      }
    }
    if (e.data?.type === "bw-mode") {
      applyBwMode(e.data.mode);
      recolorMempoolScene();
      if (lastMempoolTxs.length > 0) {
        const container = document.getElementById("mempool-treemap");
        if (container && !isConfirmationBusy()) requestAnimationFrame(() => renderMempoolTreemap(container, lastMempoolTxs, false));
      }
    }
  };
} catch (_) {}

(function initBwModeFromContext() {
  const q = new URLSearchParams(window.location.search).get("bw");
  if (q === "black" || q === "white" || q === "glow") {
    applyBwMode(q);
    return;
  }
  try {
    const savedBw = localStorage.getItem("blockvase-bw");
    applyBwMode(savedBw);
  } catch (_err) {
    applyBwMode("glow");
  }
})();

initMempoolPerfControls();
pollSetupState();
setInterval(pollSetupState, SETUP_POLL_MS);
scheduleMempoolPollLoop();
setInterval(tickSyncOverlay, SYNC_OVERLAY_POLL_MS);

window.applyHistoricalBlock = applyHistoricalBlock;
window.resumeLiveMempool = resumeLiveMempool;
window.selectMempoolTransaction = selectMempoolTransaction;
