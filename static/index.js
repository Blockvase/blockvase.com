function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatNodeConnection(subversion, nodeVersion) {
  const sent = String(nodeVersion || "").trim();
  if (sent) return sent.startsWith("v") ? sent : "v" + sent;
  const sub = String(subversion || "").trim();
  const knots = sub.match(/\/Knots:([^/]+)/);
  const satoshi = sub.match(/\/Satoshi:(\d+\.\d+(?:\.\d+)?)\//);
  if (knots && satoshi) return "v" + satoshi[1] + ".knots" + knots[1].trim();
  if (satoshi) return satoshi[1];
  return "N/A";
}

function formatDifficulty(d) {
  if (d >= 1e15) return (d / 1e15).toFixed(2) + " Q";
  if (d >= 1e12) return (d / 1e12).toFixed(2) + " T";
  if (d >= 1e9) return (d / 1e9).toFixed(2) + " B";
  if (d >= 1e6) return (d / 1e6).toFixed(2) + " M";
  return formatNumber(Math.round(d));
}

function formatHashRate(h) {
  if (h >= 1e18) return (h / 1e18).toFixed(2) + " EH/s";
  if (h >= 1e15) return (h / 1e15).toFixed(2) + " PH/s";
  if (h >= 1e12) return (h / 1e12).toFixed(2) + " TH/s";
  if (h >= 1e9) return (h / 1e9).toFixed(2) + " GH/s";
  if (h >= 1e6) return (h / 1e6).toFixed(2) + " MH/s";
  if (h >= 1e3) return (h / 1e3).toFixed(2) + " KH/s";
  return (h || 0).toFixed(2) + " H/s";
}

function formatFeeRate(satvb) {
  const v = Number(satvb);
  if (!Number.isFinite(v) || v <= 0) return '<span class="fee-unavailable">N/A</span>';
  if (v >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' <span class="portal-fee-sats-suffix">sats</span>';
  if (v >= 100) return v.toFixed(0) + ' <span class="portal-fee-sats-suffix">sats</span>';
  if (v >= 10) return v.toFixed(1) + ' <span class="portal-fee-sats-suffix">sats</span>';
  return v.toFixed(2) + ' <span class="portal-fee-sats-suffix">sats</span>';
}

/** Short numeric fee for small radial circles (unit is in the section title). */
function formatFeeRateCompact(satvb) {
  const v = Number(satvb);
  if (!Number.isFinite(v) || v <= 0) return "N/A";
  if (v >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (v >= 100) return v.toFixed(0);
  if (v >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

function formatHashRateParts(h) {
  const n = Number(h) || 0;
  if (n >= 1e18) return { value: (n / 1e18).toFixed(1), unit: "EH/s" };
  if (n >= 1e15) return { value: (n / 1e15).toFixed(1), unit: "PH/s" };
  if (n >= 1e12) return { value: (n / 1e12).toFixed(1), unit: "TH/s" };
  if (n >= 1e9) return { value: (n / 1e9).toFixed(1), unit: "GH/s" };
  if (n >= 1e6) return { value: (n / 1e6).toFixed(1), unit: "MH/s" };
  if (n >= 1e3) return { value: (n / 1e3).toFixed(1), unit: "KH/s" };
  return { value: (n || 0).toFixed(1), unit: "H/s" };
}

function formatBytesParts(b) {
  const n = Number(b) || 0;
  if (n >= 1e9) return { value: (n / 1e9).toFixed(1), unit: "GB" };
  if (n >= 1e6) return { value: (n / 1e6).toFixed(1), unit: "MB" };
  if (n >= 1e3) return { value: (n / 1e3).toFixed(1), unit: "KB" };
  return { value: String(n || 0), unit: "B" };
}

function formatDifficultyParts(d) {
  const n = Number(d) || 0;
  if (n >= 1e15) return { value: (n / 1e15).toFixed(2), unit: "Q" };
  if (n >= 1e12) return { value: (n / 1e12).toFixed(2), unit: "T" };
  if (n >= 1e9) return { value: (n / 1e9).toFixed(2), unit: "B" };
  if (n >= 1e6) return { value: (n / 1e6).toFixed(2), unit: "M" };
  return { value: formatNumber(Math.round(n)), unit: "" };
}

function formatBytes(b) {
  if (b >= 1e9) return (b / 1e9).toFixed(2) + " GB";
  if (b >= 1e6) return (b / 1e6).toFixed(2) + " MB";
  if (b >= 1e3) return (b / 1e3).toFixed(2) + " KB";
  return (b || 0) + " B";
}

function formatTimeAgo(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - (timestamp || 0);
  if (diff < 60) return diff + " sec ago";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hr ago";
  return Math.floor(diff / 86400) + " days ago";
}

function formatDuration(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return h + "h " + m + "m";
  if (m > 0) return m + "m " + r + "s";
  return r + "s";
}

function formatTempC(c) {
  if (c == null || !Number.isFinite(Number(c))) return "N/A";
  return Number(c).toFixed(1) + " °C";
}

function metricEscape(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMetricsAsOf(value) {
  let d;
  if (value == null || value === "") {
    d = new Date();
  } else if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return "";
    d = new Date(value > 1e12 ? value : value * 1000);
  } else {
    const raw = String(value).trim();
    const n = Number(raw);
    if (raw && Number.isFinite(n) && !/[T-]/.test(raw)) {
      if (n <= 0) return "";
      d = new Date(n > 1e12 ? n : n * 1000);
    } else {
      d = new Date(raw);
    }
  }
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch (_) {
    return d.toLocaleString();
  }
}

function metricBoard(title, body, extraClass, titleNote) {
  const cls = "metric-board" + (extraClass ? " " + extraClass : "");
  const label = title ? ' aria-label="' + metricEscape(title) + '"' : "";
  if (!titleNote) {
    return "<section class=\"" + cls + "\"" + label + ">" + body + "</section>";
  }
  const head =
    '<div class="metric-board-heading">' +
    '<h3 class="metric-board-title viewer-section-title" aria-hidden="true">' +
    metricEscape(title) +
    "</h3>" +
    '<p class="metric-board-asof">' +
    metricEscape(titleNote) +
    "</p></div>";
  return "<section class=\"" + cls + "\"" + label + ">" + head + body + "</section>";
}

function metricKvHtml(rows) {
  return (
    '<dl class="metric-kv-compact">' +
    (rows || [])
      .map(function (row) {
        const v = row[1];
        const vHtml =
          typeof v === "string" && v.indexOf("<") >= 0 ? v : metricEscape(String(v ?? "N/A"));
        return "<dt>" + metricEscape(row[0]) + "</dt><dd>" + vHtml + "</dd>";
      })
      .join("") +
    "</dl>"
  );
}

function portalKpiHtml(label, value, opts) {
  opts = opts || {};
  let valueClasses = "portal-kpi-value";
  if (opts.highlight) valueClasses += " highlight";
  if (opts.accent) valueClasses += " portal-kpi-accent";
  if (opts.mono) valueClasses += " portal-kpi-value--mono";
  const valueHtml =
    typeof value === "string" && value.indexOf("<") >= 0 ? value : metricEscape(String(value ?? "N/A"));
  const unitHtml = opts.unit
    ? '<span class="portal-kpi-unit">' + metricEscape(opts.unit) + "</span>"
    : "";
  return (
    '<div class="portal-kpi" role="group" aria-label="' +
    metricEscape(label) +
    '"><span class="portal-kpi-label">' +
    metricEscape(label) +
    '</span><span class="' +
    valueClasses +
    '">' +
    valueHtml +
    unitHtml +
    "</span></div>"
  );
}

function portalKpiStrip(items, extraClass) {
  const cls = "portal-kpi-strip" + (extraClass ? " " + extraClass : "");
  return '<div class="' + cls + '">' + items.join("") + "</div>";
}

function metricClusterHtml(title, body) {
  const head = title
    ? '<h4 class="metric-cluster-title">' + metricEscape(title) + "</h4>"
    : "";
  return '<div class="metric-cluster">' + head + body + "</div>";
}

function feeStripHtml(low, med, high) {
  const items = [
    ["Low ~60m", low],
    ["Med ~30m", med],
    ["High ~10m", high],
  ];
  return (
    '<div class="metric-fee-strip" aria-label="Fee rates in sat/vB">' +
    items
      .map(function (item) {
        return (
          '<span class="metric-fee-chip"><span class="metric-fee-chip-label">' +
          escapeHtml(item[0]) +
          '</span><span class="metric-fee-chip-value">' +
          escapeHtml(formatFeeRateCompact(item[1])) +
          "</span></span>"
        );
      })
      .join("") +
    "</div>"
  );
}

function formatRetargetEta(seconds) {
  const s = Math.max(0, Number(seconds) || 0);
  if (s >= 86400 * 2) return (s / 86400).toFixed(0) + "d";
  if (s >= 3600) return (s / 3600).toFixed(1) + "h";
  if (s >= 60) return Math.floor(s / 60) + "m";
  return Math.floor(s) + "s";
}

function powAlgoLabel(height) {
  return Number(height) >= 961640 ? "BLAKE2b" : "SHA256d";
}

function currentMiningStats(d) {
  const tip = Number(d.tip_height != null ? d.tip_height : d.blocks) || 0;
  const miningHeight =
    Number(d.next_height != null ? d.next_height : d.mining_height) || (tip > 0 ? tip + 1 : 0);
  const difficulty = Number(d.difficulty || 0) || 0;
  const tipDifficulty = Number(d.tip_difficulty != null ? d.tip_difficulty : 0) || 0;
  const networkhashps = Number(d.networkhashps || 0) || 0;
  const times = (d.recent_blocks || [])
    .map((b) => Number(b && (b.timestamp || b.time)) || 0)
    .filter((ts) => ts > 0)
    .sort((a, b) => a - b);
  const now = Math.floor(Date.now() / 1000);
  const lastBlockTime = times.length ? times[times.length - 1] : 0;
  const secondsSinceTip =
    d.seconds_since_tip != null
      ? Number(d.seconds_since_tip)
      : lastBlockTime && now > lastBlockTime
        ? now - lastBlockTime
        : 0;
  const until = Number(d.blocks_until_retarget ?? (miningHeight > 0 ? (miningHeight % 2016 === 0 ? 0 : 2016 - (miningHeight % 2016)) : 2016));
  const intoPeriod = 2016 - until;
  const progressPct = ((intoPeriod / 2016) * 100).toFixed(1);
  return {
    tip,
    miningHeight,
    difficulty,
    tipDifficulty,
    networkhashps,
    bits: d.bits || "",
    secondsSinceTip,
    avgInterval: 600,
    until,
    progressPct,
  };
}

function workVsTipHtml(mining) {
  const nextDiff = formatDifficulty(mining.difficulty || 0);
  const hashParts = formatHashRateParts(mining.networkhashps || 0);
  const hash = hashParts.value + (hashParts.unit ? " " + hashParts.unit : "");
  return (
    '<p class="portal-compact-note portal-work-vs-tip">' +
    "height " +
    escapeHtml(nextDiff) +
    " / " +
    escapeHtml(hash) +
    " (" +
    escapeHtml(powAlgoLabel(mining.miningHeight)) +
    " " +
    formatNumber(mining.miningHeight || 0) +
    ")</p>"
  );
}

function formatPoolSharePct(pct) {
  const n = Number(pct);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2) + "%";
}

function poolShareRows(share, view) {
  if (!share || typeof share !== "object") return [];
  if (view === "tag") {
    return (share.by_tag || []).map(function (row) {
      return { key: String(row.tag ?? ""), blocks: row.blocks, pct: row.pct };
    });
  }
  return (share.by_pool || []).map(function (row) {
    return { key: String(row.pool ?? ""), blocks: row.blocks, pct: row.pct };
  });
}

function poolShareKey(value) {
  return String(value || "").trim();
}

function poolShareStackHtml(share, view) {
  const rows = poolShareRows(share, view || "pool").filter(function (row) {
    return row.key !== "";
  });
  if (!rows.length) return "";
  const segs = [];
  rows.forEach(function (row) {
    const pct = Number(row.pct);
    const width = Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0;
    if (width <= 0) return;
    segs.push({
      key: row.key,
      width: width,
      label: pct >= 10 ? String(Math.round(pct)) + "%" : pct.toFixed(1).replace(/\.0$/, "") + "%",
      title: row.key + " · " + formatPoolSharePct(row.pct),
    });
  });
  if (!segs.length) return "";
  return (
    '<div class="pool-share-stack" aria-hidden="true">' +
    '<div class="pool-share-stack__bar">' +
    segs
      .map(function (seg) {
        return (
          '<span class="pool-share-stack__seg" data-pool-share-key="' +
          escapeHtml(seg.key) +
          '" style="flex:' +
          seg.width +
          ' 0 0" title="' +
          escapeHtml(seg.title) +
          '"></span>'
        );
      })
      .join("") +
    "</div>" +
    '<div class="pool-share-stack__labels">' +
    segs
      .map(function (seg) {
        const showLabel = seg.width >= 2.8;
        return (
          '<span class="pool-share-stack__pct' +
          (showLabel ? "" : " is-empty") +
          '" data-pool-share-key="' +
          escapeHtml(seg.key) +
          '" style="flex:' +
          seg.width +
          ' 0 0">' +
          (showLabel ? escapeHtml(seg.label) : "") +
          "</span>"
        );
      })
      .join("") +
    "</div></div>"
  );
}

function poolShareListHtml(share, view) {
  const rows = poolShareRows(share, view).filter(function (row) {
    return row.key !== "";
  });
  if (!rows.length) {
    return '<p class="pool-share-empty muted-note">No pool share in the latest node poll.</p>';
  }
  return (
    '<ol class="pool-share-bars" aria-label="' +
    (view === "tag" ? "Share by coinbase tag" : "Share by pool") +
    '">' +
    rows
      .map(function (row) {
        const pct = Number(row.pct);
        const width = Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0;
        const label = row.key;
        return (
          '<li class="pool-share-row" data-pool-share-key="' +
          escapeHtml(label) +
          '">' +
          '<span class="pool-share-name" title="' +
          escapeHtml(label) +
          '">' +
          escapeHtml(label) +
          "</span>" +
          '<span class="pool-share-track">' +
          '<span class="pool-share-fill" style="width:' +
          width +
          '%"></span></span>' +
          '<span class="pool-share-meta">' +
          escapeHtml(formatNumber(row.blocks)) +
          " · " +
          escapeHtml(formatPoolSharePct(row.pct)) +
          "</span></li>"
        );
      })
      .join("") +
    "</ol>"
  );
}

function poolShareBoardHtml(share) {
  if (!share || typeof share !== "object") return "";
  const windowSize = Number(share.window);
  if (!Number.isFinite(windowSize) || windowSize <= 0) return "";
  const hasPools = Array.isArray(share.by_pool) && share.by_pool.length > 0;
  const hasTags = Array.isArray(share.by_tag) && share.by_tag.length > 0;
  if (!hasPools && !hasTags) return "";
  const view = poolShareView === "tag" && hasTags ? "tag" : "pool";
  const start = Number(share.start_height);
  const end = Number(share.end_height);
  let range = "";
  if (Number.isFinite(start) && Number.isFinite(end) && start > 0 && end > 0) {
    range = "#" + formatNumber(start) + "–#" + formatNumber(end);
  }
  const toggle = hasTags
    ? '<div class="pool-share-toggle" role="tablist" aria-label="Pool share view">' +
      '<button type="button" class="pool-share-toggle__btn' +
      (view === "pool" ? " is-active" : "") +
      '" role="tab" aria-selected="' +
      (view === "pool" ? "true" : "false") +
      '" data-pool-share-view="pool">Pools</button>' +
      '<button type="button" class="pool-share-toggle__btn' +
      (view === "tag" ? " is-active" : "") +
      '" role="tab" aria-selected="' +
      (view === "tag" ? "true" : "false") +
      '" data-pool-share-view="tag">Tags</button></div>'
    : "";
  return (
    '<details class="metric-board metric-board--dense metric-board--pool-share"' +
    (poolShareOpen ? " open" : "") +
    ">" +
    '<summary class="metric-board-heading pool-share-summary">' +
    '<div class="pool-share-summary-top">' +
    '<div class="pool-share-heading-text">' +
    '<h3 class="metric-board-title">Share of last ' +
    escapeHtml(String(windowSize)) +
    " blocks</h3>" +
    (range ? '<p class="metric-board-asof">' + escapeHtml(range) + "</p>" : "") +
    "</div>" +
    toggle +
    "</div>" +
    poolShareStackHtml(share, view) +
    "</summary>" +
    '<div class="pool-share-body">' +
    poolShareListHtml(share, view) +
    "</div></details>"
  );
}

function rememberPoolShareOpen() {
  const board = document.querySelector(".metric-board--pool-share");
  if (board && board.isConnected) poolShareOpen = !!board.open;
}

function poolShareHost() {
  let host = document.getElementById("blockCarouselShare");
  if (host) return host;
  const track = document.getElementById("blockCarouselTrack");
  if (!track || !track.parentElement) return null;
  host = document.createElement("div");
  host.id = "blockCarouselShare";
  host.className = "block-carousel-share";
  track.insertAdjacentElement("afterend", host);
  return host;
}

function syncPoolShareBoard(share) {
  rememberPoolShareOpen();
  const host = poolShareHost();
  if (!host) return;
  const html = poolShareBoardHtml(share);
  const existing = host.querySelector(".metric-board--pool-share");
  if (!html) {
    if (existing) existing.remove();
    return;
  }
  if (!existing) {
    const retarget = host.querySelector(".pool-share-retarget");
    if (retarget) retarget.insertAdjacentHTML("beforebegin", html);
    else host.insertAdjacentHTML("beforeend", html);
    return;
  }
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const next = tmp.querySelector(".metric-board--pool-share");
  if (!next) return;
  const title = existing.querySelector(".metric-board-title");
  const nextTitle = next.querySelector(".metric-board-title");
  if (title && nextTitle) title.textContent = nextTitle.textContent;
  const heading = existing.querySelector(".pool-share-heading-text");
  let asof = existing.querySelector(".metric-board-asof");
  const nextAsof = next.querySelector(".metric-board-asof");
  if (asof && nextAsof) asof.textContent = nextAsof.textContent;
  else if (!asof && nextAsof && heading) heading.appendChild(nextAsof);
  else if (asof && !nextAsof) asof.remove();
  const body = existing.querySelector(".pool-share-body");
  const nextBody = next.querySelector(".pool-share-body");
  if (body && nextBody) body.innerHTML = nextBody.innerHTML;
  const top = existing.querySelector(".pool-share-summary-top");
  const toggle = existing.querySelector(".pool-share-toggle");
  const nextToggle = next.querySelector(".pool-share-toggle");
  if (toggle && nextToggle) toggle.replaceWith(nextToggle);
  else if (!toggle && nextToggle && top) top.appendChild(nextToggle);
  else if (toggle && !nextToggle) toggle.remove();
  const stack = existing.querySelector(".pool-share-stack");
  const nextStack = next.querySelector(".pool-share-stack");
  const summary = existing.querySelector(".pool-share-summary");
  if (stack && nextStack) stack.replaceWith(nextStack);
  else if (!stack && nextStack && summary) summary.appendChild(nextStack);
  else if (stack && !nextStack) stack.remove();
}

function poolShareMarkHot(board, key) {
  if (!board) return;
  const want = poolShareKey(key).toLowerCase();
  board.querySelectorAll("[data-pool-share-key]").forEach(function (el) {
    const match = !!want && poolShareKey(el.getAttribute("data-pool-share-key")).toLowerCase() === want;
    el.classList.toggle("is-hot", match);
  });
  const stack = board.querySelector(".pool-share-stack");
  if (stack) stack.classList.toggle("is-hovering", !!want);
}

function initPoolShareChart() {
  const host = document.getElementById("metrics");
  if (!host || host._poolShareBound) return;
  host._poolShareBound = true;
  host.addEventListener("toggle", function (e) {
    const board = e.target;
    if (!board || !board.classList || !board.classList.contains("metric-board--pool-share")) return;
    if (!board.isConnected) return;
    poolShareOpen = !!board.open;
    if (!board.open) poolShareMarkHot(board, "");
  });
  host.addEventListener("click", function (e) {
    const retargetClick = e.target.closest(".pool-share-retarget");
    if (retargetClick && host.contains(retargetClick)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const toggle = e.target.closest(".pool-share-toggle");
    if (toggle && host.contains(toggle)) {
      e.preventDefault();
      e.stopPropagation();
    }
    const btn = e.target.closest("[data-pool-share-view]");
    if (!btn || !host.contains(btn)) return;
    e.preventDefault();
    e.stopPropagation();
    const next = btn.getAttribute("data-pool-share-view") === "tag" ? "tag" : "pool";
    if (next === poolShareView) return;
    poolShareView = next;
    if (!lastPoolShare) return;
    syncPoolShareBoard(lastPoolShare);
  });
  host.addEventListener("pointerover", function (e) {
    const row = e.target.closest(".pool-share-row");
    if (!row || !host.contains(row)) return;
    const from = e.relatedTarget;
    if (from && row.contains(from)) return;
    const board = row.closest(".metric-board--pool-share");
    if (!board || !board.open) return;
    poolShareMarkHot(board, row.getAttribute("data-pool-share-key"));
  });
  host.addEventListener("pointerout", function (e) {
    const row = e.target.closest(".pool-share-row");
    if (!row || !host.contains(row)) return;
    const next = e.relatedTarget;
    if (next && row.contains(next)) return;
    if (next && next.closest && next.closest(".pool-share-row")) return;
    const board = row.closest(".metric-board--pool-share");
    if (board) poolShareMarkHot(board, "");
  });
}

function retargetBarHtml(blocksUntilRetarget, progressPct, avgIntervalSec) {
  const pct = Number(progressPct);
  const interval = Number(avgIntervalSec) > 0 ? Number(avgIntervalSec) : 600;
  const etaLabel = formatRetargetEta(blocksUntilRetarget * interval);
  return (
    '<div class="portal-retarget-bar pool-share-retarget" role="group" aria-label="Difficulty retarget">' +
    '<div class="portal-retarget-head">' +
    '<span class="portal-retarget-label">Retarget</span>' +
    '<span class="portal-retarget-meta">' +
    escapeHtml(progressPct + "%") +
    " · " +
    escapeHtml(blocksUntilRetarget + " blocks") +
    " · ~" +
    escapeHtml(etaLabel) +
    "</span></div>" +
    '<div class="portal-retarget-track" role="progressbar" aria-valuenow="' +
    pct +
    '" aria-valuemin="0" aria-valuemax="100" aria-label="Progress to next difficulty retarget">' +
    '<div class="portal-retarget-fill" style="width:' +
    pct +
    '%"></div></div></div>'
  );
}

function retargetHost() {
  let host = document.getElementById("blockCarouselRetarget");
  if (host) return host;
  const track = document.getElementById("blockCarouselTrack");
  if (!track) return null;
  host = document.createElement("div");
  host.id = "blockCarouselRetarget";
  host.className = "block-carousel-retarget";
  track.insertAdjacentElement("beforebegin", host);
  return host;
}

function syncRetargetBar(html) {
  lastRetargetHtml = html || "";
  const leftover = document.querySelector(".metric-board--retarget");
  if (leftover) leftover.remove();
  const shareHost = document.getElementById("blockCarouselShare");
  if (shareHost) {
    shareHost.querySelectorAll(".pool-share-retarget").forEach(function (el) {
      el.remove();
    });
  }
  const host = retargetHost();
  if (!host) return;
  host.innerHTML = html || "";
}

let lastBlockHeight = 0;
let lastPoolShare = null;
let lastRetargetHtml = "";
let lastDatumPool = null;
let poolShareView = "pool";
let poolShareOpen = false;
const DATUM_POOL_NOTE =
  "This is not PPS and not public Stratum. It is a DATUM-only pool. Users run their own node + DATUM gateway, point the gateway at pool.blockvase.com:28915, and payouts happen directly in the coinbase split when the pool finds a block.";

function datumPoolObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function datumPoolSchemaVersion(pool) {
  if (!datumPoolObject(pool)) return null;
  const raw = pool.schema_version != null ? pool.schema_version : pool.schemaVersion;
  const version = Number(raw);
  if (!Number.isFinite(version) || version < 1) return null;
  return version;
}

function datumPoolAvailable(pool) {
  if (!datumPoolObject(pool)) return false;
  if (pool.available === false || pool.available === "false" || pool.available === 0) return false;
  return true;
}

function datumPoolUsable(pool) {
  return datumPoolSchemaVersion(pool) != null && datumPoolAvailable(pool);
}

function adoptDatumPool(next) {
  if (datumPoolUsable(next)) lastDatumPool = next;
  return lastDatumPool;
}

function datumPoolFeeLabel(info, pool) {
  const sources = [info, pool, pool && pool.pool].filter(function (row) {
    return row && typeof row === "object";
  });
  for (let i = 0; i < sources.length; i++) {
    const pct = Number(sources[i].fee_percent);
    if (Number.isFinite(pct)) return (Number.isInteger(pct) ? String(pct) : pct.toFixed(2).replace(/\.?0+$/, "")) + "%";
  }
  for (let i = 0; i < sources.length; i++) {
    const bps = Number(sources[i].fee_bps);
    if (Number.isFinite(bps)) {
      const fromBps = bps / 100;
      return (Number.isInteger(fromBps) ? String(fromBps) : fromBps.toFixed(2).replace(/\.?0+$/, "")) + "%";
    }
  }
  return "0%";
}

function datumPoolEndpoint(pool) {
  const links = datumPoolObject(pool.links) || {};
  const info = datumPoolObject(pool.pool) || {};
  const linked = String(links.datum_endpoint || "").trim();
  if (linked) return linked;
  const host = String(info.datum_host || "").trim();
  const port = info.datum_port;
  if (host && port != null && String(port).trim()) return host + ":" + String(port).trim();
  return host;
}

function datumPoolSourceUrl(pool) {
  const links = datumPoolObject(pool.links) || {};
  const info = datumPoolObject(pool.pool) || {};
  const raw = String(links.source || info.source_url || "").trim();
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.href;
  } catch (_err) {
    return "";
  }
}

function datumPoolWindowPct(pool) {
  const status = datumPoolObject(pool.status) || {};
  const raw = Number(status.window_progress_percent);
  if (Number.isFinite(raw)) return raw;
  const window = datumPoolObject(pool.window) || {};
  const current = Number(window.current_work);
  const target = Number(window.target_work);
  if (Number.isFinite(current) && Number.isFinite(target) && target > 0) return (current / target) * 100;
  return null;
}

function formatDatumWork(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return "N/A";
  return formatNumber(Math.round(value));
}

function formatDatumHashrate(hs) {
  const value = Number(hs);
  if (!Number.isFinite(value) || value <= 0) return "N/A";
  const units = [
    { scale: 1e15, label: "PH/s" },
    { scale: 1e12, label: "TH/s" },
    { scale: 1e9, label: "GH/s" },
    { scale: 1e6, label: "MH/s" },
    { scale: 1e3, label: "KH/s" },
  ];
  const unit = units.find(function (u) { return value >= u.scale; }) || { scale: 1, label: "H/s" };
  const scaled = value / unit.scale;
  const places = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  return scaled.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1") + " " + unit.label;
}

function formatDatumPercent(n, digits) {
  const value = Number(n);
  if (!Number.isFinite(value)) return "N/A";
  const places = digits == null ? (Math.abs(value) >= 10 ? 1 : 2) : digits;
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1") + "%";
}

function shortenDatumHex(value, head, tail) {
  const text = String(value || "").trim();
  const start = head || 10;
  const end = tail || 8;
  if (text.length <= start + end + 1) return text;
  return text.slice(0, start) + "…" + text.slice(-end);
}

function datumPoolMiners(pool) {
  const miners = Array.isArray(pool.miners) ? pool.miners : [];
  return miners
    .filter(function (row) {
      return row && typeof row === "object" && datumPoolMinerId(row);
    })
    .slice()
    .sort(function (a, b) {
      const aPct = Number(a.window_percent);
      const bPct = Number(b.window_percent);
      if (Number.isFinite(bPct) && Number.isFinite(aPct) && bPct !== aPct) return bPct - aPct;
      return (Number(b.work) || 0) - (Number(a.work) || 0);
    })
    .slice(0, 64);
}

function datumPoolIdentity(value) {
  const text = String(value || "").trim();
  const dot = text.indexOf(".");
  return dot === -1 ? text : text.slice(0, dot);
}

function datumPoolMinerId(row) {
  return datumPoolIdentity(row && (row.id || row.identity));
}

function datumPoolMinersTableHtml(miners) {
  if (!miners.length) {
    return '<p class="datum-pool-miner--empty">No identities in the split yet. Connected gateways appear after their first accepted share.</p>';
  }
  return (
    '<div class="datum-pool-table-wrap">' +
    '<table class="datum-pool-table">' +
    '<thead><tr>' +
    '<th scope="col">Rank</th>' +
    '<th scope="col">Username</th>' +
    '<th scope="col">Window work</th>' +
    '<th scope="col">Split %</th>' +
    '<th scope="col">Hashrate</th>' +
    '<th scope="col">Hash %</th>' +
    "</tr></thead><tbody>" +
    miners
      .map(function (row, idx) {
        const id = datumPoolMinerId(row);
        return (
          "<tr>" +
          '<td class="datum-pool-table__rank">' +
          escapeHtml(String(idx + 1)) +
          "</td>" +
          '<td class="datum-pool-table__user portal-kpi-value--mono" title="' +
          escapeHtml(id) +
          '">' +
          escapeHtml(id) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatDatumWork(row.work)) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatDatumPercent(row.window_percent)) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatDatumHashrate(row.hashrate_hs)) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatDatumPercent(row.hash_percent)) +
          "</td>" +
          "</tr>"
        );
      })
      .join("") +
    "</tbody></table></div>"
  );
}

function datumPoolCopyControl(label, value, kind) {
  const text = String(value || "").trim();
  if (!text) return "";
  return (
    '<button type="button" class="datum-pool-copy" data-datum-copy="' +
    escapeHtml(text) +
    '" title="Copy ' +
    escapeHtml(label) +
    '">' +
    '<span class="datum-pool-copy__label">' +
    escapeHtml(label) +
    "</span>" +
    '<span class="datum-pool-copy__value' +
    (kind === "mono" ? " portal-kpi-value--mono" : "") +
    '">' +
    escapeHtml(kind === "hex" ? shortenDatumHex(text) : text) +
    "</span></button>"
  );
}

function datumPoolUnavailableHtml() {
  return (
    '<section class="metric-board metric-board--dense datum-pool-board">' +
    '<div class="metric-board-heading"><h2 class="metric-board-title">DATUM pool</h2></div>' +
    '<p class="datum-pool-lede">Pool status is unavailable.</p>' +
    '<p class="muted-note datum-pool-note">' +
    escapeHtml(DATUM_POOL_NOTE) +
    "</p></section>"
  );
}

function datumPoolBoardHtml(pool) {
  if (!datumPoolUsable(pool)) return datumPoolUnavailableHtml();
  const info = datumPoolObject(pool.pool) || {};
  const status = datumPoolObject(pool.status) || {};
  const window = datumPoolObject(pool.window) || {};
  const name = String(info.name || "DATUM pool").trim() || "DATUM pool";
  const style = String(info.style || "").trim();
  const endpoint = datumPoolEndpoint(pool);
  const pubkey = String(info.pool_pubkey || "").trim();
  const source = datumPoolSourceUrl(pool);
  const asOf = formatMetricsAsOf(pool.updated_at);
  const progress = datumPoolWindowPct(pool);
  const progressWidth = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
  const miners = datumPoolMiners(pool);
  const sourceHtml = source
    ? '<a class="datum-pool-source" href="' +
      escapeHtml(source) +
      '" target="_blank" rel="noopener noreferrer">Source / AGPL</a>'
    : "";
  return (
    '<section class="metric-board metric-board--dense datum-pool-board">' +
    '<div class="metric-board-heading">' +
    '<h2 class="metric-board-title">' +
    escapeHtml(name) +
    "</h2>" +
    (asOf ? '<p class="metric-board-asof">As of ' + escapeHtml(asOf) + "</p>" : "") +
    "</div>" +
    (style ? '<p class="datum-pool-lede">' + escapeHtml(style) + "</p>" : "") +
    '<p class="muted-note datum-pool-note">' +
    escapeHtml(DATUM_POOL_NOTE) +
    "</p>" +
    '<p class="muted-note datum-pool-audit">' +
    "The TIDES window is auditable via the public stats API: " +
    '<a href="/api/pool">/api/pool</a>' +
    " · " +
    '<a href="/api/shares">/api/shares</a>' +
    "</p>" +
    portalKpiStrip(
      [
        portalKpiHtml("Hashrate", formatDatumHashrate(status.hashrate_hs), { highlight: true, unit: "3h avg" }),
        portalKpiHtml("Gateways", formatNumber(Number(status.connected_datum_clients) || 0), { unit: "connected" }),
        portalKpiHtml("Identities", formatNumber(miners.length), { unit: "in split" }),
        portalKpiHtml("Fee", datumPoolFeeLabel(info, pool)),
        portalKpiHtml("Window", formatDatumPercent(progress)),
        portalKpiHtml("Shares", formatNumber(Number(status.shares) || 0)),
        portalKpiHtml("Blocks", formatNumber(Number(status.blocks_found) || 0), { unit: "found" }),
      ],
      "portal-kpi-strip--in-board"
    ) +
    '<div class="datum-pool-progress portal-retarget-bar pool-share-retarget">' +
    '<div class="portal-retarget-head">' +
    '<span class="portal-retarget-label">Window</span>' +
    '<span class="portal-retarget-meta">' +
    escapeHtml(formatDatumPercent(progress)) +
    (window.description ? " · " + escapeHtml(String(window.description)) : "") +
    "</span></div>" +
    '<div class="portal-retarget-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
    escapeHtml(String(progressWidth)) +
    '" aria-label="DATUM window progress">' +
    '<div class="portal-retarget-fill" style="width:' +
    progressWidth +
    '%"></div></div>' +
    '<p class="datum-pool-window-work">Work ' +
    escapeHtml(formatDatumWork(window.current_work != null ? window.current_work : status.work)) +
    " / " +
    escapeHtml(formatDatumWork(window.target_work != null ? window.target_work : status.window)) +
    "</p></div>" +
    '<div class="datum-pool-connect">' +
    datumPoolCopyControl("C_DATUM_PRIME ENDPOINT", endpoint) +
    datumPoolCopyControl("Pool pubkey", pubkey, "hex") +
    sourceHtml +
    "</div>" +
    '<div class="datum-pool-miners">' +
    '<h3 class="datum-pool-miners__title">Payout identities</h3>' +
    '<p class="datum-pool-miners__hint">Split % is the paid coinbase split. Hash % is the 3h accepted-work share.</p>' +
    datumPoolMinersTableHtml(miners) +
    "</div></section>"
  );
}

function syncDatumPoolBoard(pool) {
  const host = document.getElementById("datumPoolBoard");
  if (!host) return;
  host.innerHTML = datumPoolBoardHtml(pool);
}

function initDatumPoolBoard() {
  const host = document.getElementById("datumPoolBoard");
  if (!host || host.dataset.bound === "1") return;
  host.dataset.bound = "1";
  if (!host.innerHTML.trim()) syncDatumPoolBoard(null);
  host.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-datum-copy]");
    if (!btn || !host.contains(btn)) return;
    const text = btn.getAttribute("data-datum-copy") || "";
    if (!text) return;
    copyTextToClipboard(text, btn).then(function (ok) {
      if (!ok) return;
      btn.classList.add("is-copied");
      const value = btn.querySelector(".datum-pool-copy__value");
      const prev = value ? value.textContent : "";
      if (value) value.textContent = "Copied";
      setTimeout(function () {
        btn.classList.remove("is-copied");
        if (value) value.textContent = prev;
      }, 1200);
    });
  });
}

/** Match backend state poller / settings stats refresh */
const METRICS_POLL_MS = 5000;
const PRIME_POOL_POLL_MS = 20000;
let metricsPollTimer = null;
let primePoolPollTimer = null;

function publicPoolDocument(data) {
  if (!data || typeof data !== "object") return null;
  if (data.datum_pool && typeof data.datum_pool === "object") return data.datum_pool;
  if (data.pool || data.status || Array.isArray(data.miners)) return data;
  return null;
}

async function loadPrimePool() {
  try {
    const r = await blockvasePublicFetch("/pool");
    const d = await r.json();
    const pool = publicPoolDocument(d);
    if (adoptDatumPool(pool)) syncDatumPoolBoard(lastDatumPool);
  } catch (_err) {
    // Keep the last Prime cache. Do not wait for node-data ingest.
  }
}

function startPrimePoolPolling() {
  if (primePoolPollTimer) clearInterval(primePoolPollTimer);
  primePoolPollTimer = setInterval(function () {
    loadPrimePool().catch(function () {});
  }, PRIME_POOL_POLL_MS);
}

function loadDeviceName() {
  const h1 = document.getElementById("deviceNameHeader");
  if (h1) h1.textContent = "Blockvase";
}

function miningPromoHtml() {
  return (
    '<p class="portal-compact-note portal-mining-promo">' +
    "Mine Bitcoin using your own full solo mining node. " +
    '<a href="#shop" data-portal-tab-link="shop">Shop Blockvase</a>' +
    "</p>"
  );
}

const BLOCK_CAROUSEL_TX_LIMIT = 200;
const BLOCK_CAROUSEL_CARD_LIMIT = 24;
const BLOCK_CAROUSEL_LAZY_BATCH = 8;
const BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS = 12;
const BLOCK_TXS_RETRY_MS = 16000;
let blockTxsRetryTimer = 0;
let blockTxsRetryKey = "";
const blockCarouselState = {
  selected: "live",
  loadingKey: "",
  pendingSelectTxid: "",
  items: [],
  bound: false,
  drag: null,
  suppressClick: false,
  pinScrollKey: "",
  searchingNode: false,
  renderCount: 0,
  olderLoading: false,
  olderDone: false,
};

function esploraScriptType(type) {
  const map = {
    v0_p2wpkh: "witness_v0_keyhash",
    v0_p2wsh: "witness_v0_scripthash",
    v1_p2tr: "witness_v1_taproot",
    p2wpkh: "witness_v0_keyhash",
    p2wsh: "witness_v0_scripthash",
    p2tr: "witness_v1_taproot",
    p2pkh: "pubkeyhash",
    p2sh: "scripthash",
    p2pk: "pubkey",
    p2ms: "multisig",
    op_return: "nulldata",
  };
  return map[String(type || "").toLowerCase()] || type || "";
}

function normalizeExplorerTx(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (Array.isArray(raw.vin) && raw.vin.some((v) => v && (v.prevout || v.coinbase || v.scriptPubKey))) {
    if (raw.vin[0] && raw.vin[0].prevout && raw.vin[0].prevout.scriptPubKey) return raw;
  }
  if (!Array.isArray(raw.vin) || !Array.isArray(raw.vout)) return raw;
  const looksEsplora = raw.vin.some((v) => v && (v.prevout && (v.prevout.scriptpubkey_address || v.prevout.scriptpubkey_type || v.prevout.value > 50)));
  if (!looksEsplora && !raw.status) return raw;
  return {
    txid: raw.txid,
    confirmations: raw.confirmations > 0 || (raw.status && raw.status.confirmed) ? Math.max(1, Number(raw.confirmations) || 1) : 0,
    vin: raw.vin.map(function (inp) {
      if (!inp || inp.coinbase || inp.is_coinbase || !inp.txid) return { coinbase: true };
      const prev = inp.prevout || {};
      const sats = Number(prev.value);
      return {
        txid: inp.txid,
        vout: inp.vout,
        prevout: {
          value: Number.isFinite(sats) && sats > 50 ? sats / 1e8 : Number(prev.value) || 0,
          scriptPubKey: {
            address: prev.scriptpubkey_address || prev.address || (prev.scriptPubKey && prev.scriptPubKey.address) || "",
            type: esploraScriptType(prev.scriptpubkey_type || (prev.scriptPubKey && prev.scriptPubKey.type) || ""),
          },
        },
      };
    }),
    vout: raw.vout.map(function (out) {
      const sats = Number(out && out.value);
      const value = Number.isFinite(sats) && sats > 50 ? sats / 1e8 : Number(out && out.value) || 0;
      return {
        value: value,
        scriptPubKey: {
          address: (out && (out.scriptpubkey_address || out.address)) || (out && out.scriptPubKey && out.scriptPubKey.address) || "",
          type: esploraScriptType((out && out.scriptpubkey_type) || (out && out.scriptPubKey && out.scriptPubKey.type) || ""),
        },
      };
    }),
  };
}

function animationTxFromEsplora(tx) {
  if (!tx || !tx.txid) return null;
  const fee = Number(tx.fee != null ? tx.fee : tx.fee_sats) || 0;
  const weight = Number(tx.weight) || 0;
  const vsize = Number(tx.vsize) || (weight ? Math.ceil(weight / 4) : Number(tx.size) || 0);
  const size = Number(tx.size) || vsize || 1;
  return { txid: tx.txid, size: size, vsize: vsize || size, fee_sats: fee };
}

async function fetchBlockTxsForAnimation(height, hash) {
  let url = "/block-txs?height=" + encodeURIComponent(String(height));
  if (hash) url += "&hash=" + encodeURIComponent(String(hash));
  const r = await blockvaseFetchWithTimeout(url, 10000);
  let data = null;
  try {
    data = await r.json();
  } catch (_) {
    data = null;
  }
  if (r.ok && data && Array.isArray(data.txs) && data.txs.length) {
    return {
      hash: data.hash || hash || "",
      txs: data.txs.map(animationTxFromEsplora).filter(Boolean).slice(0, BLOCK_CAROUSEL_TX_LIMIT),
    };
  }
  const err = new Error((data && data.error) || "Block transactions are not available yet.");
  err.retry = !data || data.queued !== false;
  throw err;
}

function clearBlockTxsRetry() {
  if (blockTxsRetryTimer) {
    clearTimeout(blockTxsRetryTimer);
    blockTxsRetryTimer = 0;
  }
  blockTxsRetryKey = "";
}

function scheduleBlockTxsRetry(item, options) {
  if (!item || item.mining || !item.height) return;
  clearBlockTxsRetry();
  blockTxsRetryKey = item.key;
  blockTxsRetryTimer = setTimeout(function () {
    blockTxsRetryTimer = 0;
    if (blockCarouselState.selected !== item.key) return;
    retryBlockTxsForSelected(item, options);
  }, BLOCK_TXS_RETRY_MS);
}

async function retryBlockTxsForSelected(item, options) {
  const opts = options || {};
  try {
    const loaded = await fetchBlockTxsForAnimation(item.height, item.hash);
    if (blockCarouselState.selected !== item.key) return;
    if (loaded.hash) item.hash = loaded.hash;
    const tid = String(opts.selectTxid || blockCarouselState.pendingSelectTxid || "").trim();
    if (tid && blockCarouselState.pendingSelectTxid.toLowerCase() === tid.toLowerCase()) {
      blockCarouselState.pendingSelectTxid = "";
    }
    if (tid && opts.tx && !loaded.txs.some(function (t) {
      return String(t.txid || "").toLowerCase() === tid.toLowerCase();
    })) {
      loaded.txs.unshift(opts.tx);
      loaded.txs = loaded.txs.slice(0, BLOCK_CAROUSEL_TX_LIMIT);
    }
    postToMempoolIframe({
      type: "blockvase-load-block",
      height: item.height,
      hash: loaded.hash,
      txs: loaded.txs,
      selectTxid: tid,
    });
    if (tid) openTxExplorer(tid, opts.details);
    clearBlockTxsRetry();
  } catch (e) {
    if (blockCarouselState.selected !== item.key) return;
    if (!e || e.retry === false) return;
    scheduleBlockTxsRetry(item, opts);
  }
}

function asciiFromHexBlob(hex) {
  const h = String(hex || "").replace(/^0x/i, "").replace(/[^0-9a-f]/gi, "");
  if (h.length < 16 || h.length % 2) return "";
  let out = "";
  for (let i = 0; i < h.length; i += 2) {
    const c = parseInt(h.slice(i, i + 2), 16);
    if (c >= 32 && c <= 126) out += String.fromCharCode(c);
    else if (out && !out.endsWith("\n")) out += "\n";
  }
  return out;
}

function formatCoinbaseTag(raw) {
  if (raw == null) return "";
  let text = String(raw).trim();
  if (!text) return "";
  if (/^(0x)?[0-9a-f]+$/i.test(text.replace(/\s+/g, "")) && text.replace(/\s+/g, "").length >= 16) {
    text = asciiFromHexBlob(text) || text;
  }
  const runs = String(text).match(/[\x20-\x7e]{3,}/g) || [];
  if (!runs.length) return "";
  const slashed = [];
  runs.forEach(function (run) {
    const parts = run.match(/\/[^/\n]{1,40}\//g);
    if (parts) parts.forEach(function (part) { slashed.push(part); });
  });
  if (slashed.length) {
    const seen = {};
    text = slashed.filter(function (part) {
      const key = part.toLowerCase();
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    }).join("");
  } else {
    text = runs.sort(function (a, b) { return b.length - a.length; })[0].replace(/\s+/g, " ");
  }
  text = text.replace(/^[^A-Za-z0-9/]+/, "");
  text = text.replace(/^[A-Za-z0-9]\s+(?=[A-Za-z0-9/])/, "");
  text = text.replace(/\s+[^\s]{1,2}$/, "");
  text = text.replace(/[`'"$~|{}()[\]\\]+$/g, "").trim();
  const words = text.split(/\s+/);
  if (words.length >= 2 && words[0].toLowerCase() === words[1].toLowerCase()) {
    text = [words[0]].concat(words.slice(2)).join(" ").trim();
  }
  return text.length >= 3 ? text.slice(0, 40) : "";
}

function normalizePoolName(pool) {
  const text = String(pool || "").trim();
  if (!text || /^(unknown|none|n\/a|null|unidentified|-)$/i.test(text)) return "";
  return text;
}

function blockLabelFromSource(b) {
  if (!b || typeof b !== "object") return { pool: "", coinbase: "" };
  const extras = b.extras && typeof b.extras === "object" ? b.extras : {};
  const extrasPool = extras.pool;
  let pool = b.pool || b.pool_name || b.poolName || b.miner || "";
  if (typeof pool === "object" && pool) pool = pool.name || pool.slug || "";
  if (!pool && extrasPool) {
    pool = typeof extrasPool === "object" ? (extrasPool.name || extrasPool.slug || "") : extrasPool;
  }
  const coinbase = formatCoinbaseTag(
    b.coinbase_tag ||
    b.coinbaseTag ||
    b.coinbase_ascii ||
    b.coinbaseAscii ||
    b.coinbaseSignatureAscii ||
    extras.coinbaseSignatureAscii ||
    extras.coinbase_tag ||
    extras.coinbaseRaw ||
    b.coinbase ||
    ""
  );
  pool = normalizePoolName(pool);
  if (pool && coinbase && pool.toLowerCase() === coinbase.replace(/^\/|\/$/g, "").toLowerCase()) {
    return { pool: pool, coinbase: coinbase };
  }
  return {
    pool: pool,
    coinbase: coinbase,
  };
}

function carryCarouselLabels(items) {
  const prev = {};
  (blockCarouselState.items || []).forEach(function (item) {
    if (!item || item.mining || !item.height) return;
    prev[item.height] = item;
  });
  items.forEach(function (item) {
    if (!item || item.mining) return;
    const old = prev[item.height];
    if (!old) return;
    if (!item.pool && old.pool) item.pool = old.pool;
    if (!item.coinbase && old.coinbase) item.coinbase = old.coinbase;
  });
  return items;
}

function buildBlockCarouselItems(d, mining) {
  const mined = (d.recent_blocks || [])
    .filter(function (b) { return b && Number(b.height) > 0; })
    .slice()
    .sort(function (a, b) { return (Number(b.height) || 0) - (Number(a.height) || 0); })
    .slice(0, BLOCK_CAROUSEL_CARD_LIMIT);
  const seen = {};
  const items = [];
  if (mining && mining.miningHeight) {
    items.push({
      key: "live",
      height: mining.miningHeight,
      mining: true,
      timestamp: 0,
      secondsSinceTip: mining.secondsSinceTip || 0,
      txCount: Number(d.mempool_tx || 0) || 0,
      size: Number(d.mempool_size || d.mempool_bytes || 0) || 0,
      hash: "",
      pool: "",
      coinbase: "",
      avgFee: null,
    });
  }
  mined.forEach(function (b) {
    const height = Number(b.height) || 0;
    if (!height || seen[height]) return;
    seen[height] = true;
    const labels = blockLabelFromSource(b);
    items.push({
      key: String(height),
      height: height,
      mining: false,
      timestamp: Number(b.timestamp || b.time) || 0,
      txCount: Number(b.tx_count || b.nTx || 0) || 0,
      size: Number(b.size || 0) || 0,
      hash: b.hash || b.id || "",
      pool: labels.pool,
      coinbase: labels.coinbase,
      avgFee: null,
    });
  });
  return carryCarouselLabels(items);
}

function blockCarouselTagHtml(kind, value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const copyable = kind === "coinbase" || kind === "pool";
  return (
    '<span class="block-carousel__tag block-carousel__tag--' +
    kind +
    (copyable ? " block-carousel__tag--copy" : "") +
    '" title="' +
    escapeHtml(copyable ? "Click to copy" : text) +
    '"' +
    (copyable ? ' data-copy="' + escapeHtml(text) + '"' : "") +
    ">" +
    escapeHtml(text) +
    "</span>"
  );
}

function blockCarouselCardHtml(item) {
  const selected = blockCarouselState.selected === item.key;
  const loading = blockCarouselState.loadingKey === item.key;
  const cls = [
    "block-carousel__item",
    item.mining ? "block-carousel__item--mining" : "block-carousel__item--mined",
    selected ? "is-selected" : "",
    loading ? "is-loading" : "",
  ].filter(Boolean).join(" ");
  const time = item.mining
    ? "mining " + formatDuration(item.secondsSinceTip)
    : formatTimeAgo(item.timestamp);
  const badge = item.mining ? '<span class="block-carousel__badge">Mining</span>' : "";
  const searchTag = blockCarouselState.searchingNode && (item.mining || selected)
    ? blockCarouselTagHtml("search", "Searching node")
    : "";
  const tags = item.mining
    ? searchTag
    : (searchTag + blockCarouselTagHtml("pool", item.pool) + blockCarouselTagHtml("coinbase", item.coinbase));
  const extra = !item.mining && !item.pool && !item.coinbase && item.avgFee != null
    ? escapeHtml(Number(item.avgFee).toFixed(1) + " sat/vB")
    : "";
  return (
    '<button type="button" class="' + cls + '" role="listitem" data-key="' +
    escapeHtml(item.key) +
    '" data-height="' +
    escapeHtml(String(item.height)) +
    '"' +
    (item.hash ? ' data-hash="' + escapeHtml(item.hash) + '"' : "") +
    ' aria-pressed="' +
    (selected ? "true" : "false") +
    '">' +
    '<span class="block-carousel__height">#' + formatNumber(item.height) + "</span>" +
    '<span class="block-carousel__meta">' +
      badge +
      "<span>" + escapeHtml(time) + "</span>" +
      (tags ? '<span class="block-carousel__tags">' + tags + "</span>" : "") +
      (extra ? "<span>" + extra + "</span>" : "") +
    "</span>" +
    '<span class="block-carousel__stats">' +
      "<span>" + formatNumber(item.txCount || 0) + " tx</span>" +
      "<span>" + escapeHtml(formatBytes(item.size || 0)) + "</span>" +
    "</span>" +
    "</button>"
  );
}

function currentCarouselItem() {
  const key = blockCarouselState.selected || "live";
  return (
    (blockCarouselState.items || []).find(function (b) {
      return b && b.key === key;
    }) ||
    (key === "live"
      ? (blockCarouselState.items || []).find(function (b) { return b && b.mining; }) || null
      : null)
  );
}

function updateViewerTabAsOf(note) {
  const asof = document.getElementById("viewerTabAsOf");
  if (!asof) return;
  asof.textContent = note || "";
  asof.hidden = !note;
}

function updateBlockCarouselAsOf(note) {
  updateViewerTabAsOf(note);
}

function updateMempoolBoardCopy() {
  const input = document.getElementById("mempoolTxSearchInput");
  if (input) input.placeholder = "Full transaction id or block number";
}

function mergeExtraCarouselItems(nextItems) {
  const seen = {};
  nextItems.forEach(function (item) {
    if (item && item.key) seen[item.key] = true;
  });
  (blockCarouselState.items || []).forEach(function (old) {
    if (!old || old.mining || seen[old.key]) return;
    nextItems.push(old);
    seen[old.key] = true;
  });
  const live = nextItems.filter(function (b) { return b && b.mining; });
  const rest = nextItems.filter(function (b) { return b && !b.mining; });
  rest.sort(function (a, b) { return (Number(b.height) || 0) - (Number(a.height) || 0); });
  return live.concat(rest);
}

function restoreCarouselScroll(track, keepLeft) {
  if (blockCarouselState.pinScrollKey) {
    revealPinnedCarouselCard();
    return;
  }
  if (keepLeft > 0) track.scrollLeft = keepLeft;
}

function carouselMountedCount(items) {
  items = items || blockCarouselState.items || [];
  let n = blockCarouselState.renderCount || BLOCK_CAROUSEL_LAZY_BATCH;
  ["selected", "pinScrollKey"].forEach(function (field) {
    const key = blockCarouselState[field];
    if (!key) return;
    const idx = items.findIndex(function (b) { return b && b.key === key; });
    if (idx >= 0) n = Math.max(n, idx + 1);
  });
  return Math.min(items.length, Math.max(BLOCK_CAROUSEL_LAZY_BATCH, n));
}

function paintCarouselTrack(track, keepLeft) {
  const items = blockCarouselState.items || [];
  if (!items.length) {
    blockCarouselState.renderCount = 0;
    track.innerHTML = '<div class="portal-compact-note">No recent block data.</div>';
    return;
  }
  const count = carouselMountedCount(items);
  blockCarouselState.renderCount = count;
  const slice = items.slice(0, count);
  const cards = track.querySelectorAll(".block-carousel__item");
  let same = cards.length === slice.length;
  if (same) {
    for (let i = 0; i < slice.length; i++) {
      if (cards[i].getAttribute("data-key") !== slice[i].key) {
        same = false;
        break;
      }
    }
  }
  if (same) {
    for (let i = 0; i < slice.length; i++) {
      const tmp = document.createElement("div");
      tmp.innerHTML = blockCarouselCardHtml(slice[i]);
      const neu = tmp.firstElementChild;
      const el = cards[i];
      if (!neu || !el) continue;
      el.className = neu.className;
      el.setAttribute("aria-pressed", neu.getAttribute("aria-pressed") || "false");
      if (slice[i].hash) el.setAttribute("data-hash", slice[i].hash);
      else el.removeAttribute("data-hash");
      el.setAttribute("data-height", neu.getAttribute("data-height") || "");
      el.innerHTML = neu.innerHTML;
    }
  } else {
    track.innerHTML = slice.map(blockCarouselCardHtml).join("");
  }
  restoreCarouselScroll(track, keepLeft || 0);
}

function oldestCarouselHeight() {
  let min = 0;
  (blockCarouselState.items || []).forEach(function (item) {
    if (!item || item.mining) return;
    const height = Number(item.height) || 0;
    if (height && (!min || height < min)) min = height;
  });
  return min;
}

function appendCarouselBlockItems(blocks) {
  const seen = {};
  (blockCarouselState.items || []).forEach(function (item) {
    if (item && item.key) seen[item.key] = true;
  });
  (blocks || []).forEach(function (block) {
    const height = Number(block && block.height) || 0;
    if (!height || seen[String(height)]) return;
    seen[String(height)] = true;
    const labels = blockLabelFromSource(block);
    blockCarouselState.items.push({
      key: String(height),
      height: height,
      mining: false,
      timestamp: Number(block.timestamp || block.time) || 0,
      txCount: Number(block.tx_count || block.nTx || 0) || 0,
      size: Number(block.size || 0) || 0,
      hash: block.hash || block.id || "",
      pool: labels.pool,
      coinbase: labels.coinbase,
      avgFee: null,
      _older: true,
    });
  });
  const live = (blockCarouselState.items || []).filter(function (b) { return b && b.mining; });
  const rest = (blockCarouselState.items || []).filter(function (b) { return b && !b.mining; });
  rest.sort(function (a, b) { return (Number(b.height) || 0) - (Number(a.height) || 0); });
  blockCarouselState.items = live.concat(rest);
}

async function fetchOlderCarouselBlocks() {
  if (blockCarouselState.olderLoading || blockCarouselState.olderDone) return;
  const before = oldestCarouselHeight();
  if (!before) return;
  blockCarouselState.olderLoading = true;
  try {
    const response = await blockvaseFetch(
      "/recent-blocks?before=" + encodeURIComponent(before) + "&limit=" + BLOCK_CAROUSEL_CARD_LIMIT
    );
    const data = await response.json();
    const incoming = Array.isArray(data.blocks) ? data.blocks : [];
    if (!incoming.length) {
      blockCarouselState.olderDone = true;
      return;
    }
    if (incoming.length < BLOCK_CAROUSEL_CARD_LIMIT || data.has_more === false) {
      blockCarouselState.olderDone = incoming.length < BLOCK_CAROUSEL_CARD_LIMIT;
    }
    appendCarouselBlockItems(incoming);
    mountCarouselBatch();
  } catch (_err) {
  } finally {
    blockCarouselState.olderLoading = false;
  }
}

function mountCarouselBatch() {
  const track = document.getElementById("blockCarouselTrack");
  const items = blockCarouselState.items || [];
  if (!track || !items.length) return false;
  if ((blockCarouselState.renderCount || 0) >= items.length) return false;
  const next = Math.min(items.length, (blockCarouselState.renderCount || 0) + BLOCK_CAROUSEL_LAZY_BATCH);
  const add = items.slice(blockCarouselState.renderCount, next);
  if (!add.length) return false;
  track.insertAdjacentHTML("beforeend", add.map(blockCarouselCardHtml).join(""));
  blockCarouselState.renderCount = next;
  return true;
}

function extendCarouselIfNeeded() {
  const track = document.getElementById("blockCarouselTrack");
  if (!track) return;
  if (track.scrollWidth - track.scrollLeft - track.clientWidth > 220) return;
  if (mountCarouselBatch()) return;
  fetchOlderCarouselBlocks();
}

function renderBlockCarousel(d, mining) {
  const track = document.getElementById("blockCarouselTrack");
  if (!track) return;
  const items = mergeExtraCarouselItems(buildBlockCarouselItems(d, mining));
  const keepLeft = track.scrollLeft;
  blockCarouselState.items = items;
  paintCarouselTrack(track, keepLeft);
  updateMempoolBoardCopy(currentCarouselItem());
}

function closeTxExplorerPanel() {
  const panel = document.getElementById("tx-detail-panel");
  const closeBtn = document.querySelector(".tx-detail-close");
  if (panel && panel.classList.contains("expanded") && closeBtn) closeBtn.click();
}

function scrollCarouselToKey(key) {
  const track = document.getElementById("blockCarouselTrack");
  if (!track || !key) return;
  const btn = track.querySelector('.block-carousel__item[data-key="' + String(key).replace(/"/g, "") + '"]');
  if (!btn) return;
  const startPad = 8;
  const endPad = 72;
  const btnLeft = btn.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  const btnRight = btnLeft + btn.offsetWidth;
  const viewLeft = track.scrollLeft;
  const viewRight = viewLeft + track.clientWidth;
  let next = viewLeft;
  if (btnRight > viewRight - endPad) next = btnRight - track.clientWidth + endPad;
  if (btnLeft < next + startPad) next = btnLeft - startPad;
  const max = Math.max(0, track.scrollWidth - track.clientWidth);
  next = Math.max(0, Math.min(next, max));
  track.style.scrollSnapType = "none";
  track.scrollLeft = next;
}

function revealPinnedCarouselCard() {
  if (!blockCarouselState.pinScrollKey) return;
  scrollCarouselToKey(blockCarouselState.pinScrollKey);
  requestAnimationFrame(function () {
    if (!blockCarouselState.pinScrollKey) return;
    scrollCarouselToKey(blockCarouselState.pinScrollKey);
  });
}

function ensureCarouselItemForHeight(height, hash) {
  const key = String(height);
  let item = blockCarouselState.items.find(function (b) { return b.key === key; });
  if (item) return item;
  item = {
    key: key,
    height: Number(height) || 0,
    mining: false,
    timestamp: 0,
    txCount: 0,
    size: 0,
    hash: hash || "",
    pool: "",
    coinbase: "",
    avgFee: null,
    _extra: true,
  };
  const live = blockCarouselState.items.filter(function (b) { return b.mining; });
  const rest = blockCarouselState.items.filter(function (b) { return !b.mining && b.key !== key; });
  rest.push(item);
  rest.sort(function (a, b) { return (Number(b.height) || 0) - (Number(a.height) || 0); });
  blockCarouselState.items = live.concat(rest);
  renderBlockCarouselRefresh();
  return item;
}

function ensureCarouselRangeForHeight(height, hash) {
  const h = Number(height);
  if (!Number.isFinite(h) || h < 0) return null;
  const live = blockCarouselState.items.filter(function (b) { return b && b.mining; });
  const byKey = {};
  blockCarouselState.items.forEach(function (item) {
    if (!item || item.mining || !item.key) return;
    byKey[item.key] = item;
  });
  for (let n = h + BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS; n >= h - BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS; n--) {
    if (n < 0) continue;
    const key = String(n);
    if (byKey[key]) {
      if (n === h && hash && !byKey[key].hash) byKey[key].hash = hash;
      continue;
    }
    byKey[key] = {
      key: key,
      height: n,
      mining: false,
      timestamp: 0,
      txCount: 0,
      size: 0,
      hash: n === h ? (hash || "") : "",
      pool: "",
      coinbase: "",
      avgFee: null,
      _extra: true,
      _lookupContext: true,
    };
  }
  const rest = Object.keys(byKey).map(function (key) { return byKey[key]; });
  rest.sort(function (a, b) { return (Number(b.height) || 0) - (Number(a.height) || 0); });
  blockCarouselState.items = live.concat(rest);
  renderBlockCarouselRefresh();
  return byKey[String(h)] || null;
}

async function selectBlockCarouselItem(key, options) {
  const opts = options || {};
  const selectTxid = String(opts.selectTxid || "").trim();
  const item = blockCarouselState.items.find(function (b) { return b.key === key; });
  if (!item) {
    clearBlockTxsRetry();
    if (selectTxid) openTxExplorer(selectTxid, opts.details);
    return false;
  }
  if (item.mining) {
    clearBlockTxsRetry();
    blockCarouselState.selected = "live";
    blockCarouselState.loadingKey = "";
    blockCarouselState.pinScrollKey = "live";
    updateMempoolBoardCopy(item);
    renderBlockCarouselRefresh();
    revealPinnedCarouselCard();
    if (!selectTxid) closeTxExplorerPanel();
    postToMempoolIframe({ type: "blockvase-resume-mempool", selectTxid: selectTxid || "" });
    if (selectTxid) openTxExplorer(selectTxid, opts.details);
    return true;
  }
  blockCarouselState.selected = item.key;
  blockCarouselState.loadingKey = item.key;
  blockCarouselState.pinScrollKey = item.key;
  renderBlockCarouselRefresh();
  updateMempoolBoardCopy(item);
  revealPinnedCarouselCard();
  if (!selectTxid) closeTxExplorerPanel();
  try {
    const loaded = await fetchBlockTxsForAnimation(item.height, item.hash);
    if (blockCarouselState.selected !== item.key) return false;
    if (loaded.hash) item.hash = loaded.hash;
    const tid = selectTxid || blockCarouselState.pendingSelectTxid || "";
    if (tid && blockCarouselState.pendingSelectTxid.toLowerCase() === tid.toLowerCase()) {
      blockCarouselState.pendingSelectTxid = "";
    }
    if (tid && opts.tx && !loaded.txs.some(function (t) {
      return String(t.txid || "").toLowerCase() === tid.toLowerCase();
    })) {
      loaded.txs.unshift(opts.tx);
      loaded.txs = loaded.txs.slice(0, BLOCK_CAROUSEL_TX_LIMIT);
    }
    postToMempoolIframe({
      type: "blockvase-load-block",
      height: item.height,
      hash: loaded.hash,
      txs: loaded.txs,
      selectTxid: tid,
    });
    if (tid) openTxExplorer(tid, opts.details);
    else if (!loaded.txs.length) setPortalMempoolSearchStatus("This block has no transactions to display.", true);
    clearBlockTxsRetry();
    return true;
  } catch (e) {
    if (blockCarouselState.selected !== item.key) return false;
    setPortalMempoolSearchStatus(
      selectTxid ? "Showing transaction; full block transactions are not available yet." : (e.message || "Could not load that block."),
      !selectTxid
    );
    postToMempoolIframe({
      type: "blockvase-load-block",
      height: item.height,
      hash: item.hash || "",
      txs: [],
      selectTxid: "",
    });
    if (selectTxid) openTxExplorer(selectTxid, opts.details);
    if (!e || e.retry !== false) scheduleBlockTxsRetry(item, opts);
    return !!selectTxid;
  } finally {
    if (blockCarouselState.loadingKey === item.key) blockCarouselState.loadingKey = "";
    renderBlockCarouselRefresh();
    revealPinnedCarouselCard();
  }
}

function renderBlockCarouselRefresh() {
  const track = document.getElementById("blockCarouselTrack");
  if (!track || !blockCarouselState.items.length) return;
  paintCarouselTrack(track, track.scrollLeft);
}

function flashCarouselTag(tag) {
  if (!tag) return;
  tag.classList.remove("is-flashing");
  void tag.offsetWidth;
  tag.classList.add("is-flashing");
  clearTimeout(tag._carouselFlashTimer);
  tag._carouselFlashTimer = setTimeout(function () {
    tag.classList.remove("is-flashing");
  }, 520);
}

function showCarouselCopiedTip(host, tag, message) {
  if (!host || !tag) return;
  let tip = host.querySelector(".block-carousel__copied-tip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "block-carousel__copied-tip";
    tip.setAttribute("aria-live", "polite");
    host.appendChild(tip);
  }
  tip.textContent = message;
  const h = host.getBoundingClientRect();
  const r = tag.getBoundingClientRect();
  const pad = 8;
  let left = r.left - h.left + r.width / 2;
  const above = r.top - h.top >= 16;
  let top = above ? r.top - h.top - 3 : r.bottom - h.top + 3;
  left = Math.max(pad, Math.min(left, h.width - pad));
  top = Math.max(pad, Math.min(top, h.height - pad));
  tip.style.left = left + "px";
  tip.style.top = top + "px";
  tip.style.transform = above ? "translate(-50%, -100%)" : "translate(-50%, 0)";
  tip.hidden = false;
  clearTimeout(showCarouselCopiedTip._timer);
  showCarouselCopiedTip._timer = setTimeout(function () {
    tip.hidden = true;
  }, 1200);
}

async function copyCarouselTag(track, tag) {
  if (!tag) return;
  const text = tag.getAttribute("data-copy") || "";
  if (!text) return;
  const host = tag.closest(".block-carousel__item") || track;
  flashCarouselTag(tag);
  showCarouselCopiedTip(host, tag, "Copied");
  const ok = await copyTextToClipboard(text, tag);
  if (!ok) showCarouselCopiedTip(host, tag, "Copy failed");
}

function initPortalSelectionGuard() {
  if (document.documentElement.dataset.selectionGuard === "1") return;
  document.documentElement.dataset.selectionGuard = "1";
  function shouldBlockSelection(target) {
    return !!(target && target.closest && target.closest("button, .portal-tab-nav, .block-carousel"));
  }
  document.addEventListener("mousedown", function (e) {
    if (!e.shiftKey || !shouldBlockSelection(e.target)) return;
    e.preventDefault();
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.removeAllRanges) sel.removeAllRanges();
  }, true);
  document.addEventListener("selectstart", function (e) {
    if (shouldBlockSelection(e.target)) e.preventDefault();
  });
}

function initBlockCarousel() {
  if (blockCarouselState.bound) return;
  const track = document.getElementById("blockCarouselTrack");
  if (!track) return;
  blockCarouselState.bound = true;
  const dragThreshold = 6;
  function markDragClick() {
    blockCarouselState.suppressClick = true;
    window.setTimeout(function () {
      blockCarouselState.suppressClick = false;
    }, 400);
  }
  function endDrag(e) {
    const drag = blockCarouselState.drag;
    if (!drag || (e && drag.id !== e.pointerId)) return;
    if (drag.active || drag.moved > dragThreshold) {
      markDragClick();
      if (e && e.cancelable) e.preventDefault();
    }
    track.classList.remove("is-dragging");
    if (e && track.hasPointerCapture && track.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
    }
    blockCarouselState.drag = null;
  }
  track.addEventListener("pointerdown", function (e) {
    if (e.button != null && e.button !== 0) return;
    track.style.scrollSnapType = "";
    if (track.scrollWidth <= track.clientWidth) return;
    blockCarouselState.drag = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: track.scrollLeft,
      active: false,
      moved: 0,
    };
  });
  track.addEventListener("pointermove", function (e) {
    const drag = blockCarouselState.drag;
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
    if (!drag.active && Math.abs(dx) > dragThreshold) {
      drag.active = true;
      blockCarouselState.pinScrollKey = "";
      track.classList.add("is-dragging");
      try {
        track.setPointerCapture(e.pointerId);
      } catch (_err) {}
    }
    if (!drag.active) return;
    e.preventDefault();
    track.scrollLeft = drag.startLeft - dx;
    extendCarouselIfNeeded();
  });
  track.addEventListener("scroll", extendCarouselIfNeeded, { passive: true });
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("lostpointercapture", endDrag);
  track.addEventListener("click", function (e) {
    if (blockCarouselState.suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      blockCarouselState.suppressClick = false;
      return;
    }
    const tag = e.target.closest(".block-carousel__tag[data-copy]");
    if (tag && track.contains(tag)) {
      e.preventDefault();
      e.stopPropagation();
      copyCarouselTag(track, tag);
      return;
    }
    const btn = e.target.closest(".block-carousel__item");
    if (!btn || !track.contains(btn)) return;
    selectBlockCarouselItem(btn.getAttribute("data-key"));
  }, true);
}

async function loadMetrics() {
  const beforeEl = document.getElementById("metricsBeforeMempool");
  const upperDetailEl = document.getElementById("metricsUpperDetail");
  try {
    const r = await blockvaseFetch("/blockchain-info");
    const d = await r.json();

    const status = document.getElementById("status");
    if (!d.connected) {
      document.getElementById("metricsGrid").innerHTML =
        '<div class="error-msg">Not connected to Bitcoin node. Ensure Bitcoin Knots is running and reachable.</div>';
      lastPoolShare = null;
      adoptDatumPool(d.datum_pool && typeof d.datum_pool === "object" ? d.datum_pool : null);
      updateBlockCarouselAsOf("");
      syncPoolShareBoard(null);
      syncRetargetBar("");
      if (beforeEl) beforeEl.innerHTML = "";
      if (upperDetailEl) upperDetailEl.innerHTML = "";
      return;
    }

    const nodeVer = (d.node_version || d.nodeVersion || "").trim();
    const nodeSub = (d.subversion || d.subVersion || "").trim();
    const nodeConnectionText = formatNodeConnection(nodeSub, nodeVer);

    const mining = currentMiningStats(d);
    const blocksUntilRetarget = mining.until;
    const progressPct = mining.progressPct;

    const verifyPct = (d.verificationprogress || 0) * 100;
    const diffParts = formatDifficultyParts(mining.difficulty || d.difficulty || 0);
    const hashParts = formatHashRateParts(mining.networkhashps || 0);
    const chainParts = formatBytesParts(d.size_on_disk || 0);
    const mempoolParts = formatBytesParts(d.mempool_size || d.mempool_bytes || 0);

    const asOfLocal = formatMetricsAsOf(d.updated_at || d.as_of || d.updatedAt);
    const asOfNote = asOfLocal ? "As of " + asOfLocal : "";
    updateBlockCarouselAsOf(asOfNote);
    lastPoolShare = d.pool_share && typeof d.pool_share === "object" ? d.pool_share : null;
    adoptDatumPool(d.datum_pool && typeof d.datum_pool === "object" ? d.datum_pool : null);
    syncDatumPoolBoard(lastDatumPool);
    const gridHtml = metricBoard(
      "Chain overview",
      portalKpiStrip(
        [
          portalKpiHtml("Height", formatNumber(mining.miningHeight || d.blocks || 0), { highlight: true }),
          portalKpiHtml("Difficulty", diffParts.value, { unit: diffParts.unit }),
          portalKpiHtml("Network hash", hashParts.value, { unit: hashParts.unit, accent: true }),
          portalKpiHtml("Chain size", chainParts.value, { unit: chainParts.unit }),
          portalKpiHtml("Mempool tx", formatNumber(d.mempool_tx || 0)),
          portalKpiHtml("Server node peers", formatNumber(d.connections || 0)),
        ],
        "portal-kpi-strip--in-board"
      ),
      "metric-board--chain metric-board--dense"
    );

    const retargetHtml = retargetBarHtml(blocksUntilRetarget, progressPct, mining.avgInterval);

    const mempoolSize =
      mempoolParts.value + (mempoolParts.unit ? " " + mempoolParts.unit : "");

    renderBlockCarousel(d, mining);

    const compactSecondaryHtml = metricBoard(
      "",
      '<div class="metric-cluster-grid">' +
        metricClusterHtml(
          "Node",
          metricKvHtml([
            ["Connection", '<span class="portal-node-connection">' + escapeHtml(nodeConnectionText) + "</span>"],
            ["Verified", verifyPct.toFixed(1) + "%"],
            ["Chain", escapeHtml(String(d.chain || "unknown"))],
            ["Pruned", d.pruned ? "Yes" : "No"],
          ])
        ) +
        metricClusterHtml(
          "Mempool",
          metricKvHtml([
            ["Size", escapeHtml(mempoolSize)],
            [
              "Min fee",
              (d.mempool_minfee || 0).toFixed(8) + ' <span class="portal-kv-unit">BTC/kB</span>',
            ],
          ])
        ) +
        metricClusterHtml(
          "Fees · sat/vB",
          feeStripHtml(d.fee_low, d.fee_medium, d.fee_high)
        ) +
        "</div>" +
        '<div class="metric-cluster-divider" aria-hidden="true"></div>' +
        metricClusterHtml(
          "Mining",
          workVsTipHtml(mining) + miningPromoHtml()
        ),
      "metric-board--dense metric-board--details"
    );

    const upperDetailHtml = compactSecondaryHtml;

    document.getElementById("metricsGrid").innerHTML = gridHtml;
    if (beforeEl) beforeEl.innerHTML = "";
    syncPoolShareBoard(lastPoolShare);
    syncRetargetBar(retargetHtml);
    if (upperDetailEl) upperDetailEl.innerHTML = upperDetailHtml;

    if (d.blocks > lastBlockHeight && lastBlockHeight > 0) {
      setTimeout(() => {
        const newest = document.querySelector('.block-carousel__item--mined[data-height="' + String(d.blocks) + '"]');
        if (newest) {
          newest.classList.add("is-fresh");
          setTimeout(() => newest.classList.remove("is-fresh"), 1200);
        }
      }, 100);
    }
    lastBlockHeight = d.blocks;
  } catch (e) {
    const gridEl = document.getElementById("metricsGrid");
    const upperEl = document.getElementById("metricsUpperDetail");
    lastPoolShare = null;
    updateBlockCarouselAsOf("");
    syncPoolShareBoard(null);
    syncRetargetBar("");
    if (gridEl) gridEl.innerHTML = '<div class="error-msg">Error loading metrics: ' + escapeHtml(e.message || "Unknown error") + ". Reload the page to try again.</div>";
    if (beforeEl) beforeEl.innerHTML = "";
    if (upperEl) upperEl.innerHTML = "";
  }
}

function normalizeBwMode(mode) {
  const raw = String(mode || "").trim().toLowerCase();
  if (raw === "white" || raw === "black" || raw === "glow") return raw;
  return "glow";
}

function currentBwMode() {
  try {
    const saved = localStorage.getItem("blockvase-bw");
    if (saved === "white" || saved === "black" || saved === "glow") return saved;
  } catch (_err) {}
  const fromBody = document.body && document.body.getAttribute("data-bw");
  const fromHtml = document.documentElement.getAttribute("data-bw");
  return normalizeBwMode(fromBody || fromHtml || "");
}

function mempoolIframeSrcWithBw(baseSrc) {
  const u = new URL(baseSrc, window.location.origin);
  const bw = currentBwMode();
  if (bw) u.searchParams.set("bw", bw);
  else u.searchParams.delete("bw");
  return u.pathname + u.search;
}

function syncBwModeToMempoolIframe() {
  const mode = currentBwMode();
  postToMempoolIframe({ type: "bw-mode", mode: mode || "off" });
}

function nextBwMode(mode) {
  if (mode === "glow") return "black";
  if (mode === "black") return "white";
  return "glow";
}

function bwModeNextLabel(mode) {
  if (mode === "glow") return "Switch to black mode";
  if (mode === "black") return "Switch to light mode";
  return "Switch to glow mode";
}

function applyBwMode(mode) {
  const bw = normalizeBwMode(mode);
  document.documentElement.setAttribute("data-bw", bw);
  if (document.body) document.body.setAttribute("data-bw", bw);
  const btn = document.getElementById("bwModeToggle");
  if (btn) {
    btn.setAttribute("aria-label", bwModeNextLabel(bw));
    btn.setAttribute("title", bwModeNextLabel(bw));
  }
  try {
    localStorage.setItem("blockvase-bw", bw);
  } catch (_err) {}
  syncBwModeToMempoolIframe();
  if (typeof openTxExplorer._refreshPalette === "function") openTxExplorer._refreshPalette();
}

function initBwModeToggle() {
  const btn = document.getElementById("bwModeToggle");
  applyBwMode(currentBwMode());
  if (!btn) return;
  const fill = btn.querySelector(".bw-mode-toggle__fill");
  let warpTimer = 0;
  const reduceMotion = function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };
  const clearWarp = function () {
    if (warpTimer) {
      window.clearTimeout(warpTimer);
      warpTimer = 0;
    }
    btn.classList.remove("is-warping");
  };
  const playWoosh = function () {
    if (!fill || reduceMotion()) return;
    btn.classList.remove("is-warping");
    void fill.offsetWidth;
    btn.classList.add("is-warping");
    if (warpTimer) window.clearTimeout(warpTimer);
    warpTimer = window.setTimeout(clearWarp, 1000);
  };
  const onSheenEnd = function (event) {
    if (event.animationName === "bw-toggle-sheen") clearWarp();
  };
  btn.addEventListener("animationend", onSheenEnd);
  if (fill) fill.addEventListener("animationend", onSheenEnd);
  btn.addEventListener("pointerenter", playWoosh);
  btn.addEventListener("focus", function () {
    if (btn.matches(":focus-visible")) playWoosh();
  });
  btn.addEventListener("click", function () {
    playWoosh();
    applyBwMode(nextBwMode(currentBwMode()));
  });
}

function initPortalFullscreen() {
  const btn = document.getElementById("portalFullscreen");
  if (!btn) return;
  const el = document.documentElement;
  const fsEl = () => document.fullscreenElement ?? document.webkitFullscreenElement;
  btn.addEventListener("click", () => {
    if (!fsEl()) {
      (el.requestFullscreen ?? el.webkitRequestFullscreen)?.call(el);
    } else {
      (document.exitFullscreen ?? document.webkitExitFullscreen)?.call(document);
    }
  });
  function updateLabel() {
    btn.setAttribute("aria-label", fsEl() ? "Exit fullscreen" : "Fullscreen");
  }
  document.addEventListener("fullscreenchange", updateLabel);
  document.addEventListener("webkitfullscreenchange", updateLabel);
}

function initDisplayOpenFull() {
  const btn = document.getElementById("displayOpenFull");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.open(window.location.origin + "/mempool", "_blank");
  });
}

function setPortalSearchingNode(on) {
  const next = !!on;
  if (blockCarouselState.searchingNode === next) return;
  blockCarouselState.searchingNode = next;
  renderBlockCarouselRefresh();
}

function setPortalMempoolSearchStatus(message, isMiss, options) {
  const status = document.getElementById("mempoolTxSearchStatus");
  if (!status) return;
  clearTimeout(setPortalMempoolSearchStatus._timer);
  const text = String(message || "").trim();
  const searching = !!(options && options.searching);
  status.textContent = text;
  status.classList.toggle("is-miss", !!isMiss);
  status.classList.toggle("is-searching", searching);
  setPortalSearchingNode(searching);
  if (!text) {
    status.hidden = true;
    return;
  }
  status.hidden = false;
  if (searching || (options && options.hold)) return;
  setPortalMempoolSearchStatus._timer = setTimeout(function () {
    status.hidden = true;
    status.classList.remove("is-searching");
    setPortalSearchingNode(false);
  }, isMiss ? 2200 : 1400);
}

function isCompleteTxidSearch(query) {
  const q = String(query || "").trim().toLowerCase().replace(/^0x/, "");
  return /^[0-9a-f]{64}$/.test(q);
}

function isCompleteBlockHeightSearch(query) {
  const q = String(query || "").trim().replace(/,/g, "").replace(/^#/, "");
  if (!/^\d{1,7}$/.test(q)) return false;
  const n = Number(q);
  return Number.isFinite(n) && n >= 0;
}

function isCompleteSearchQuery(query) {
  return isCompleteTxidSearch(query) || isCompleteBlockHeightSearch(query);
}

function initPortalMempoolSearch() {
  const form = document.getElementById("mempoolTxSearch");
  const input = document.getElementById("mempoolTxSearchInput");
  if (!form || !input || form.dataset.bound) return;
  form.dataset.bound = "1";
  let debounce = 0;
  let portalSearchSeq = 0;
  const resolvedSearchSeqs = new Set();

  function search(query, fromSubmit) {
    const q = String(query || "").trim();
    if (!q) {
      setPortalMempoolSearchStatus("");
      return;
    }
    if (!isCompleteSearchQuery(q)) {
      if (fromSubmit) {
        setPortalMempoolSearchStatus("Enter a full transaction id or block number.", true);
      }
      return;
    }
    const seq = ++portalSearchSeq;
    setPortalMempoolSearchStatus("Searching node", false, { searching: true });
    if (isCompleteBlockHeightSearch(q)) {
      void locateAndShowSearchMatch(q, seq);
      return;
    }
    const iframe = document.getElementById("displayIframe");
    if (!iframe || !iframe.contentWindow || !iframe.src) {
      void locateAndShowSearchMatch(q, seq);
      return;
    }
    postToMempoolIframe({ type: "blockvase-tx-search", q: q, seq: seq });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

function isBlockHeightSearch(query) {
  return isCompleteBlockHeightSearch(query);
}

  async function showSearchMatch(data, seq) {
  if (!data) return false;
    if (seq != null && seq !== portalSearchSeq) return false;
  if (!data.txid && data.source === "block" && data.height != null) {
    const key = String(data.height);
    ensureCarouselRangeForHeight(data.height, data.hash);
    const ok = await selectBlockCarouselItem(key, { force: true });
    if (seq != null && seq !== portalSearchSeq) return false;
    if (ok) {
      setPortalMempoolSearchStatus("Showing block #" + formatNumber(data.height) + ".");
    }
    return ok;
  }
  if (!data.txid) return false;
  if (data.source === "block" && data.height == null && data.details) {
    openTxExplorer(data.txid, data.details);
    setPortalMempoolSearchStatus("Showing the matching transaction.");
    return true;
  }
    const wantLive = data.source === "mempool";
    const key = wantLive ? "live" : (data.height == null ? "" : String(data.height));
  if (!wantLive && data.height != null) ensureCarouselRangeForHeight(data.height, data.hash);
    const alreadyThere = blockCarouselState.selected === key || (wantLive && (!blockCarouselState.selected || blockCarouselState.selected === "live"));
    if (alreadyThere) {
      blockCarouselState.pinScrollKey = key;
      revealPinnedCarouselCard();
      if (blockCarouselState.loadingKey) blockCarouselState.pendingSelectTxid = data.txid;
      else postToMempoolIframe({ type: "blockvase-select-tx", txid: data.txid });
      openTxExplorer(data.txid, data.details);
      setPortalMempoolSearchStatus(
        data.matches > 1 ? "Showing the closest of " + data.matches + " matches." : "Showing the matching transaction."
      );
      return true;
    }
    const ok = await selectBlockCarouselItem(key, { selectTxid: data.txid, force: true, tx: data.tx, details: data.details });
    if (seq != null && seq !== portalSearchSeq) return false;
    if (ok) {
      setPortalMempoolSearchStatus(
        wantLive
          ? "Found in the live mempool."
          : "Found in block #" + formatNumber(data.height) + "."
      );
    }
    return ok;
  }

  async function enqueueAndAwaitSearchJob(q, seq) {
    setPortalMempoolSearchStatus("Searching node", false, { searching: true });
    const createdRes = await blockvaseFetchWithTimeout("/tx-search-jobs", 8000, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: q }),
    });
    let created = null;
    try {
      created = await createdRes.json();
    } catch (_) {
      created = null;
    }
    if (seq != null && seq !== portalSearchSeq) return null;
    if (createdRes.ok && created && created.status === "done" && (created.result || created.txid)) {
      return created.result || created;
    }
    if (!createdRes.ok || !created || !created.job_id) {
      throw new Error((created && created.error) || "Lookup failed.");
    }
    const deadline = Date.now() + 150000;
    while (Date.now() < deadline) {
      if (seq != null && seq !== portalSearchSeq) return null;
      await sleep(1500);
      if (seq != null && seq !== portalSearchSeq) return null;
      try {
        const retry = await blockvaseFetchWithTimeout("/tx-search?q=" + encodeURIComponent(q), 8000);
        const retryData = await retry.json();
        if (retry.ok && retryData && retryData.matches > 0 && (retryData.txid || retryData.height != null)) {
          return retryData;
        }
      } catch (_) {}
      const pollRes = await blockvaseFetchWithTimeout("/tx-search-jobs/" + encodeURIComponent(created.job_id), 8000);
      let poll = null;
      try {
        poll = await pollRes.json();
      } catch (_) {
        poll = null;
      }
      if (!pollRes.ok || !poll) continue;
      if (poll.status === "done" && (poll.result || poll.txid)) {
        return poll.result || poll;
      }
      if (poll.status === "failed") {
        throw new Error(poll.error || "No matching transaction.");
      }
    }
    throw new Error("Lookup timed out.");
  }

  async function locateAndShowSearchMatch(query, seq) {
    const q = String(query || "").trim();
    if (!q || (seq != null && seq !== portalSearchSeq)) return;
    if (seq != null && resolvedSearchSeqs.has(seq)) return;
    if (seq != null) resolvedSearchSeqs.add(seq);
    if (!isCompleteSearchQuery(q)) return;
    setPortalMempoolSearchStatus("Searching node", false, { searching: true });
    try {
      const r = await blockvaseFetchWithTimeout("/tx-search?q=" + encodeURIComponent(q), 8000);
      let data = null;
      try {
        data = await r.json();
      } catch (_) {
        data = null;
      }
      if (seq != null && seq !== portalSearchSeq) return;
      if (r.ok && data && data.matches > 0 && (data.txid || data.height != null)) {
        const shown = await showSearchMatch(data, seq);
        if (shown || isBlockHeightSearch(q)) return;
      }
      if (isBlockHeightSearch(q)) {
        throw new Error("Block is not available in this viewer yet.");
      }
      const jobResult = await enqueueAndAwaitSearchJob(q, seq);
      if (!jobResult) return;
      await showSearchMatch(jobResult, seq);
    } catch (e) {
      if (seq != null && seq !== portalSearchSeq) return;
      setPortalMempoolSearchStatus(e.message || "No matching transaction.", true);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    search(input.value, true);
  });
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    const q = input.value.trim();
    if (!q) {
      setPortalMempoolSearchStatus("");
      return;
    }
    if (!isCompleteTxidSearch(q)) return;
    debounce = setTimeout(() => search(q, false), 120);
  });
  window.addEventListener("message", (ev) => {
    if (ev.origin !== window.location.origin) return;
    if (ev.data?.type !== "blockvase-tx-search-result") return;
    if (ev.data.seq != null && ev.data.seq !== portalSearchSeq) return;
    if (!ev.data.isMiss && ev.data.txid) {
      if (blockCarouselState.loadingKey) {
        void locateAndShowSearchMatch(ev.data.q || input.value, ev.data.seq);
        return;
      }
      setPortalMempoolSearchStatus(ev.data.status || "", false);
      openTxExplorer(ev.data.txid);
      return;
    }
    if (ev.data.isMiss) {
      void locateAndShowSearchMatch(ev.data.q || input.value, ev.data.seq);
    }
  });
}

function initDeferredMempoolIframe() {
  const iframe = document.getElementById("displayIframe");
  const wrapper = document.getElementById("displayIframeWrapper");
  if (!iframe || !wrapper || !iframe.dataset.src) return;
  let assigned = false;
  function assignIframeSrc() {
    if (assigned) return;
    assigned = true;
    iframe.addEventListener("load", function () {
      syncBwModeToMempoolIframe();
      if (pendingMempoolMessage) postToMempoolIframe(pendingMempoolMessage);
    });
    iframe.src = mempoolIframeSrcWithBw(iframe.dataset.src);
    setTimeout(() => wrapper.classList.add("display-iframe-wrapper--cover-hidden"), 100);
  }
  if (document.readyState === "complete") {
    setTimeout(assignIframeSrc, 0);
  } else {
    window.addEventListener("load", () => setTimeout(assignIframeSrc, 0), { once: true });
  }
}

function normalizePortalTab(name) {
  const raw = String(name || "").trim().toLowerCase();
  if (!raw) return "viewer";
  if (
    raw === "block-viewer" ||
    raw === "blockviewer" ||
    raw === "block_viewer" ||
    raw === "metrics" ||
    raw === "metric"
  ) {
    return "viewer";
  }
  if (raw === "orders") return "account";
  return raw;
}

function initPortalTabs() {
  const buttons = Array.from(document.querySelectorAll(".portal-tab-nav [data-portal-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-portal-panel]"));
  const navTabNames = new Set(["viewer", "pool", "shop", "resources"]);
  const disabledNavTabs = new Set(["shop"]);
  if (!buttons.length || !panels.length) return null;

  function canShowTab(tabName) {
    if (disabledNavTabs.has(tabName)) return false;
    if (tabName === "admin") {
      const adminButton = document.getElementById("blockvaseAdminButton");
      return Boolean(adminButton && !adminButton.hidden);
    }
    if (tabName === "affiliates") {
      const affiliatesButton = document.getElementById("blockvaseAffiliatesButton");
      return Boolean(affiliatesButton && !affiliatesButton.hidden);
    }
    return panels.some((panel) => panel.dataset.portalPanel === tabName);
  }

  function showTab(tabName) {
    tabName = normalizePortalTab(tabName);
    if (!canShowTab(tabName)) {
      showTab("viewer");
      return;
    }
    buttons.forEach((button) => {
      const active = navTabNames.has(tabName) && button.dataset.portalTab === tabName;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      const active = panel.dataset.portalPanel === tabName;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (window.location.hash !== "#" + tabName) {
      history.replaceState(null, "", "#" + tabName);
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.portalTab));
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-portal-tab-link]");
    if (!link) return;
    event.preventDefault();
    showTab(link.dataset.portalTabLink);
  });
  window.addEventListener("hashchange", () => {
    showTab(window.location.hash.replace("#", ""));
  });

  showTab(window.location.hash.replace("#", ""));

  return { showTab, canShowTab };
}

const BLOCKVASE_AFFILIATE_STORAGE_KEY = "blockvase_affiliate";
const BLOCKVASE_AFFILIATE_SESSION_KEY = "blockvase_affiliate_session";
const BLOCKVASE_AFFILIATE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function normalizeAffiliateCode(code) {
  return String(code || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 64);
}

function storeAffiliateCode(code) {
  const normalized = normalizeAffiliateCode(code);
  if (!normalized) return;
  try {
    window.localStorage.setItem(
      BLOCKVASE_AFFILIATE_STORAGE_KEY,
      JSON.stringify({ code: normalized, expires_at: Date.now() + BLOCKVASE_AFFILIATE_TTL_MS })
    );
  } catch (error) {}
}

function getStoredAffiliateCode() {
  try {
    const raw = window.localStorage.getItem(BLOCKVASE_AFFILIATE_STORAGE_KEY);
    if (!raw) return "";
    const data = JSON.parse(raw);
    if (!data || !data.code || !data.expires_at || Date.now() > Number(data.expires_at)) {
      clearStoredAffiliateCode();
      return "";
    }
    return normalizeAffiliateCode(data.code);
  } catch (error) {
    return "";
  }
}

function clearStoredAffiliateCode() {
  try {
    window.localStorage.removeItem(BLOCKVASE_AFFILIATE_STORAGE_KEY);
  } catch (error) {}
}

function affiliateSessionKey() {
  try {
    let key = window.localStorage.getItem(BLOCKVASE_AFFILIATE_SESSION_KEY);
    if (!key) {
      key = (window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2);
      window.localStorage.setItem(BLOCKVASE_AFFILIATE_SESSION_KEY, key);
    }
    return key;
  } catch (error) {
    return "";
  }
}

function captureAffiliateReferral() {
  const params = new URLSearchParams(window.location.search || "");
  const code = normalizeAffiliateCode(params.get("ref") || params.get("affiliate"));
  if (!code) return "";
  // Keep the code for checkout even if the click beacon fails; clear it only when
  // the server confirms the code is unknown or inactive.
  storeAffiliateCode(code);
  blockvaseFetch("/affiliate-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ affiliate_code: code, session_key: affiliateSessionKey() }),
  }).then(async (response) => {
    const data = await response.json().catch(() => null);
    if (!data || !data.success) return;
    if (data.affiliate_found === false || data.affiliate_active === false) {
      clearStoredAffiliateCode();
    }
  }).catch(() => {});
  return code;
}

let onBlockvaseCheckoutAuthChange = null;

function blockvaseUserLabel(user) {
  const email = String(user?.email || "").trim();
  if (!email || email === "undefined") return "";
  return email;
}

function blockvaseAccountSessionText(user) {
  if (!user) return "";
  const email = blockvaseUserLabel(user);
  if (email) return "Signed in as " + email + (user.is_admin ? " (admin)" : "");
  return user.is_admin ? "Signed in as admin." : "Signed in to your account.";
}

function blockvaseSignedInText(prefix, user) {
  const email = blockvaseUserLabel(user);
  return email ? prefix + " " + email : prefix;
}

function initBlockvaseCheckout(portalTabs) {
  const checkout = document.querySelector("[data-checkout]");
  const shopProductCard = document.getElementById("blockvaseCheckout");
  const shippingForm = document.getElementById("blockvaseShippingForm");
  const accountForm = document.getElementById("blockvaseAccountForm");
  const checkoutForm = document.getElementById("blockvaseCheckoutForm");
  if (!checkout || !shippingForm || !checkoutForm) return;

  const form = checkoutForm;
  const checkoutDataForms = () => [shippingForm, accountForm, checkoutForm].filter(Boolean);
  const detailsPanel = document.querySelector('[data-checkout-step="details"]');

  const startButton = document.querySelector("[data-checkout-start]");
  const prevButton = document.querySelector("[data-checkout-prev]");
  const nextButton = document.querySelector("[data-checkout-next]");
  const submitButton = document.querySelector("[data-checkout-submit]");
  const status = document.getElementById("blockvaseCheckoutStatus");
  const reviewAddress = document.getElementById("blockvaseReviewAddress");
  const reviewPayment = document.getElementById("blockvaseReviewPayment");
  const reviewItemTotal = document.getElementById("blockvaseReviewItemTotal");
  const reviewShipping = document.getElementById("blockvaseReviewShipping");
  const reviewTotal = document.getElementById("blockvaseReviewTotal");
  const bitcoinQr = document.getElementById("blockvaseBitcoinQr");
  const bitcoinText = document.getElementById("blockvaseBitcoinPaymentText");
  const bitcoinAmount = document.getElementById("blockvaseBitcoinAmount");
  const bitcoinAddress = document.getElementById("blockvaseBitcoinAddress");
  const bitcoinStatus = document.getElementById("blockvaseBitcoinStatus");
  const bitcoinProblemNote = document.getElementById("blockvaseBitcoinProblemNote");
  const bitcoinProblemNoteText = document.getElementById("blockvaseBitcoinProblemNoteText");
  const bitcoinUriLink = document.getElementById("blockvaseBitcoinUriLink");
  const bitcoinQuoteSummary = document.getElementById("blockvaseBitcoinQuoteSummary");
  const cardPriceSummary = document.getElementById("blockvaseCardPriceSummary");
  const copyBitcoinUriButton = document.querySelector("[data-copy-bitcoin-uri]");
  const paymentMethodInputs = Array.from(checkoutForm.querySelectorAll('input[name="payment_method"]'));
  const accountBox = document.getElementById("blockvaseCheckoutAccount");
  const accountNote = document.getElementById("blockvaseCheckoutAccountNote");
  const signedInNote = document.getElementById("blockvaseCheckoutSignedInNote");
  const detailsLede = document.getElementById("checkoutDetailsLede");
  const paymentLede = document.getElementById("blockvasePaymentLede");
  const paymentNote = document.getElementById("blockvasePaymentNote");
  const emailField = shippingForm.querySelector('input[name="email"]');
  const passwordField = accountForm ? accountForm.querySelector('input[name="account_password"]') : null;
  const passwordConfirmField = accountForm ? accountForm.querySelector('input[name="account_password_confirm"]') : null;
  const billingDifferentField = shippingForm.querySelector('input[name="billing_different"]');
  const billingFields = document.getElementById("blockvaseBillingFields");
  const billingFieldInputs = billingFields ? Array.from(billingFields.querySelectorAll("input")) : [];
  const bitcoinPanel = document.getElementById("blockvaseBitcoinInvoice");
  const ipospaysPanel = document.getElementById("blockvaseIpospaysCard");
  const ipospaysStatus = document.getElementById("blockvaseIpospaysStatus");
  const cardNumberField = document.getElementById("ccnumber");
  const cardExpiryField = document.getElementById("ccexpiry");
  const cardCvvField = document.getElementById("cccvv");
  const shippingFirstNameField = document.getElementById("firstName");
  const stepButtons = Array.from(document.querySelectorAll("[data-checkout-step-button]"));
  const panels = Array.from(document.querySelectorAll("[data-checkout-step]"));
  const steps = ["details", "payment", "review"];
  let currentStep = "details";
  let invoice = null;
  let invoiceRequest = null;
  let invoicePollTimer = null;
  let ipospaysConfig = null;
  let ipospaysConfigRequest = null;
  let ipospaysScriptRequest = null;
  let cardOrder = null;
  let checkoutUser = null;
  let bitcoinPricingRetryTimer = null;
  let bitcoinPricingStatusTimer = null;
  let checkoutCompleted = false;
  let bitcoinPaymentUri = "";
  let invoiceCustomerSnapshot = "";
  let lastInvoiceUiKey = "";
  let checkoutSubmitting = false;
  let invoicePollFailures = 0;
  let bitcoinCheckoutAvailable = true;
  let bitcoinCheckoutUnavailableMessage = "";
  const BITCOIN_PRICING_RETRY_MS = 45000;
  const INVOICE_POLL_MS = 4000;
  const INVOICE_POLL_CONFIRMING_MS = 5000;

  function invoiceUiKey(data) {
    if (!data) return "";
    const received = Number(data.amount_received_sats || 0);
    return [
      data.status,
      data.confirmations,
      data.amount_received_sats,
      received > 0 ? data.current_required_sats : data.btc_amount_sats,
      data.underpayment_sats,
      data.txid || "",
    ].join("|");
  }

  function syncBitcoinCheckoutStatus(data) {
    if (!data || selectedPaymentMethod() !== "bitcoin") return;
    const isProblem = data.status === "underpaid" || data.status === "payment_failed";
    if (currentStep === "payment" && data.status === "pending") {
      setStatus("");
      return;
    }
    const message = checkoutCompleted
      ? bitcoinCheckoutCompleteMessage(data)
      : invoiceStatusText(data);
    setStatus(message, isProblem, bitcoinShowsConfirmationSpinner(data));
  }

  function bitcoinConfirmationProgress(data) {
    const required = Number(data && data.settlement_confirmations || 10);
    const confirmations = Math.max(0, Number(data && data.confirmations || 0));
    return confirmations + "/" + required;
  }

  function setStatus(message, isError, showSpinner) {
    if (!status) return;
    status.classList.toggle("is-error", Boolean(isError));
    status.classList.toggle("is-loading", Boolean(showSpinner) && !isError);
    status.replaceChildren();
    if (showSpinner && !isError) {
      const spinner = document.createElement("span");
      spinner.className = "portal-inline-spinner";
      spinner.setAttribute("aria-hidden", "true");
      status.appendChild(spinner);
    }
    if (message) {
      const text = document.createElement("span");
      text.textContent = message;
      status.appendChild(text);
    }
  }

  function setStatusLine(element, text, showSpinner, isError) {
    if (!element) return;
    element.classList.toggle("portal-status-with-spinner", Boolean(showSpinner));
    element.classList.toggle("is-error", Boolean(isError));
    element.replaceChildren();
    if (showSpinner) {
      const spinner = document.createElement("span");
      spinner.className = "portal-inline-spinner";
      spinner.setAttribute("aria-hidden", "true");
      element.appendChild(spinner);
    }
    const label = document.createElement("span");
    label.className = "portal-status-text";
    label.textContent = text || "";
    element.appendChild(label);
  }

  function bitcoinShowsConfirmationSpinner(data) {
    if (!data) return false;
    return data.status === "seen" || data.status === "confirming";
  }

  function bitcoinInvoiceStatusShowsSpinner(data) {
    if (!data) return false;
    return data.status === "pending" || data.status === "seen" || data.status === "confirming";
  }

  function bitcoinInvoiceGuideText(data) {
    if (!data) return "Complete shipping and account details to create an invoice.";
    const btcAmount = data.btc_amount || formatBtcFromSats(data.btc_amount_sats);
    if (data.status === "underpaid" || data.status === "payment_failed") {
      return bitcoinPaymentProblemDetail(data);
    }
    if (bitcoinPaymentSubmitted(data)) {
      return "Order submitted. We will email you once your payment is confirmed and your order is being processed.";
    }
    return "Send exactly " + btcAmount + " BTC to the address below or scan the QR code. You can leave after paying, or stay here — your order submits automatically when we find your transaction on the network.";
  }

  function updateCheckoutAutofillHints() {
    const enableCardAutofill = currentStep === "payment" && selectedPaymentMethod() === "ipospays";
    [
      [cardNumberField, enableCardAutofill ? "cc-number" : "off"],
      [cardExpiryField, enableCardAutofill ? "cc-exp" : "off"],
      [cardCvvField, enableCardAutofill ? "cc-csc" : "off"],
    ].forEach(([field, token]) => {
      if (field) field.setAttribute("autocomplete", token);
    });
  }

  function focusCheckoutDetailsField() {
    window.requestAnimationFrame(() => {
      if (currentStep !== "details" || !shippingFirstNameField || shippingFirstNameField.disabled) return;
      if (typeof shippingFirstNameField.focus === "function") {
        shippingFirstNameField.focus({ preventScroll: true });
      }
    });
  }

  function updatePaymentStepCopy() {
    const method = selectedPaymentMethod();
    const bitcoin = method === "bitcoin";
    if (paymentLede) {
      paymentLede.textContent = !method
        ? "Choose one payment method for the full order total. Split payments are not supported."
        : bitcoin
          ? "Pay the full order total in Bitcoin. No extra step is needed — your order submits automatically when we detect your payment."
          : "Choose one payment method for the full order total. Split payments are not supported.";
    }
    if (paymentNote) {
      paymentNote.textContent = !method
        ? "Select Bitcoin or credit card to continue."
        : bitcoin
          ? "One full payment to the invoice below."
          : "Card details are encrypted before they reach our servers.";
    }
  }

  function shouldHideCheckoutContinue() {
    return currentStep === "payment" && selectedPaymentMethod() === "bitcoin";
  }

  function updateCheckoutActionButtons() {
    const index = steps.indexOf(currentStep);
    const bitcoin = selectedPaymentMethod() === "bitcoin";
    if (prevButton) prevButton.hidden = checkoutCompleted || index === 0;
    if (prevButton) prevButton.disabled = checkoutSubmitting;
    if (nextButton) {
      nextButton.hidden = checkoutCompleted || index === steps.length - 1 || shouldHideCheckoutContinue();
      nextButton.disabled = checkoutSubmitting;
    }
    if (submitButton) {
      submitButton.hidden = checkoutCompleted || (index !== steps.length - 1 || bitcoin);
      submitButton.textContent = "Check / submit payment";
      submitButton.disabled = checkoutSubmitting;
    }
    stepButtons.forEach((button) => {
      button.disabled = checkoutCompleted || checkoutSubmitting;
    });
    paymentMethodInputs.forEach((input) => {
      const disabledByRelay = input.value === "bitcoin"
        && bitcoinCheckoutAvailable === false
        && !invoice
        && !bitcoinPaymentStarted();
      input.disabled = checkoutSubmitting
        || Boolean(invoiceRequest)
        || bitcoinPaymentStarted()
        || Boolean(cardOrder && cardOrder.status === "paid")
        || disabledByRelay;
    });
  }

  function updateBitcoinProblemNote(data) {
    const isProblem = data && (data.status === "underpaid" || data.status === "payment_failed");
    if (bitcoinProblemNote) {
      bitcoinProblemNote.hidden = !isProblem;
      bitcoinProblemNote.classList.toggle("portal-bitcoin-problem-note--underpaid", Boolean(data && data.status === "underpaid"));
      bitcoinProblemNote.classList.toggle("portal-bitcoin-problem-note--payment-failed", Boolean(data && data.status === "payment_failed"));
    }
    if (bitcoinProblemNoteText && isProblem) {
      bitcoinProblemNoteText.textContent = bitcoinPaymentProblemDetail(data);
    }
  }

  function updateBitcoinConfirmationUi(data) {
    const showStatusSpinner = bitcoinInvoiceStatusShowsSpinner(data);
    const showReviewSpinner = bitcoinShowsConfirmationSpinner(data);
    const isProblem = data && (data.status === "underpaid" || data.status === "payment_failed");
    updateBitcoinProblemNote(data);
    if (bitcoinStatus) setStatusLine(bitcoinStatus, invoiceStatusText(data), showStatusSpinner, isProblem);
    if (reviewPayment && selectedPaymentMethod() === "bitcoin") {
      setStatusLine(reviewPayment, paymentReviewText(), showReviewSpinner, isProblem);
    }
    return showStatusSpinner;
  }

  function formValue(name) {
    const data = new FormData();
    checkoutDataForms().forEach((checkoutDataForm) => {
      new FormData(checkoutDataForm).forEach((value, key) => {
        data.set(key, value);
      });
    });
    const aliases = {
      first_name: ["firstName"],
      last_name: ["lastName"],
      address: ["address1"],
      address_line2: ["address2"],
      postal_code: ["zip"],
      billing_address: ["billingAddress1"],
      billing_city: ["billingCity"],
      billing_state: ["billingState"],
      billing_postal_code: ["billingZip"],
    };
    const names = [name].concat(aliases[name] || []);
    for (const fieldName of names) {
      const value = String(data.get(fieldName) || "").trim();
      if (value) return value;
    }
    return "";
  }

  function customerPayload() {
    const accountEmail = typeof checkoutUser?.email === "string" ? checkoutUser.email.trim() : "";
    const customer = {
      first_name: formValue("first_name"),
      last_name: formValue("last_name"),
      email: formValue("email") || accountEmail,
      phone: formValue("phone"),
      address: [formValue("address"), formValue("address_line2")].filter(Boolean).join(", "),
      city: formValue("city"),
      state: formValue("state"),
      postal_code: formValue("postal_code"),
    };
    if (billingDifferent()) {
      customer.billing_address = {
        address: formValue("billing_address"),
        city: formValue("billing_city"),
        state: formValue("billing_state"),
        postal_code: formValue("billing_postal_code"),
      };
    }
    return customer;
  }

  function billingDifferent() {
    return Boolean(billingDifferentField && billingDifferentField.checked);
  }

  function updateBillingFields() {
    const showBilling = billingDifferent();
    if (billingFields) billingFields.hidden = !showBilling;
    billingFieldInputs.forEach((field) => {
      field.disabled = !showBilling;
      field.required = showBilling;
      if (!showBilling) {
        field.value = "";
        field.setCustomValidity("");
      }
    });
  }

  function addressLinesFromValues(prefix, title) {
    const address = formValue(prefix ? prefix + "_address" : "address");
    const city = formValue(prefix ? prefix + "_city" : "city");
    const state = formValue(prefix ? prefix + "_state" : "state");
    const postalCode = formValue(prefix ? prefix + "_postal_code" : "postal_code");
    const cityLine = [city, state, postalCode].filter(Boolean).join(", ");
    return [
      address || cityLine ? "<strong>" + title + "</strong>" : "",
      address ? metricEscape(address) : "",
      cityLine ? metricEscape(cityLine) : "",
    ].filter(Boolean);
  }

  function checkoutRequiresAccount() {
    return Boolean(accountBox && !accountBox.hidden);
  }

  function updateCheckoutAccountUi(user) {
    if (!accountBox) return;
    const loggedInCustomer = Boolean(user && !user.is_admin);
    checkoutUser = loggedInCustomer ? user : null;
    accountBox.hidden = loggedInCustomer;
    if (accountNote) accountNote.hidden = loggedInCustomer;
    if (signedInNote) {
      signedInNote.hidden = !loggedInCustomer;
      signedInNote.textContent = loggedInCustomer ? "You are signed in as " + blockvaseUserLabel(user) + ". No account password is needed for this order." : "";
    }
    if (detailsLede) {
      detailsLede.textContent = loggedInCustomer
        ? "Enter the shipping information for this order. We will use the email on your account."
        : "Enter shipping information and set a password for your account.";
    }
    if (emailField) {
      emailField.required = !loggedInCustomer;
      emailField.disabled = loggedInCustomer;
      const emailLabel = emailField.closest("label");
      if (emailLabel) emailLabel.hidden = loggedInCustomer;
      if (loggedInCustomer) {
        emailField.value = "";
        emailField.setCustomValidity("");
      }
    }
    [passwordField, passwordConfirmField].forEach((field) => {
      if (!field) return;
      field.required = !loggedInCustomer;
      field.disabled = loggedInCustomer;
      if (loggedInCustomer) field.value = "";
      if (loggedInCustomer) field.setCustomValidity("");
    });
    invalidateUnpaidBitcoinInvoice();
  }

  function checkoutPayload(extra) {
    const payload = Object.assign({
      customer: customerPayload(),
      terms_privacy_acknowledgement: Boolean(document.querySelector('input[name="terms_privacy_acknowledgement"]')?.checked),
      affiliate_code: getStoredAffiliateCode(),
    }, extra || {});
    if (checkoutRequiresAccount()) {
      payload.create_account = true;
      payload.account_password = formValue("account_password");
    }
    return payload;
  }

  function customerSnapshot() {
    return JSON.stringify(customerPayload());
  }

  function selectedPaymentMethod() {
    const checked = paymentMethodInputs.find((input) => input.checked);
    return checked ? checked.value : "";
  }

  function paymentReviewText() {
    if (selectedPaymentMethod() === "ipospays") {
      if (cardOrder && cardOrder.status === "paid") return "Credit card paid";
      return ipospaysConfig && ipospaysConfig.configured ? "Credit card" : "Credit card unavailable";
    }
    if (selectedPaymentMethod() !== "bitcoin") return "Choose payment method";
    return invoiceStatusText(invoice);
  }

  function bitcoinPaymentStarted() {
    if (!invoice) return false;
    return ["seen", "confirming", "settled", "underpaid"].includes(invoice.status) || Number(invoice.amount_received_sats || 0) > 0;
  }

  function bitcoinCheckoutLocked() {
    return Boolean(invoiceRequest || bitcoinPaymentStarted());
  }

  function invalidateUnpaidBitcoinInvoice() {
    if (!invoice && !invoiceRequest) return;
    if (invoiceCustomerSnapshot && customerSnapshot() === invoiceCustomerSnapshot) return;
    if (bitcoinPaymentStarted()) {
      setStatus("Bitcoin payment has already started for this order. Shipping and account details are locked.", true);
    } else {
      setStatus("Checkout details updated. We will save them to this unpaid invoice before checking payment.");
    }
    updateCheckoutActionButtons();
  }

  function bitcoinInvoiceNeedsRefresh(data) {
    return data && data.status === "expired" && Number(data.amount_received_sats || 0) <= 0;
  }

  function resetBitcoinInvoiceState() {
    invoice = null;
    invoiceCustomerSnapshot = "";
    bitcoinPaymentUri = "";
    lastInvoiceUiKey = "";
    invoicePollFailures = 0;
    stopInvoicePolling();
  }

  async function syncUnpaidBitcoinOrderDetails(options) {
    if (!invoice || !invoice.order_id || bitcoinPaymentStarted()) return invoice;
    const snapshot = customerSnapshot();
    if (invoiceCustomerSnapshot && snapshot === invoiceCustomerSnapshot) return invoice;
    const silent = Boolean(options && options.silent);
    if (silent && !detailsValidForBackgroundSync()) return invoice;
    if (!silent && !validateDetails()) {
      throw new Error("Complete shipping and account details before checking payment.");
    }
    const response = await blockvaseFetch("/orders/" + encodeURIComponent(invoice.order_id) + "/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: customerPayload() }),
    });
    const data = await response.json();
    if (!data || data.success === false) {
      throw new Error((data && data.message) || "Could not save updated checkout details.");
    }
    invoiceCustomerSnapshot = snapshot;
    setStatus("");
    return invoice;
  }

  async function renewExpiredBitcoinInvoice() {
    if (!invoice || !bitcoinInvoiceNeedsRefresh(invoice) || bitcoinPaymentStarted(invoice)) return invoice;
    if (selectedPaymentMethod() !== "bitcoin" || currentStep !== "payment" || checkoutCompleted) {
      return invoice;
    }
    resetBitcoinInvoiceState();
    if (bitcoinQr) bitcoinQr.innerHTML = "<span>Refreshing invoice...</span>";
    if (bitcoinText) bitcoinText.textContent = "Bitcoin quote expired after 10 minutes. Creating a fresh invoice with the latest live price average.";
    setStatus("Bitcoin quote expired after 10 minutes. Creating a fresh invoice...");
    return createBitcoinInvoice();
  }

  function setPaymentMethod(method) {
    paymentMethodInputs.forEach((input) => {
      input.checked = input.value === method;
    });
  }

  function formatMoneyFromCents(cents) {
    return "$" + (Number(cents || 0) / 100).toFixed(2);
  }

  function formatBtcFromSats(sats) {
    return (Number(sats || 0) / 100000000).toFixed(8);
  }

  function bitcoinRequiredSats(data) {
    if (!data) return 0;
    if (Number(data.current_required_sats || 0) > 0) return Number(data.current_required_sats);
    return Number(data.btc_amount_sats || 0);
  }

  function bitcoinInvoiceSats(data) {
    return Number(data && data.btc_amount_sats || 0);
  }

  function bitcoinUnderpaymentSats(data) {
    if (!data) return 0;
    if (Number(data.underpayment_sats || 0) > 0) return Number(data.underpayment_sats);
    const due = bitcoinRequiredSats(data);
    const received = Number(data.amount_received_sats || 0);
    return due > received ? due - received : 0;
  }

  function safeBitcoinUri(uri) {
    const value = String(uri || "").trim();
    return /^bitcoin:[^\s"'<>]+$/i.test(value) ? value : "";
  }

  function bitcoinUriForAmount(data, sats) {
    const address = String(data && data.btc_address || "").trim();
    if (!address || !Number.isFinite(Number(sats)) || Number(sats) <= 0) return "";
    return "bitcoin:" + address + "?amount=" + encodeURIComponent(formatBtcFromSats(sats));
  }

  function paymentUriForInvoice(data) {
    if (!data) return "";
    if (data.status === "underpaid") {
      return bitcoinUriForAmount(data, bitcoinUnderpaymentSats(data));
    }
    return safeBitcoinUri(data.bitcoin_uri) || bitcoinUriForAmount(data, bitcoinInvoiceSats(data));
  }

  function formatBtcUsdRate(rate) {
    const value = Number(rate);
    if (!Number.isFinite(value) || value <= 0) return null;
    return "$" + value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function bitcoinPaymentProblemDetail(data) {
    if (!data) return "";
    if (data.status === "underpaid") {
      const received = formatBtcFromSats(data.amount_received_sats);
      const required = data.current_required_btc || formatBtcFromSats(bitcoinRequiredSats(data));
      const invoice = data.btc_amount || formatBtcFromSats(data.btc_amount_sats);
      const remaining = formatBtcFromSats(bitcoinUnderpaymentSats(data));
      return (
        "Your invoice requires " + required + " BTC. We received " + received + " BTC. " +
        "Send " + remaining + " BTC more to the same address below to complete your order. " +
        "Your checkout quoted " + invoice + " BTC; Bitcoin price changes do not change your USD order total."
      );
    }
    if (data.status === "payment_failed") {
      return "The previous Bitcoin payment was replaced or cancelled before confirmation. Send a new payment to the address below to complete your order.";
    }
    return "Bitcoin payment issue detected.";
  }

  function quoteExpiryText(data) {
    const seconds = Number(data && data.quote_expires_in_seconds);
    if (!Number.isFinite(seconds) || seconds <= 0) return "Quote refreshes after 10 minutes.";
    const minutes = Math.max(1, Math.round(seconds / 60));
    return "Quote refreshes in " + minutes + " minute" + (minutes === 1 ? "." : "s.");
  }

  function updatePaymentPriceSummaries(data) {
    if (!data) return;
    const total = data.total_cents != null ? formatMoneyFromCents(data.total_cents) : "$1,500.00";
    if (cardPriceSummary) cardPriceSummary.textContent = total + " USD total";
    if (bitcoinQuoteSummary) {
      if (data.btc_amount) {
        bitcoinQuoteSummary.textContent = data.btc_amount + " BTC equivalent (" + total + " USD). " + quoteExpiryText(data);
      } else if (data.btc_amount_sats != null) {
        bitcoinQuoteSummary.textContent = formatBtcFromSats(data.btc_amount_sats) + " BTC equivalent (" + total + " USD). " + quoteExpiryText(data);
      } else if (data.available === false) {
        bitcoinQuoteSummary.textContent = "Bitcoin checkout is temporarily unavailable.";
      } else {
        bitcoinQuoteSummary.textContent = "BTC equivalent refreshes when live pricing loads.";
      }
    }
  }

  function updateCheckoutTotals(data) {
    if (!data) return;
    if (reviewItemTotal && data.item_total_cents != null) reviewItemTotal.textContent = formatMoneyFromCents(data.item_total_cents);
    if (reviewShipping && data.shipping_cents != null) reviewShipping.textContent = formatMoneyFromCents(data.shipping_cents);
    if (reviewTotal && data.total_cents != null) reviewTotal.textContent = formatMoneyFromCents(data.total_cents);
    updatePaymentPriceSummaries(data);
  }

  function bitcoinPaymentSubmitted(data) {
    if (!data) return false;
    return data.status === "seen" || data.status === "confirming" || data.status === "settled";
  }

  function bitcoinCheckoutCompleteMessage(data) {
    if (!data) return "Order submitted.";
    if (data.status === "settled") {
      return "Order submitted and payment confirmed with " + (data.confirmations || 0) + " confirmations.";
    }
    const confirmations = Number(data.confirmations || 0);
    const required = Number(data.settlement_confirmations || 10);
    if (data.status === "confirming") {
      return "Order submitted. We will email you when processing begins (" + confirmations + "/" + required + " confirmations).";
    }
    return "Order submitted. We will email you when your payment is confirmed and your order is being processed.";
  }

  function setCheckoutSubmittedUi(submitted) {
    checkoutCompleted = Boolean(submitted);
    updateCheckoutActionButtons();
  }

  function checkoutPaymentComplete() {
    if (selectedPaymentMethod() === "bitcoin" && invoice && bitcoinPaymentSubmitted(invoice)) {
      return true;
    }
    if (selectedPaymentMethod() === "ipospays" && cardOrder && cardOrder.status === "paid") {
      return true;
    }
    return false;
  }

  function ensureCheckoutCompletedUi() {
    if (!checkoutCompleted && checkoutPaymentComplete()) {
      setCheckoutSubmittedUi(true);
    }
  }

  function completeBitcoinCheckout(data) {
    if (!data || checkoutCompleted) return;
    setCheckoutSubmittedUi(true);
    stopBitcoinPricingRecovery();
    updateReview();
    if (currentStep !== "review") showStep("review");
    setStatus(bitcoinCheckoutCompleteMessage(data), false, bitcoinShowsConfirmationSpinner(data));
  }

  function completeCardCheckout(data) {
    if (!data || checkoutCompleted || data.status !== "paid") return;
    setCheckoutSubmittedUi(true);
    updateReview();
    if (currentStep !== "review") showStep("review");
    setStatus("Credit card payment approved.");
  }

  function bitcoinCheckoutProblemMessage(data) {
    if (!data) return "Bitcoin payment issue detected.";
    if (data.status === "underpaid") {
      const remaining = formatBtcFromSats(bitcoinUnderpaymentSats(data));
      return "Underpayment — send " + remaining + " BTC more to complete this order.";
    }
    if (data.status === "payment_failed") {
      return "The previous Bitcoin payment was replaced or cancelled before confirmation. Send a new payment to complete your order.";
    }
    return "Bitcoin payment issue detected.";
  }

  function handleBitcoinPaymentProblem(data) {
    if (!data || (data.status !== "underpaid" && data.status !== "payment_failed")) return;
    if (checkoutCompleted) {
      setCheckoutSubmittedUi(false);
    }
    if ((data.status === "payment_failed" || data.status === "underpaid") && currentStep === "review") {
      showStep("payment");
    }
    setStatus(bitcoinCheckoutProblemMessage(data), true, false);
    updateBitcoinProblemNote(data);
    if (bitcoinText) {
      bitcoinText.textContent = bitcoinPaymentProblemDetail(data);
    }
  }

  function invoiceStatusText(data) {
    if (!data) return "Create invoice to continue";
    if (data.status === "settled") return "Paid — " + bitcoinConfirmationProgress(data) + " confirmations";
    if (data.status === "confirming") {
      return "Confirming on network (" + bitcoinConfirmationProgress(data) + ")";
    }
    if (data.status === "seen") {
      return "Transaction found — confirming (" + bitcoinConfirmationProgress(data) + ")";
    }
    if (data.status === "underpaid") {
      const remaining = formatBtcFromSats(bitcoinUnderpaymentSats(data));
      return "Underpaid — " + formatBtcFromSats(data.amount_received_sats) + " BTC received, " + remaining + " BTC still due";
    }
    if (data.status === "payment_failed") return "Payment cancelled";
    if (data.status === "expired") return "Expired";
    return "Awaiting payment";
  }

  function updateInvoiceUi(data) {
    invoice = data || invoice;
    if (!invoice) return;
    const previousUiKey = lastInvoiceUiKey;
    const uiKey = invoiceUiKey(invoice);
    const paymentStateChanged = uiKey !== previousUiKey;
    lastInvoiceUiKey = uiKey;
    updateCheckoutTotals(invoice);
    const btcAmount = invoice.status === "underpaid"
      ? formatBtcFromSats(bitcoinUnderpaymentSats(invoice))
      : (invoice.btc_amount || formatBtcFromSats(bitcoinInvoiceSats(invoice)));
    if (bitcoinAmount) {
      bitcoinAmount.textContent = btcAmount + " BTC" + (invoice.status === "underpaid" ? " still due" : " (" + formatMoneyFromCents(invoice.total_cents) + ")");
    }
    if (bitcoinAddress) bitcoinAddress.textContent = invoice.btc_address || "--";
    updateBitcoinConfirmationUi(invoice);
    if (bitcoinText) {
      bitcoinText.textContent = bitcoinInvoiceGuideText(invoice);
    }
    bitcoinPaymentUri = paymentUriForInvoice(invoice);
    if (bitcoinUriLink) {
      bitcoinUriLink.href = bitcoinPaymentUri || "#";
      bitcoinUriLink.hidden = !bitcoinPaymentUri;
    }
    if (copyBitcoinUriButton) copyBitcoinUriButton.hidden = !bitcoinPaymentUri;
    if (bitcoinQr && bitcoinPaymentUri) {
      try {
        const qr = qrcode(0, "M");
        qr.addData(bitcoinPaymentUri, "Byte");
        qr.make();
        bitcoinQr.innerHTML = qr.createSvgTag({
          cellSize: 4,
          margin: 2,
          scalable: true,
          alt: "Bitcoin payment QR code",
          title: "Bitcoin payment QR code",
        });
      } catch (error) {
        bitcoinQr.innerHTML = "<span>QR unavailable. Use the wallet link or copy the URI.</span>";
      }
    } else if (bitcoinQr) {
      bitcoinQr.innerHTML = "<span>Bitcoin URI unavailable. Copy the address manually.</span>";
    }
    if (reviewPayment && selectedPaymentMethod() !== "bitcoin") {
      reviewPayment.textContent = paymentReviewText();
    }
    if (bitcoinPaymentSubmitted(invoice)) {
      completeBitcoinCheckout(invoice);
    } else if (invoice.status === "underpaid" || invoice.status === "payment_failed") {
      handleBitcoinPaymentProblem(invoice);
    }
    if (invoice.status === "settled") {
      setStatus(bitcoinCheckoutCompleteMessage(invoice), false, false);
      stopInvoicePolling();
    } else if (paymentStateChanged) {
      syncBitcoinCheckoutStatus(invoice);
      if (invoice.status === "seen" || invoice.status === "confirming") {
        restartInvoicePolling();
      }
    }
  }

  function updateReview() {
    if (!reviewAddress) return;
    const name = [formValue("first_name"), formValue("last_name")].filter(Boolean).join(" ");
    const accountEmail = typeof checkoutUser?.email === "string" ? checkoutUser.email.trim() : "";
    reviewAddress.innerHTML = [
      name ? "<strong>Ship to</strong><br>" + metricEscape(name) : "",
      formValue("email") || accountEmail ? metricEscape(formValue("email") || accountEmail) : "",
      ...addressLinesFromValues("", "Shipping address"),
      ...(billingDifferent() ? ["", ...addressLinesFromValues("billing", "Billing address")] : []),
    ].filter((line) => line !== "").join("<br>");
    if (reviewPayment && selectedPaymentMethod() !== "bitcoin") {
      reviewPayment.textContent = paymentReviewText();
    } else if (reviewPayment && invoice) {
      updateBitcoinConfirmationUi(invoice);
    }
  }

  function accountFieldNames() {
    return ["account_password", "account_password_confirm"];
  }

  function detailsFieldsToValidate() {
    if (!detailsPanel) return [];
    return Array.from(detailsPanel.querySelectorAll("input")).filter((field) => {
      if (field.disabled) return false;
      if (accountFieldNames().includes(field.name)) return checkoutRequiresAccount();
      return field.required;
    });
  }

  function validateAccountPasswords() {
    if (!checkoutRequiresAccount()) return true;
    const password = formValue("account_password");
    const confirm = formValue("account_password_confirm");
    if (password.length < 8) {
      if (passwordField) {
        passwordField.setCustomValidity("Enter at least 8 characters.");
        passwordField.reportValidity();
      }
      setStatus("Enter an account password with at least 8 characters.", true);
      return false;
    }
    if (passwordField) passwordField.setCustomValidity("");
    if (password !== confirm) {
      if (passwordConfirmField) {
        passwordConfirmField.setCustomValidity("Passwords do not match.");
        passwordConfirmField.reportValidity();
      }
      setStatus("Passwords do not match.", true);
      return false;
    }
    if (passwordConfirmField) passwordConfirmField.setCustomValidity("");
    return true;
  }

  function validateDetails() {
    updateBillingFields();
    const fields = detailsFieldsToValidate();
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      if (invalid.name === "account_password" || invalid.name === "account_password_confirm") {
        setStatus(invalid.name === "account_password_confirm" ? "Passwords do not match." : "Enter an account password with at least 8 characters.", true);
      } else if (invalid.name === "terms_privacy_acknowledgement") {
        setStatus("Please confirm that you have read and agree to the Terms & Conditions and Privacy Policy.", true);
      } else {
        setStatus("Complete shipping and account details to continue.", true);
      }
      return false;
    }
    if (!validateAccountPasswords()) return false;
    setStatus("");
    return true;
  }

  function detailsValidForBackgroundSync() {
    updateBillingFields();
    if (detailsFieldsToValidate().some((field) => !field.checkValidity())) return false;
    if (!checkoutRequiresAccount()) return true;
    const password = formValue("account_password");
    const confirm = formValue("account_password_confirm");
    return password.length >= 8 && password === confirm;
  }

  function validatePaymentSelection() {
    if (selectedPaymentMethod()) return true;
    const firstPaymentInput = paymentMethodInputs[0];
    if (firstPaymentInput && typeof firstPaymentInput.focus === "function") firstPaymentInput.focus();
    return false;
  }

  function canEnterStep(step) {
    if (step === "details" && bitcoinCheckoutLocked()) {
      setStatus("A Bitcoin invoice is already open. Finish this invoice or start checkout over before editing details.", true);
      return false;
    }
    if ((step === "payment" || step === "review") && !validateDetails()) return false;
    if (step === "review" && !validatePaymentSelection()) return false;
    return true;
  }

  function stopBitcoinPricingRecovery() {
    if (bitcoinPricingRetryTimer) {
      window.clearInterval(bitcoinPricingRetryTimer);
      bitcoinPricingRetryTimer = null;
    }
    if (bitcoinPricingStatusTimer) {
      window.clearInterval(bitcoinPricingStatusTimer);
      bitcoinPricingStatusTimer = null;
    }
  }

  function bitcoinPricingStatusMessage(pricing) {
    if (!pricing) return "Bitcoin checkout is temporarily unavailable while live pricing recovers.";
    return pricing.message || (pricing.available ? "Live BTC/USD pricing is ready." : "Live BTC/USD pricing is temporarily unavailable.");
  }

  function setBitcoinCheckoutAvailability(pricing) {
    if (!pricing || invoice) return;
    bitcoinCheckoutAvailable = pricing.available !== false;
    bitcoinCheckoutUnavailableMessage = bitcoinCheckoutAvailable ? "" : bitcoinPricingStatusMessage(pricing);
    if (!bitcoinCheckoutAvailable && selectedPaymentMethod() === "bitcoin" && !bitcoinPaymentStarted()) {
      setPaymentMethod("");
      if (bitcoinPanel) bitcoinPanel.hidden = true;
    }
    updateCheckoutActionButtons();
  }

  function applyBitcoinPricingStatus(pricing) {
    if (!pricing || invoice) return;
    setBitcoinCheckoutAvailability(pricing);
    updateCheckoutTotals(pricing);
    if (bitcoinText) bitcoinText.textContent = bitcoinPricingStatusMessage(pricing);
    if (pricing.available) {
      if (bitcoinQr) bitcoinQr.innerHTML = "<span>Ready to create invoice...</span>";
    } else {
      if (bitcoinQr) bitcoinQr.innerHTML = "<span>Bitcoin checkout unavailable</span>";
    }
  }

  async function refreshBitcoinPricingStatus() {
    if (invoice || currentStep !== "payment") return null;
    try {
      const response = await blockvaseFetch("/checkout/bitcoin/pricing");
      const data = await response.json();
      applyBitcoinPricingStatus(data);
      return data && data.available ? data : null;
    } catch (error) {
      if (bitcoinQr) bitcoinQr.innerHTML = "<span>Waiting for live BTC pricing...</span>";
      if (bitcoinText) bitcoinText.textContent = "Live BTC/USD pricing is temporarily unavailable. We will keep retrying automatically.";
      return null;
    }
  }

  function startBitcoinPricingRecovery() {
    stopBitcoinPricingRecovery();
    if (invoice || currentStep !== "payment") return;
    bitcoinPricingRetryTimer = window.setInterval(() => {
      const method = selectedPaymentMethod();
      if (invoice || currentStep !== "payment" || (method && method !== "bitcoin")) {
        stopBitcoinPricingRecovery();
        return;
      }
      refreshBitcoinPricingStatus()
        .then((pricing) => {
          if (pricing && method === "bitcoin") return createBitcoinInvoice();
          if (pricing) stopBitcoinPricingRecovery();
          return null;
        })
        .catch(() => {});
    }, BITCOIN_PRICING_RETRY_MS);
    bitcoinPricingStatusTimer = window.setInterval(() => {
      refreshBitcoinPricingStatus().catch(() => {});
    }, BITCOIN_PRICING_RETRY_MS);
  }

  async function createBitcoinInvoice() {
    if (invoice) {
      if (bitcoinInvoiceNeedsRefresh(invoice)) {
        resetBitcoinInvoiceState();
      } else {
        updateInvoiceUi(invoice);
        return invoice;
      }
    }
    if (invoiceRequest) return invoiceRequest;
    if (bitcoinQr) bitcoinQr.innerHTML = "<span>Creating invoice...</span>";
    if (bitcoinText) bitcoinText.textContent = "Creating a Bitcoin invoice for this checkout.";
    setStatus("Creating Bitcoin invoice...");
    invoiceRequest = blockvaseFetch("/checkout/bitcoin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkoutPayload()),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.success === false) {
          const error = new Error((data && data.message) || "Bitcoin invoice could not be created.");
          error.btcPricing = data && data.btc_pricing;
          throw error;
        }
        stopBitcoinPricingRecovery();
        invoiceCustomerSnapshot = customerSnapshot();
        if (data.user) updateCheckoutAccountUi(data.user);
        invoiceCustomerSnapshot = customerSnapshot();
        updateInvoiceUi(data);
        startInvoicePolling();
        const pricingMessage = data.btc_pricing && data.btc_pricing.message;
        if (pricingMessage && data.btc_pricing.degraded) {
          setStatus(pricingMessage);
        } else {
          setStatus("");
        }
        return data;
      })
      .catch((error) => {
        if (bitcoinQr) bitcoinQr.innerHTML = "<span>Invoice unavailable</span>";
        if (bitcoinText) {
          bitcoinText.textContent = bitcoinPricingStatusMessage(error.btcPricing);
        }
        setStatus(error.message || "Bitcoin checkout is unavailable.", true);
        startBitcoinPricingRecovery();
        throw error;
      })
      .finally(() => {
        invoiceRequest = null;
        updateCheckoutActionButtons();
      });
    return invoiceRequest;
  }

  function refreshIpospaysUi(errorMessage) {
    if (selectedPaymentMethod() !== "ipospays" || currentStep !== "payment") return;
    if (errorMessage) {
      if (ipospaysStatus) ipospaysStatus.textContent = errorMessage;
      setStatus(errorMessage, true);
      return;
    }
    if (!ipospaysConfig) {
      if (ipospaysStatus) ipospaysStatus.textContent = "Loading secure card checkout...";
      setStatus("Loading secure card checkout...");
      return;
    }
    if (!ipospaysConfig.configured) {
      const message = ipospaysConfig.message || "Credit card checkout is not available yet.";
      if (ipospaysStatus) ipospaysStatus.textContent = message;
      setStatus(message, true);
      return;
    }
    if (ipospaysStatus) {
      ipospaysStatus.textContent = "Your card details are encrypted. We only receive a single-use payment token.";
    }
    setStatus("Enter your card details below to pay the full order total.");
  }

  function updatePaymentMethodPanels() {
    let method = selectedPaymentMethod();
    if (method === "ipospays" && bitcoinPaymentStarted()) {
      setPaymentMethod("bitcoin");
      method = "bitcoin";
      setStatus("Bitcoin payment has already started for this order. Finish with Bitcoin; split payments are not supported.", true);
    }
    if (method === "bitcoin" && cardOrder && cardOrder.status === "paid") {
      setPaymentMethod("ipospays");
      method = "ipospays";
      setStatus("Card payment is already approved for this order. Split payments are not supported.", true);
    }
    if (bitcoinPanel) bitcoinPanel.hidden = method !== "bitcoin";
    if (ipospaysPanel) ipospaysPanel.hidden = method !== "ipospays";
    updatePaymentStepCopy();
    updateCheckoutActionButtons();
    if (reviewPayment) reviewPayment.textContent = paymentReviewText();
    if (!method) {
      stopBitcoinPricingRecovery();
      setStatus("");
      if (currentStep === "payment") {
        refreshBitcoinPricingStatus()
          .then((pricing) => {
            if (!pricing && bitcoinCheckoutUnavailableMessage) {
              setStatus(bitcoinCheckoutUnavailableMessage, true);
              startBitcoinPricingRecovery();
            }
          })
          .catch(() => {});
      }
    } else if (method === "ipospays") {
      stopBitcoinPricingRecovery();
      refreshIpospaysUi();
      loadIpospaysConfig()
        .then(() => refreshIpospaysUi())
        .catch((error) => refreshIpospaysUi(error.message || "Could not load secure card checkout."));
    } else if (currentStep === "payment") {
      refreshBitcoinPricingStatus()
        .then((pricing) => {
          if (pricing) return createBitcoinInvoice();
          startBitcoinPricingRecovery();
          return null;
        })
        .catch(() => {});
    } else {
      stopBitcoinPricingRecovery();
    }
    updateCheckoutAutofillHints();
  }

  async function loadIpospaysConfig() {
    if (ipospaysConfigRequest) return ipospaysConfigRequest;
    if (ipospaysConfig && ipospaysConfig.configured && typeof window.postData === "function") {
      return ipospaysConfig;
    }

    ipospaysConfigRequest = (async () => {
      if (!ipospaysConfig) {
        if (ipospaysStatus) ipospaysStatus.textContent = "Loading secure card checkout...";
        const response = await blockvaseFetch("/checkout/ipospays/config");
        ipospaysConfig = (await response.json()) || {};
        updateCheckoutTotals(ipospaysConfig);
      }
      if (!ipospaysConfig.configured) {
        return ipospaysConfig;
      }
      if (typeof window.postData !== "function") {
        await loadIpospaysScript(ipospaysConfig);
      }
      return ipospaysConfig;
    })()
      .finally(() => {
        ipospaysConfigRequest = null;
      });

    return ipospaysConfigRequest;
  }

  function extractIpospaysPaymentToken(tokenResponse) {
    if (!tokenResponse) return "";
    if (typeof tokenResponse === "string") return tokenResponse.trim();
    return String(
      tokenResponse.payment_token_id
      || tokenResponse.paymentTokenId
      || tokenResponse.paymentTokenID
      || tokenResponse.paymentToken
      || tokenResponse.token
      || ""
    ).trim();
  }

  function ipospaysTokenizationError(tokenResponse, error) {
    if (error && error.message) return error.message;
    if (tokenResponse && typeof tokenResponse === "object") {
      const message = tokenResponse.errorMessage
        || tokenResponse.message
        || tokenResponse.error
        || (Array.isArray(tokenResponse.errors) && tokenResponse.errors[0] && tokenResponse.errors[0].message);
      if (message) return String(message);
    }
    return "Could not secure your card details. Please check the fields and try again.";
  }

  function loadIpospaysScript(config) {
    if (window.postData) return Promise.resolve();
    if (ipospaysScriptRequest) return ipospaysScriptRequest;
    if (!config || !config.ftd_script_url || !config.security_key) {
      return Promise.reject(new Error("Credit card checkout is not configured."));
    }
    ipospaysScriptRequest = new Promise((resolve, reject) => {
      const existing = document.getElementById("ftd");
      if (existing) {
        existing.remove();
        delete window.postData;
      }
      const script = document.createElement("script");
      script.id = "ftd";
      script.src = config.ftd_script_url;
      script.defer = true;
      script.setAttribute("security_key", config.security_key);
      script.addEventListener("load", () => {
        if (typeof window.postData === "function") resolve();
        else reject(new Error("Secure card checkout did not initialize."));
      }, { once: true });
      script.addEventListener("error", () => reject(new Error("Could not load secure card checkout.")), { once: true });
      document.head.appendChild(script);
    }).finally(() => {
      ipospaysScriptRequest = null;
    });
    return ipospaysScriptRequest;
  }

  async function submitIpospaysPayment() {
    if (cardOrder && cardOrder.status === "paid") {
      return cardOrder;
    }
    const config = await loadIpospaysConfig();
    if (!config || !config.configured) {
      throw new Error((config && config.message) || "Credit card checkout is not available yet.");
    }
    if (ipospaysPanel && ipospaysPanel.hidden) {
      throw new Error("Select credit card payment before submitting.");
    }
    if (typeof window.postData !== "function") {
      await loadIpospaysScript(config);
    }
    if (typeof window.postData !== "function") {
      throw new Error("Secure card checkout did not initialize.");
    }
    setStatus("Securing your card details...");
    let tokenResponse = null;
    try {
      tokenResponse = await window.postData();
    } catch (error) {
      throw new Error(ipospaysTokenizationError(tokenResponse, error));
    }
    const paymentTokenId = extractIpospaysPaymentToken(tokenResponse);
    if (!paymentTokenId) {
      throw new Error(ipospaysTokenizationError(tokenResponse, null));
    }
    setStatus("Processing credit card payment...");
    const response = await blockvaseFetch("/checkout/ipospays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...checkoutPayload(),
        payment_token_id: paymentTokenId,
      }),
    });
    const data = await response.json();
    if (!data || data.success === false) {
      throw new Error((data && data.message) || "Card payment was not approved.");
    }
    cardOrder = data;
    if (data.user) updateCheckoutAccountUi(data.user);
    completeCardCheckout(data);
    return data;
  }

  async function refreshBitcoinInvoice(showMessage) {
    if (!invoice || !invoice.order_id) return null;
    await syncUnpaidBitcoinOrderDetails({ silent: !showMessage });
    const response = await blockvaseFetch("/checkout/bitcoin/" + encodeURIComponent(invoice.order_id));
    const data = await response.json();
    if (!data || data.success === false) {
      throw new Error((data && data.message) || "Bitcoin invoice status could not be loaded.");
    }
    invoicePollFailures = 0;
    if (bitcoinInvoiceNeedsRefresh(data)) {
      updateInvoiceUi(data);
      updateCheckoutActionButtons();
      return renewExpiredBitcoinInvoice();
    }
    updateInvoiceUi(data);
    if (showMessage) {
      setStatus(invoiceStatusText(data), false, bitcoinShowsConfirmationSpinner(data));
    }
    return data;
  }

  function invoicePollDelayMs() {
    if (!invoice) return INVOICE_POLL_MS;
    if (invoice.status === "seen" || invoice.status === "confirming") return INVOICE_POLL_CONFIRMING_MS;
    return INVOICE_POLL_MS;
  }

  function restartInvoicePolling() {
    if (!invoice || invoice.status === "settled") return;
    startInvoicePolling();
  }

  function startInvoicePolling() {
    stopInvoicePolling();
    const poll = () => {
      if (!invoice || (invoice.status === "expired" && !bitcoinPaymentStarted(invoice))) {
        if (invoice && bitcoinInvoiceNeedsRefresh(invoice)) {
          renewExpiredBitcoinInvoice().catch((error) => {
            setStatus(error.message || "Could not refresh Bitcoin invoice. We will keep retrying automatically.", true);
            startBitcoinPricingRecovery();
          });
        } else {
          stopInvoicePolling();
        }
        return;
      }
      refreshBitcoinInvoice(false).catch(() => {
        invoicePollFailures += 1;
        if (invoicePollFailures >= 3) {
          setStatus("We could not refresh Bitcoin payment status. Keep this page open; we will keep retrying automatically.", true);
        }
      });
      invoicePollTimer = window.setTimeout(poll, invoicePollDelayMs());
    };
    invoicePollTimer = window.setTimeout(poll, invoicePollDelayMs());
  }

  function stopInvoicePolling() {
    if (invoicePollTimer) {
      window.clearTimeout(invoicePollTimer);
      invoicePollTimer = null;
    }
  }

  function showStep(step) {
    if (!steps.includes(step) || !canEnterStep(step)) return;
    currentStep = step;
    const index = steps.indexOf(step);
    stepButtons.forEach((button) => {
      const active = button.dataset.checkoutStepButton === step;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-current", active ? "step" : "false");
    });
    panels.forEach((panel) => {
      const active = panel.dataset.checkoutStep === step;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (prevButton) prevButton.hidden = checkoutCompleted || index === 0;
    updateCheckoutActionButtons();
    if (step === "payment") {
      updatePaymentStepCopy();
      updatePaymentMethodPanels();
    } else {
      stopBitcoinPricingRecovery();
      if (step === "review") {
        ensureCheckoutCompletedUi();
        updateReview();
        if (selectedPaymentMethod() === "bitcoin" && invoice) {
          if (checkoutCompleted || bitcoinPaymentSubmitted(invoice)) {
            setStatus(bitcoinCheckoutCompleteMessage(invoice), false, bitcoinShowsConfirmationSpinner(invoice));
          } else {
            setStatus(invoiceStatusText(invoice), false, bitcoinShowsConfirmationSpinner(invoice));
          }
        } else {
          setStatus(paymentReviewText());
        }
      } else {
        setStatus("");
      }
    }
    updateCheckoutAutofillHints();
  }

  function openCheckoutFromStart() {
    checkoutCompleted = false;
    lastInvoiceUiKey = "";
    invoice = null;
    invoiceCustomerSnapshot = "";
    cardOrder = null;
    setPaymentMethod("");
    stopInvoicePolling();
    stopBitcoinPricingRecovery();
    setCheckoutSubmittedUi(false);
    if (portalTabs?.showTab) portalTabs.showTab("shop");
    if (shopProductCard) shopProductCard.hidden = true;
    checkout.hidden = false;
    showStep("details");
    focusCheckoutDetailsField();
    checkout.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (startButton) {
    startButton.addEventListener("click", openCheckoutFromStart);
  }

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => showStep(button.dataset.checkoutStepButton));
  });

  paymentMethodInputs.forEach((input) => {
    input.addEventListener("change", updatePaymentMethodPanels);
  });

  if (billingDifferentField) {
    billingDifferentField.addEventListener("change", () => {
      updateBillingFields();
      invalidateUnpaidBitcoinInvoice();
      updateReview();
    });
    updateBillingFields();
  }

  updateCheckoutAutofillHints();

  checkoutDataForms().forEach((checkoutDataForm) => {
    checkoutDataForm.addEventListener("input", (event) => {
      if (event.target && event.target.name) {
        invalidateUnpaidBitcoinInvoice();
        updateReview();
      }
    });
    checkoutDataForm.addEventListener("change", (event) => {
      if (event.target && event.target.name) {
        invalidateUnpaidBitcoinInvoice();
        updateReview();
      }
    });
  });

  if (copyBitcoinUriButton) {
    copyBitcoinUriButton.addEventListener("click", async () => {
      if (!bitcoinPaymentUri) return;
      const copied = await copyTextToClipboard(bitcoinPaymentUri, copyBitcoinUriButton);
      setStatus(copied ? "Bitcoin URI copied." : "Could not copy the Bitcoin URI.", !copied);
    });
  }

  onBlockvaseCheckoutAuthChange = updateCheckoutAccountUi;
  blockvaseFetch("/auth/session")
    .then((response) => response.json())
    .then((data) => updateCheckoutAccountUi(data.user || null))
    .catch(() => {});

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      const index = Math.max(0, steps.indexOf(currentStep) - 1);
      showStep(steps[index]);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      const index = Math.min(steps.length - 1, steps.indexOf(currentStep) + 1);
      showStep(steps[index]);
    });
  }

  shippingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (currentStep !== "details") return;
    showStep("payment");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (checkoutSubmitting) return;
    checkoutSubmitting = true;
    if (submitButton) submitButton.disabled = true;
    try {
      if (checkoutCompleted) {
        if (selectedPaymentMethod() === "bitcoin") {
          await refreshBitcoinInvoice(true);
        }
        return;
      }
      if (!invoice) {
        if (selectedPaymentMethod() === "bitcoin") {
          showStep("payment");
          await createBitcoinInvoice();
        } else {
          await submitIpospaysPayment();
        }
        return;
      }
      if (selectedPaymentMethod() === "bitcoin") {
        if (bitcoinInvoiceNeedsRefresh(invoice)) {
          resetBitcoinInvoiceState();
          await createBitcoinInvoice();
          return;
        }
        await refreshBitcoinInvoice(true);
      } else {
        await submitIpospaysPayment();
      }
    } catch (error) {
      if (selectedPaymentMethod() === "ipospays" && !checkoutCompleted) {
        showStep("payment");
        setStatus((error.message || "Card payment was not approved.") + " Update your card details and return to Review to try again.", true);
      } else {
        setStatus(error.message || "Could not check Bitcoin payment status.", true);
      }
    } finally {
      checkoutSubmitting = false;
      updateCheckoutActionButtons();
    }
  });

  blockvaseFetch("/checkout/ipospays/config")
    .then((response) => response.json())
    .then((data) => {
      if (!data) return;
      ipospaysConfig = data;
      updateCheckoutTotals(data);
      const shopPrice = document.querySelector(".portal-shop-price");
      if (shopPrice && data.item_total_cents != null) {
        shopPrice.textContent = formatMoneyFromCents(data.item_total_cents);
      }
      refreshIpospaysUi();
    })
    .catch(() => {});

  updatePaymentMethodPanels();
  checkout.hidden = true;
}

function initBlockvaseOrderPortals(portalTabs) {
  const loginForm = document.querySelector("[data-blockvase-login]");
  const logoutButton = document.querySelector("[data-blockvase-logout]");
  const authForms = document.getElementById("blockvaseAuthForms");
  const accountSession = document.getElementById("blockvaseAccountSession");
  const sessionText = document.getElementById("blockvaseSessionText");
  const accountButton = document.getElementById("blockvaseAccountButton");
  const adminButton = document.getElementById("blockvaseAdminButton");
  const adminIntro = document.getElementById("blockvaseAdminIntro");
  const accountIntro = document.getElementById("blockvaseAccountIntro");
  const ordersStatus = document.getElementById("blockvaseOrdersStatus");
  const adminStatus = document.getElementById("blockvaseAdminStatus");
  const ordersList = document.getElementById("blockvaseOrdersList");
  const adminOrdersList = document.getElementById("blockvaseAdminOrdersList");
  const adminOrderControls = document.getElementById("blockvaseAdminOrderControls");
  const adminOrdersFooter = document.getElementById("blockvaseAdminOrdersFooter");
  const adminOrdersMeta = document.getElementById("blockvaseAdminOrdersMeta");
  const adminLoadMoreButton = document.getElementById("blockvaseAdminLoadMore");
  const affiliatesButton = document.getElementById("blockvaseAffiliatesButton");
  const affiliatesIntro = document.getElementById("blockvaseAffiliatesIntro");
  const affiliatesStatus = document.getElementById("blockvaseAffiliatesStatus");
  const affiliatesList = document.getElementById("blockvaseAffiliatesList");
  const affiliateMetricsEl = document.getElementById("blockvaseAffiliateMetrics");
  const affiliateForm = document.getElementById("blockvaseAffiliateForm");
  let currentUser = null;
  let orderRefreshTimer = null;
  let affiliatesState = [];
  const ORDER_REFRESH_MS = 15000;
  const ADMIN_ORDER_PAGE_SIZE = 20;
  const adminOrderState = {
    orders: [],
    total: 0,
    offset: 0,
    hasMore: false,
    loading: false,
  };

  function setText(el, message, isError) {
    if (!el) return;
    el.textContent = message || "";
    el.classList.toggle("is-error", Boolean(isError));
  }

  function dollars(cents) {
    return "$" + (Number(cents || 0) / 100).toFixed(2);
  }

  function formatBtcFromSats(sats) {
    return (Number(sats || 0) / 100000000).toFixed(8);
  }

  function formatBtcUsdRate(rate) {
    const value = Number(rate);
    if (!Number.isFinite(value) || value <= 0) return null;
    return "$" + value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function orderNeedsPaymentResolution(order) {
    return Boolean(
      order && (
        order.needs_payment_resolution
        || order.payment_resolution === "underpaid"
        || order.payment_resolution === "overpaid"
        || Number(order.overpayment_sats || 0) > 0
        || Number(order.underpayment_sats || 0) > 0
        || order.payment_status === "underpaid"
      )
    );
  }

  function orderPaymentResolutionKind(order) {
    if (!order) return null;
    if (order.payment_resolution === "overpaid" || Number(order.overpayment_sats || 0) > 0) return "overpaid";
    if (order.payment_resolution === "underpaid" || order.payment_status === "underpaid" || Number(order.underpayment_sats || 0) > 0) {
      return "underpaid";
    }
    return null;
  }

  function orderPaymentResolutionHtml(order, opts) {
    if (!orderNeedsPaymentResolution(order)) return "";
    const kind = orderPaymentResolutionKind(order);
    if (!kind || (!opts?.admin && kind !== "underpaid")) return "";
    const invoiceSats = Number(order.payment && order.payment.btc_amount_sats || 0);
    const requiredSats = Number(order.current_required_sats || (order.payment && order.payment.current_required_sats) || invoiceSats);
    const receivedSats = Number(order.payment && order.payment.amount_received_sats || 0);
    if (kind === "underpaid") {
      const shortSats = Number(order.underpayment_sats || (order.payment && order.payment.underpayment_sats) || Math.max(0, requiredSats - receivedSats));
      const address = String(order.payment && order.payment.btc_address || "").trim();
      const action = opts?.admin
        ? "Contact the customer for the remaining balance or cancel the order."
        : "Send the remaining balance to the same Bitcoin address to complete your order.";
      return (
        '<p class="portal-bitcoin-problem-note portal-bitcoin-problem-note--underpaid portal-order-resolution-note" role="status">' +
        "<strong>" + (opts?.admin ? "Underpayment — do not fulfill yet." : "Additional Bitcoin payment needed.") + "</strong> " +
        "Invoice amount " + escapeHtml(formatBtcFromSats(requiredSats)) + " BTC · received " + escapeHtml(formatBtcFromSats(receivedSats)) + " BTC · short " + escapeHtml(formatBtcFromSats(shortSats)) + " BTC." + (address ? " Address " + escapeHtml(address) + "." : "") + " " + action +
        "</p>"
      );
    }
    const overpaymentSats = Number(order.overpayment_sats || (order.payment && order.payment.overpayment_sats) || Math.max(0, receivedSats - requiredSats));
    return (
      '<p class="portal-bitcoin-problem-note portal-bitcoin-problem-note--overpaid portal-order-resolution-note" role="status">' +
      "<strong>Overpayment — manual resolution required.</strong> " +
      "Invoice amount " + escapeHtml(formatBtcFromSats(requiredSats)) + " BTC · received " + escapeHtml(formatBtcFromSats(receivedSats)) + " BTC · excess " + escapeHtml(formatBtcFromSats(overpaymentSats)) + " BTC. Refund the excess or contact the customer before shipping." +
      "</p>"
    );
  }

  function formatPaymentStatus(status) {
    if (status === "seen" || status === "confirming" || status === "awaiting confirmation") return "awaiting confirmation";
    if (status === "settled" || status === "paid") return "paid";
    if (status === "payment_failed" || status === "payment failed") return "payment failed";
    if (status === "underpaid") return "underpaid";
    return status || "pending";
  }

  function paymentStatusIsPendingConfirmation(status) {
    return status === "pending"
      || status === "seen"
      || status === "confirming"
      || status === "awaiting confirmation";
  }

  function paymentStatusDisplayHtml(order, opts) {
    const label = formatPaymentStatus(order.payment_status);
    const showSpinner = order.payment_method === "bitcoin" && paymentStatusIsPendingConfirmation(order.payment_status);
    const isProblem = order.payment_status === "underpaid" || order.payment_status === "payment failed";
    if (showSpinner) {
      return (
        '<span class="portal-status-with-spinner">' +
        '<span class="portal-inline-spinner" aria-hidden="true"></span>' +
        "<span>" + escapeHtml(label) + "</span></span>"
      );
    }
    if (opts && opts.admin && isProblem) {
      return '<span class="portal-payment-status--problem">' + escapeHtml(label) + "</span>";
    }
    return escapeHtml(label);
  }

  function orderStatusSummaryHtml(order, opts) {
    const fulfillment = escapeHtml(order.fulfillment_status || "pending");
    return (
      '<div class="portal-review-payment-row"><span>Payment</span><strong>' + paymentStatusDisplayHtml(order, opts) + "</strong></div>" +
      '<div class="portal-review-payment-row"><span>Fulfillment</span><strong>' + fulfillment + "</strong></div>"
    );
  }

  function orderItemsHtml(order, opts) {
    const items = Array.isArray(order.items) && order.items.length
      ? order.items
      : [{
          name: order.product_name || "Blockvase device",
          quantity: 1,
          line_total_cents: order.item_total_cents != null ? order.item_total_cents : order.total_cents,
        }];
    return (
      '<div class="portal-order-summary portal-order-items">' +
      items.map((item) => (
        '<div><span>' + escapeHtml(item.name) + (Number(item.quantity || 1) > 1 ? " × " + Number(item.quantity) : "") + '</span><strong>' + dollars(item.line_total_cents) + '</strong></div>'
      )).join("") +
      '<div class="portal-order-total"><span>Total</span><strong>' + dollars(order.total_cents) + '</strong></div>' +
      orderStatusSummaryHtml(order, opts) +
      '</div>'
    );
  }

  function formatOrderDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function orderTitle(order) {
    return "Order " + String(order.id || "").slice(0, 8);
  }

  function shippingFields(order) {
    const c = order.customer || {};
    return [
      ["first_name", "First name", c.first_name],
      ["last_name", "Last name", c.last_name],
      ["email", "Email", c.email],
      ["phone", "Phone", c.phone],
      ["address", "Address", c.address],
      ["city", "City", c.city],
      ["state", "State", c.state],
      ["postal_code", "ZIP", c.postal_code],
    ];
  }

  function orderCancelControls(order, opts) {
    if (opts && opts.admin) {
      if (order.fulfillment_status === "cancelled" || ["cancelled", "refunded", "refund_pending"].includes(order.payment_status)) {
        return "";
      }
      return '<div class="portal-order-cancel-row"><button class="btn secondary" type="button" data-cancel-order data-admin-cancel-order>Cancel &amp; refund order</button></div>';
    }
    if (order.cancellable) {
      return '<div class="portal-order-cancel-row"><button class="btn secondary" type="button" data-cancel-order>Cancel &amp; refund order</button></div>';
    }
    if (order.payment_status === "refund_pending") {
      return '<p class="muted-note portal-order-cancel-note">Cancellation requested. Your refund is being processed.</p>';
    }
    if (order.payment_status === "refunded" || order.fulfillment_status === "cancelled") {
      return '<p class="muted-note portal-order-cancel-note">This order was cancelled.</p>';
    }
    return "";
  }

  function orderShippingSnapshot(form, opts) {
    const fd = new FormData(form);
    const snapshot = Object.fromEntries(
      shippingFields({ customer: {} }).map(([name]) => [name, String(fd.get(name) || "").trim()])
    );
    if (opts && opts.admin) {
      snapshot.fulfillment_status = String(fd.get("fulfillment_status") || "pending");
      snapshot.tracking_number = String(fd.get("tracking_number") || "").trim();
    }
    return snapshot;
  }

  function orderShippingSnapshotJson(form, opts) {
    return JSON.stringify(orderShippingSnapshot(form, opts));
  }

  function bindOrderShippingFormState(form, opts) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    const originalSnapshot = orderShippingSnapshotJson(form, opts);
    form.dataset.originalSnapshot = originalSnapshot;
    const syncSubmitState = () => {
      submitButton.disabled = form.dataset.submitting === "true" || orderShippingSnapshotJson(form, opts) === originalSnapshot;
    };
    syncSubmitState();
    form.addEventListener("input", syncSubmitState);
    form.addEventListener("change", syncSubmitState);
  }

  function renderOrderCard(order, opts) {
    opts = opts || {};
    const editable = Boolean(opts.admin || order.shipping_editable);
    const resolutionKind = orderPaymentResolutionKind(order);
    const fields = shippingFields(order).map(([name, label, value]) => {
      const immutableEmail = name === "email";
      const disabledAttr = editable ? "" : " disabled";
      const readonlyAttr = immutableEmail ? ' readonly aria-readonly="true"' : "";
      return '<label>' + label + '<input name="' + name + '" value="' + escapeHtml(value || "") + '"' + disabledAttr + readonlyAttr + "></label>";
    }).join("");
    const blockFulfillment = opts.admin && resolutionKind && order.payment_method === "bitcoin";
    const adminControls = opts.admin ? (
      '<div class="portal-order-admin-controls">' +
      '<label>Status<select name="fulfillment_status">' +
      (order.fulfillment_status === "cancelled" ? ["cancelled"] : ["pending", "processing", "shipped"]).map((s) => '<option value="' + s + '"' + (order.fulfillment_status === s ? " selected" : "") + (s === "cancelled" || (blockFulfillment && (s === "processing" || s === "shipped")) ? " disabled" : "") + ">" + s + "</option>").join("") +
      '</select></label>' +
      '<label>Tracking<input name="tracking_number" value="' + escapeHtml(order.tracking_number || "") + '"></label>' +
      '</div>'
    ) : "";
    const resolutionBanner = orderPaymentResolutionHtml(order, opts);
    const cardClass = "metric-board metric-board--dense portal-order-card";
    return (
      '<article class="' + cardClass + '" data-order-id="' + escapeHtml(order.id) + '">' +
      '<div class="portal-order-card__head">' +
      '<h3 class="metric-board-title">' + escapeHtml(orderTitle(order)) + '</h3>' +
      '<p class="muted-note portal-order-card__meta">' + escapeHtml(formatOrderDate(order.created_at)) + '</p>' +
      '</div>' +
      resolutionBanner +
      orderItemsHtml(order, opts) +
      orderCancelControls(order, opts) +
      '<details class="portal-order-shipping-accordion">' +
      '<summary>' + escapeHtml(opts.admin ? "Shipping & fulfillment" : "Shipping details") + '</summary>' +
      '<div class="portal-order-shipping-accordion__body">' +
      '<form class="portal-order-shipping-form">' +
      '<div class="portal-checkout-grid">' + fields + '</div>' +
      adminControls +
      '<div class="portal-checkout-actions">' +
      (editable ? '<button class="btn secondary" type="submit" data-order-shipping-submit disabled>' + (opts.admin ? "Update order" : "Update shipping") + '</button>' : '<span class="muted-note">Shipping locked after shipment.</span>') +
      '</div></form></div></details></article>'
    );
  }

  function renderOrders(target, orders, opts) {
    if (!target) return;
    if (!orders || !orders.length) {
      target.innerHTML = '<p class="muted-note">No orders yet.</p>';
      return;
    }
    target.innerHTML = orders.map((order) => renderOrderCard(order, opts)).join("");
    target.querySelectorAll(".portal-order-shipping-accordion").forEach((accordion) => {
      const syncShippingActions = () => {
        const actions = accordion.querySelector(".portal-checkout-actions");
        if (actions) actions.hidden = !accordion.open;
      };
      syncShippingActions();
      accordion.addEventListener("toggle", syncShippingActions);
    });
    target.querySelectorAll("[data-cancel-order]").forEach((button) => {
      button.addEventListener("click", async () => {
        const card = button.closest("[data-order-id]");
        const orderId = card?.dataset.orderId;
        if (!orderId) return;
        if (!window.confirm("Cancel this order and refund the payment when applicable?")) return;
        const adminCancel = button.hasAttribute("data-admin-cancel-order");
        button.disabled = true;
        try {
          const response = await blockvaseFetch((adminCancel ? "/admin/orders/" : "/orders/") + encodeURIComponent(orderId) + "/cancel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}",
          });
          const data = await response.json();
          if (!data.success) throw new Error(data.message || "Could not cancel order.");
          setText(adminCancel ? adminStatus : ordersStatus, data.message || "Order cancelled.");
          if (adminCancel) await loadAdminOrders({ preserveLoaded: true });
          else await loadOrders();
        } catch (error) {
          setText(adminCancel ? adminStatus : ordersStatus, error.message, true);
          button.disabled = false;
        }
      });
    });
    target.querySelectorAll(".portal-order-shipping-form").forEach((form) => {
      bindOrderShippingFormState(form, opts);
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (form.dataset.submitting === "true") return;
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton?.disabled) return;
        form.dataset.submitting = "true";
        if (submitButton) submitButton.disabled = true;
        const card = form.closest("[data-order-id]");
        const orderId = card?.dataset.orderId;
        const fd = new FormData(form);
        const customer = Object.fromEntries(shippingFields({ customer: {} }).map(([name]) => [name, String(fd.get(name) || "").trim()]));
        try {
          if (opts && opts.admin) {
            const payload = {
              customer,
              fulfillment_status: String(fd.get("fulfillment_status") || "pending"),
              tracking_number: String(fd.get("tracking_number") || ""),
            };
            const response = await blockvaseFetch("/admin/orders/" + encodeURIComponent(orderId), {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || "Could not update order.");
            setText(adminStatus, "Order updated.");
            await loadAdminOrders({ preserveLoaded: true });
          } else {
            const response = await blockvaseFetch("/orders/" + encodeURIComponent(orderId) + "/shipping", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(customer),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || "Could not update shipping.");
            setText(ordersStatus, "Shipping updated.");
            await loadOrders();
          }
        } catch (error) {
          setText(opts && opts.admin ? adminStatus : ordersStatus, error.message, true);
        } finally {
          form.dataset.submitting = "";
          if (submitButton) submitButton.disabled = orderShippingSnapshotJson(form, opts) === form.dataset.originalSnapshot;
        }
      });
    });
  }

  function updatePortalAuthUi() {
    if (accountButton) {
      accountButton.textContent = currentUser ? "Account" : "Sign in";
    }
    if (adminButton) {
      adminButton.hidden = !currentUser?.is_admin;
    }
    if (affiliatesButton) {
      affiliatesButton.hidden = !currentUser?.is_admin;
    }
    if (accountIntro) {
      if (!currentUser) {
        accountIntro.textContent = "Sign in with the email and password you set at checkout. Accounts are created when you purchase.";
      } else if (currentUser.is_admin) {
        accountIntro.textContent = "You are signed in as an admin. Use the Admin tab to manage orders.";
      } else {
        accountIntro.textContent = "View your orders and update shipping details until an order is marked shipped.";
      }
    }
    if (sessionText) {
      sessionText.textContent = currentUser ? blockvaseAccountSessionText(currentUser) : "";
    }
    if (adminIntro && currentUser?.is_admin) {
      const email = blockvaseUserLabel(currentUser);
      adminIntro.textContent = email
        ? "Signed in as " + email + ". Manage Blockvase orders, fulfillment status, and tracking."
        : "Manage Blockvase orders, fulfillment status, and tracking.";
    }
    if (!currentUser?.is_admin && portalTabs?.showTab && ["admin", "affiliates"].includes(window.location.hash.replace("#", ""))) {
      portalTabs.showTab("viewer");
    }
  }

  async function refreshSession() {
    const response = await blockvaseFetch("/auth/session");
    const data = await response.json();
    currentUser = data.user || null;
    if (authForms) authForms.hidden = Boolean(currentUser);
    if (accountSession) accountSession.hidden = !currentUser;
    updatePortalAuthUi();
    if (onBlockvaseCheckoutAuthChange) onBlockvaseCheckoutAuthChange(currentUser);
    const hash = window.location.hash.replace("#", "");
    if (portalTabs?.showTab) {
      if (hash === "admin" && currentUser?.is_admin) portalTabs.showTab("admin");
      else if (hash === "affiliates" && currentUser?.is_admin) portalTabs.showTab("affiliates");
      else if (hash === "account") portalTabs.showTab("account");
    }
    if (currentUser && !currentUser.is_admin) {
      try {
        await loadOrders();
      } catch (error) {
        setText(ordersStatus, error.message || "Could not load orders.", true);
      }
    }
    if (currentUser?.is_admin) {
      try {
        await loadAdminOrders();
      } catch (error) {
        setText(adminStatus, error.message || "Could not load admin orders.", true);
      }
      try {
        await loadAffiliates();
      } catch (error) {
        setText(affiliatesStatus, error.message || "Could not load affiliates.", true);
      }
    }
    return currentUser;
  }

  async function loadOrders() {
    if (!currentUser || currentUser.is_admin) return;
    const response = await blockvaseFetch("/orders");
    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Could not load orders.");
    renderOrders(ordersList, data.orders, { admin: false });
  }

  function adminOrderParams(offset, limit) {
    const params = new URLSearchParams();
    const form = adminOrderControls ? new FormData(adminOrderControls) : null;
    const add = (name, fallback) => {
      const value = String((form && form.get(name)) || fallback || "").trim();
      if (value && value !== "all") params.set(name, value);
    };
    add("q", "");
    add("payment_status", "all");
    add("fulfillment_status", "all");
    add("payment_method", "all");
    add("resolution", "all");
    add("sort", "created_at");
    add("direction", "desc");
    params.set("limit", String(Math.max(1, Math.min(100, Number(limit || ADMIN_ORDER_PAGE_SIZE)))));
    params.set("offset", String(Math.max(0, Number(offset || 0))));
    return params;
  }

  function updateAdminOrdersFooter() {
    if (!adminOrdersFooter) return;
    const count = adminOrderState.orders.length;
    adminOrdersFooter.hidden = adminOrderState.total <= 0 && count <= 0;
    if (adminOrdersMeta) {
      adminOrdersMeta.textContent = adminOrderState.total
        ? "Showing " + count + " of " + adminOrderState.total + " orders."
        : "";
    }
    if (adminLoadMoreButton) {
      adminLoadMoreButton.hidden = !adminOrderState.hasMore;
      adminLoadMoreButton.disabled = adminOrderState.loading;
      adminLoadMoreButton.textContent = adminOrderState.loading ? "Loading..." : "Load more orders";
    }
  }

  async function loadAdminOrders(opts) {
    opts = opts || {};
    if (!currentUser?.is_admin || adminOrderState.loading) return;
    const append = Boolean(opts.append);
    const preserveLoaded = Boolean(opts.preserveLoaded);
    const offset = append ? adminOrderState.orders.length : 0;
    const limit = preserveLoaded && adminOrderState.orders.length > ADMIN_ORDER_PAGE_SIZE
      ? adminOrderState.orders.length
      : ADMIN_ORDER_PAGE_SIZE;
    adminOrderState.loading = true;
    updateAdminOrdersFooter();
    try {
      const response = await blockvaseFetch("/admin/orders?" + adminOrderParams(offset, limit).toString());
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Could not load admin orders.");
      const orders = Array.isArray(data.orders) ? data.orders : [];
      adminOrderState.orders = append ? adminOrderState.orders.concat(orders) : orders;
      adminOrderState.total = Number(data.total || adminOrderState.orders.length || 0);
      adminOrderState.offset = Number(data.offset || 0);
      adminOrderState.hasMore = Boolean(data.has_more);
      renderOrders(adminOrdersList, adminOrderState.orders, { admin: true });
    } finally {
      adminOrderState.loading = false;
      updateAdminOrdersFooter();
    }
  }

  function renderAffiliateMetrics(affiliates) {
    if (!affiliateMetricsEl) return;
    if (!affiliates || !affiliates.length) {
      affiliateMetricsEl.innerHTML = "";
      return;
    }
    const totals = affiliates.reduce((acc, affiliate) => {
      const metrics = affiliate.metrics || {};
      acc.clicks += Number(metrics.click_count || 0);
      acc.attributed += Number(metrics.attributed_orders || 0);
      acc.grossSalesCents += Number(metrics.gross_sales_cents || 0);
      acc.earnedCommissionCents += Number(metrics.earned_commission_cents || 0);
      return acc;
    }, { clicks: 0, attributed: 0, grossSalesCents: 0, earnedCommissionCents: 0 });
    affiliateMetricsEl.innerHTML = (
      '<div class="portal-affiliate-metric"><span>Affiliates</span><strong>' + affiliates.length.toLocaleString() + '</strong></div>' +
      '<div class="portal-affiliate-metric"><span>Clicks</span><strong>' + totals.clicks.toLocaleString() + '</strong></div>' +
      '<div class="portal-affiliate-metric"><span>Attributed orders</span><strong>' + totals.attributed.toLocaleString() + '</strong></div>' +
      '<div class="portal-affiliate-metric"><span>Gross sales</span><strong>' + escapeHtml(dollars(totals.grossSalesCents)) + '</strong></div>' +
      '<div class="portal-affiliate-metric"><span>Earned commission</span><strong>' + escapeHtml(dollars(totals.earnedCommissionCents)) + '</strong></div>'
    );
  }

  function renderAffiliateOrders(orders) {
    if (!orders || !orders.length) return '<p class="muted-note">No attributed orders yet.</p>';
    return (
      '<div class="portal-affiliate-orders">' +
      orders.map((order) => (
        '<div class="portal-order-summary portal-affiliate-order-summary">' +
        '<div><span>' + escapeHtml(formatOrderDate(order.created_at)) + '</span><strong>' + escapeHtml(dollars(order.total_cents)) + '</strong></div>' +
        '<div><span>' + escapeHtml(order.customer_name || order.customer_email || "Unknown customer") + '</span><strong>' + escapeHtml(order.payment_method === "bitcoin" ? "Bitcoin" : "Credit card") + '</strong></div>' +
        '<div><span>' + escapeHtml(order.payment_status || order.raw_status || "pending") + '</span><strong>' + escapeHtml(order.commission_earned ? dollars(order.commission_cents) : "$0.00 pending") + '</strong></div>' +
        '</div>'
      )).join("") +
      '</div>'
    );
  }

  function fillAffiliateForm(affiliate) {
    if (!affiliateForm || !affiliate) return;
    const setValue = (name, value) => {
      const field = affiliateForm.querySelector('[name="' + name + '"]');
      if (field) field.value = value;
    };
    setValue("affiliate_id", affiliate.id || "");
    setValue("name", affiliate.name || "");
    setValue("email", affiliate.email || "");
    setValue("code", affiliate.code || "");
    setValue("commission_dollars", (Number(affiliate.commission_cents || 0) / 100).toFixed(2));
    setValue("is_active", affiliate.is_active ? "true" : "false");
    affiliateForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function wireAffiliateCards() {
    if (!affiliatesList) return;
    affiliatesList.querySelectorAll("[data-edit-affiliate]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest("[data-affiliate-id]");
        const affiliateId = card?.dataset.affiliateId;
        const affiliate = affiliatesState.find((a) => String(a.id) === affiliateId);
        fillAffiliateForm(affiliate);
      });
    });
    affiliatesList.querySelectorAll("[data-copy-affiliate-link]").forEach((button) => {
      button.addEventListener("click", async () => {
        const card = button.closest("[data-affiliate-id]");
        const affiliateId = card?.dataset.affiliateId;
        const affiliate = affiliatesState.find((a) => String(a.id) === affiliateId);
        if (!affiliate || !affiliate.link) return;
        try {
          await navigator.clipboard.writeText(affiliate.link);
          setText(affiliatesStatus, "Affiliate link copied.");
        } catch (error) {
          setText(affiliatesStatus, "Could not copy the affiliate link.", true);
        }
      });
    });
    affiliatesList.querySelectorAll("[data-affiliate-orders]").forEach((container) => {
      const details = container.closest("details");
      const card = container.closest("[data-affiliate-id]");
      const affiliateId = card?.dataset.affiliateId;
      if (!details || !affiliateId) return;
      details.addEventListener("toggle", async () => {
        if (!details.open || details.dataset.loaded === "true") return;
        details.dataset.loaded = "true";
        try {
          const response = await blockvaseFetch("/admin/affiliates/" + encodeURIComponent(affiliateId) + "/orders");
          const data = await response.json();
          if (!data.success) throw new Error(data.message || "Could not load orders.");
          container.innerHTML = renderAffiliateOrders(data.orders);
        } catch (error) {
          details.dataset.loaded = "";
          container.innerHTML = '<p class="muted-note">' + escapeHtml(error.message || "Could not load attributed orders.") + '</p>';
        }
      });
    });
  }

  function renderAffiliates(affiliates) {
    if (!affiliatesList) return;
    if (!affiliates || !affiliates.length) {
      affiliatesList.innerHTML = '<p class="muted-note">No affiliates yet. Create one above to generate a reseller link.</p>';
      return;
    }
    affiliatesList.innerHTML = affiliates.map((affiliate) => {
      const metrics = affiliate.metrics || {};
      return (
        '<article class="metric-board metric-board--dense portal-order-card portal-affiliate-card" data-affiliate-id="' + escapeHtml(affiliate.id) + '">' +
        '<div class="portal-order-card__head portal-affiliate-card__head">' +
        '<div class="portal-affiliate-card__heading">' +
        '<h3 class="metric-board-title">' + escapeHtml(affiliate.name) + '</h3>' +
        '<p class="muted-note portal-order-card__meta">' + escapeHtml(affiliate.email || "No email") + " · " + (affiliate.is_active ? "Active" : "Inactive") + '</p>' +
        '</div>' +
        '<div class="portal-affiliate-actions">' +
        '<button class="btn secondary" type="button" data-edit-affiliate>Edit</button>' +
        '<button class="btn secondary" type="button" data-copy-affiliate-link>Copy link</button>' +
        '</div></div>' +
        '<div class="portal-order-summary portal-order-items">' +
        '<div><span>Code</span><strong>' + escapeHtml(affiliate.code) + '</strong></div>' +
        '<div><span>Commission</span><strong>' + escapeHtml(dollars(affiliate.commission_cents)) + ' / sale</strong></div>' +
        '<div><span>Clicks</span><strong>' + Number(metrics.click_count || 0).toLocaleString() + '</strong></div>' +
        '<div><span>Paid sales</span><strong>' + Number(metrics.earned_orders || 0).toLocaleString() + '</strong></div>' +
        '<div class="portal-order-total"><span>Earned</span><strong>' + escapeHtml(dollars(metrics.earned_commission_cents)) + '</strong></div>' +
        '</div>' +
        '<p class="muted-note portal-affiliate-link">' + escapeHtml(affiliate.link || "") + '</p>' +
        '<details class="portal-order-shipping-accordion">' +
        '<summary>Attributed orders</summary>' +
        '<div class="portal-order-shipping-accordion__body" data-affiliate-orders><p class="muted-note">Open to load orders...</p></div>' +
        '</details>' +
        '</article>'
      );
    }).join("");
    wireAffiliateCards();
  }

  async function loadAffiliates() {
    if (!currentUser?.is_admin) return;
    const response = await blockvaseFetch("/admin/affiliates");
    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Could not load affiliates.");
    affiliatesState = Array.isArray(data.affiliates) ? data.affiliates : [];
    renderAffiliateMetrics(affiliatesState);
    renderAffiliates(affiliatesState);
  }

  function currentPortalHash() {
    return window.location.hash.replace("#", "");
  }

  function orderFormActive() {
    return Boolean(document.querySelector(".portal-order-shipping-accordion[open]"));
  }

  async function refreshVisibleOrders() {
    if (!currentUser || document.hidden) return;
    if (orderFormActive()) return;
    const hash = currentPortalHash();
    if (currentUser.is_admin && hash === "admin") {
      await loadAdminOrders({ preserveLoaded: true });
    } else if (currentUser.is_admin && hash === "affiliates") {
      await loadAffiliates();
    } else if (!currentUser.is_admin && hash === "account") {
      await loadOrders();
    }
  }

  function startOrderRefreshPolling() {
    if (orderRefreshTimer) window.clearInterval(orderRefreshTimer);
    orderRefreshTimer = window.setInterval(() => {
      refreshVisibleOrders().catch(() => {});
    }, ORDER_REFRESH_MS);
  }

  function resetAdminOrderState() {
    adminOrderState.orders = [];
    adminOrderState.total = 0;
    adminOrderState.offset = 0;
    adminOrderState.hasMore = false;
    adminOrderState.loading = false;
    updateAdminOrdersFooter();
  }

  async function authSubmit(form, endpoint, statusEl) {
    const fd = new FormData(form);
    const payload = Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, String(v).trim()]));
    const response = await blockvaseFetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Authentication failed.");
    currentUser = data.user || null;
    setText(statusEl, "");
    await refreshSession();
    if (portalTabs?.showTab) {
      portalTabs.showTab(currentUser?.is_admin ? "admin" : "account");
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      try { await authSubmit(loginForm, "/auth/login", ordersStatus); }
      catch (error) { setText(ordersStatus, error.message, true); }
    });
  }
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await blockvaseFetch("/auth/logout", { method: "POST" });
      currentUser = null;
      if (ordersList) ordersList.innerHTML = "";
      if (adminOrdersList) adminOrdersList.innerHTML = "";
      if (affiliatesList) affiliatesList.innerHTML = "";
      if (affiliateMetricsEl) affiliateMetricsEl.innerHTML = "";
      affiliatesState = [];
      resetAdminOrderState();
      await refreshSession();
      if (portalTabs?.showTab && ["admin", "affiliates"].includes(window.location.hash.replace("#", ""))) {
        portalTabs.showTab("viewer");
      }
    });
  }
  if (accountButton && portalTabs?.showTab) {
    accountButton.addEventListener("click", () => portalTabs.showTab("account"));
  }
  if (adminButton && portalTabs?.showTab) {
    adminButton.addEventListener("click", () => portalTabs.showTab("admin"));
  }
  if (affiliatesButton && portalTabs?.showTab) {
    affiliatesButton.addEventListener("click", () => portalTabs.showTab("affiliates"));
  }
  if (affiliateForm) {
    affiliateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fd = new FormData(affiliateForm);
      const affiliateId = String(fd.get("affiliate_id") || "").trim();
      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        code: String(fd.get("code") || "").trim(),
        commission_cents: Math.round(Number(fd.get("commission_dollars") || 0) * 100),
        is_active: fd.get("is_active") === "true",
      };
      const submitButton = affiliateForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      try {
        const response = await blockvaseFetch(
          affiliateId ? "/admin/affiliates/" + encodeURIComponent(affiliateId) : "/admin/affiliates",
          {
            method: affiliateId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message || "Could not save affiliate.");
        setText(affiliatesStatus, affiliateId ? "Affiliate updated." : "Affiliate created.");
        affiliateForm.reset();
        await loadAffiliates();
      } catch (error) {
        setText(affiliatesStatus, error.message, true);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
    affiliateForm.addEventListener("reset", () => {
      window.setTimeout(() => {
        const idField = affiliateForm.querySelector('[name="affiliate_id"]');
        if (idField) idField.value = "";
      }, 0);
    });
  }
  if (adminOrderControls) {
    let adminSearchTimer = null;
    const reloadAdminOrders = () => {
      if (!currentUser?.is_admin) return;
      resetAdminOrderState();
      loadAdminOrders().catch((error) => {
        setText(adminStatus, error.message || "Could not load admin orders.", true);
      });
    };
    adminOrderControls.addEventListener("submit", (event) => {
      event.preventDefault();
      reloadAdminOrders();
    });
    adminOrderControls.addEventListener("reset", () => {
      window.setTimeout(reloadAdminOrders, 0);
    });
    adminOrderControls.querySelectorAll("select").forEach((select) => {
      select.addEventListener("change", reloadAdminOrders);
    });
    const searchInput = adminOrderControls.querySelector('input[name="q"]');
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        if (adminSearchTimer) window.clearTimeout(adminSearchTimer);
        adminSearchTimer = window.setTimeout(reloadAdminOrders, 350);
      });
    }
  }
  if (adminLoadMoreButton) {
    adminLoadMoreButton.addEventListener("click", () => {
      loadAdminOrders({ append: true }).catch((error) => {
        setText(adminStatus, error.message || "Could not load more orders.", true);
      });
    });
  }
  window.addEventListener("hashchange", () => {
    const hash = currentPortalHash();
    const tabName = hash === "orders" ? "account" : hash;
    if (portalTabs?.showTab && tabName) portalTabs.showTab(tabName);
    refreshVisibleOrders().catch(() => {});
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshVisibleOrders().catch(() => {});
  });
  startOrderRefreshPolling();
  refreshSession().catch((error) => {
    setText(ordersStatus, error.message || "Could not load account.", true);
  });
}

function fmtSats(btc) {
  return Math.round((btc || 0) * 1e8).toLocaleString();
}

function scriptTypeLabel(type) {
  const labels = {
    pubkeyhash: "P2PKH",
    scripthash: "P2SH",
    witness_v0_keyhash: "P2WPKH",
    witness_v0_scripthash: "P2WSH",
    witness_v1_taproot: "P2TR",
    pubkey: "Pay to public key",
    multisig: "Multisig",
    nulldata: "OP_RETURN",
    nonstandard: "Nonstandard",
    witness_unknown: "Unknown witness",
    anchor: "Anchor",
  };
  const key = String(type || "").trim();
  return labels[key] || key;
}

function inputIoNode(inp, i) {
  if (inp.coinbase) {
    return { kind: "Coinbase", details: "Newly created coins", value: null };
  }
  const prev = inp.prevout || {};
  const spk = prev.scriptPubKey || {};
  const scriptLabel = scriptTypeLabel(spk.type);
  const val = prev.value != null ? fmtSats(prev.value) : null;
  if (spk.address) {
    return {
      kind: scriptLabel ? "Address (" + scriptLabel + ")" : "Address",
      details: spk.address,
      value: val,
    };
  }
  if (spk.desc) {
    return { kind: "Script descriptor", details: spk.desc, value: val };
  }
  if (inp.txid) {
    return {
      kind: "Previous output",
      details: String(inp.txid) + ":" + (inp.vout ?? ""),
      value: val,
    };
  }
  return { kind: "Input", details: "Input " + (i + 1), value: val };
}

function outputIoNode(out, i) {
  const spk = out.scriptPubKey || {};
  const scriptLabel = scriptTypeLabel(spk.type);
  const val = out.value != null ? fmtSats(out.value) : null;
  if (spk.address) {
    return {
      kind: scriptLabel ? "Address (" + scriptLabel + ")" : "Address",
      details: spk.address,
      value: val,
    };
  }
  if (spk.type === "pubkey" || scriptLabel === "Pay to public key") {
    return {
      kind: "Pay to public key",
      details: spk.hex || spk.asm || "No address (P2PK)",
      value: val,
    };
  }
  if (spk.desc) {
    return { kind: scriptLabel || "Script descriptor", details: spk.desc, value: val };
  }
  return {
    kind: scriptLabel || "Output",
    details: (spk.type || "Output") + " " + (i + 1),
    value: val,
  };
}

const TX_FLOW_COLORS_DEFAULT = [
  "#f7931a", "#f59e0b", "#ea580c", "#d97706", "#b45309",
  "#92400e", "#78350f", "#fbbf24", "#fcd34d", "#fde68a",
];
const TX_FLOW_COLORS_OCEAN = [
  "#0ea5e9", "#06b6d4", "#22d3ee", "#2dd4bf", "#34d399",
  "#14b8a6", "#0d9488", "#0891b2", "#0284c7", "#0c4a6e",
  "#155e75", "#164e63", "#5eead4", "#67e8f9", "#99f6e4",
];
const TX_FLOW_COLORS_BW_BLACK = [
  "#ffffff", "#e8e8e8", "#cfcfcf", "#b3b3b3", "#969696",
  "#7a7a7a", "#d9d9d9", "#f5f5f5", "#a6a6a6", "#ececec",
];
const TX_FLOW_COLORS_BW_WHITE = [
  "#111111", "#2a2a2a", "#444444", "#1a1a1a", "#000000",
  "#3a3a3a", "#222222", "#4a4a4a", "#333333", "#141414",
];

const TX_FLOW_COLORS_BW_GLOW = [
  "#f7931a", "#e07b10", "#c96a0c", "#f5b056", "#a85a12",
  "#d9892a", "#f0a040", "#8a4a10", "#ffc878", "#b86a18",
];

function txFlowPalette() {
  const bw = currentBwMode();
  if (bw === "white") return TX_FLOW_COLORS_BW_WHITE;
  if (bw === "black") return TX_FLOW_COLORS_BW_BLACK;
  if (bw === "glow") return TX_FLOW_COLORS_BW_GLOW;
  return document.body.dataset.theme === "ocean" ? TX_FLOW_COLORS_OCEAN : TX_FLOW_COLORS_DEFAULT;
}

function txFlowHash(value) {
  const s = String(value || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return (h >>> 0) % 10007;
}

function txFlowSats(node) {
  if (!node || node.value == null) return 0;
  const n = parseInt(String(node.value).replace(/,/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function txFlowWeight(sats, maxSats) {
  if (!maxSats || sats <= 0) return 0.16;
  return 0.16 + Math.sqrt(sats / maxSats) * 0.84;
}

function txTableCell(display, copyValue, row, col, opts) {
  opts = opts || {};
  let cls = "tx-table-cell";
  if (opts.mono) cls += " tx-table-cell--mono";
  if (opts.num) cls += " tx-table-cell--num";
  if (opts.action) cls += " tx-table-cell--action";
  const copy = copyValue != null && copyValue !== "" ? String(copyValue) : String(display ?? "N/A");
  const action = opts.action ? ' data-action="' + escapeHtml(opts.action) + '"' : "";
  return (
    "<td class=\"" +
    cls +
    '" tabindex="0" data-row="' +
    row +
    '" data-col="' +
    col +
    '" data-copy="' +
    escapeHtml(copy) +
    '"' +
    action +
    ">" +
    escapeHtml(String(display ?? "N/A")) +
    "</td>"
  );
}

function sumIoSats(nodes) {
  return nodes.reduce(function (sum, n) {
    if (n.value == null) return sum;
    const v = parseInt(String(n.value).replace(/,/g, ""), 10);
    return sum + (Number.isFinite(v) ? v : 0);
  }, 0);
}

function renderTxFlowNode(node, side, index, maxSats, palette) {
  const sats = txFlowSats(node);
  const weight = txFlowWeight(sats, maxSats);
  const color = palette[txFlowHash(node.details || node.kind || side + index) % palette.length];
  const stroke = (0.7 + weight * 2.1).toFixed(2);
  const amount = node.value != null ? node.value + " sats" : "";
  const copy = node.details || node.kind || "";
  const amtHtml = amount
    ? '<span class="tx-flow-node__amt">' + escapeHtml(amount) + "</span>"
    : "";
  const idHtml = copy
    ? '<span class="tx-flow-node__id">' + escapeHtml(copy) + "</span>"
    : "";
  return (
    '<button type="button" class="tx-flow-node" data-side="' +
    escapeHtml(side) +
    '" data-copy="' +
    escapeHtml(copy) +
    '" data-kind="' +
    escapeHtml(node.kind || "") +
    '" data-amount="' +
    escapeHtml(amount) +
    '" data-color="' +
    color +
    '" data-stroke="' +
    stroke +
    '" style="--tx-flow-weight:' +
    weight.toFixed(3) +
    ";--tx-flow-color:" +
    color +
    '">' +
    '<span class="tx-flow-node__kind">' +
    escapeHtml(node.kind || "") +
    "</span>" +
    idHtml +
    amtHtml +
    "</button>"
  );
}

function renderTxTableHtml(tx) {
  const inpNodes = (tx.vin || []).map(inputIoNode);
  const outNodes = (tx.vout || []).map(outputIoNode);
  const txFull = tx.txid || tx.hash || "N/A";
  const palette = txFlowPalette();
  const inTotal = sumIoSats(inpNodes);
  const outTotal = sumIoSats(outNodes);
  const maxSats = Math.max(inTotal, outTotal, ...inpNodes.map(txFlowSats), ...outNodes.map(txFlowSats), 1);
  const txColor = palette[txFlowHash(txFull) % palette.length];
  const txAmount =
    (inTotal > 0 ? inTotal.toLocaleString() + " sats in" : "Inputs") +
    " · " +
    (outTotal > 0 ? outTotal.toLocaleString() + " sats out" : "Outputs");

  const inHtml = inpNodes
    .map(function (node, i) {
      return renderTxFlowNode(node, "in", i, maxSats, palette);
    })
    .join("");
  const outHtml = outNodes
    .map(function (node, i) {
      return renderTxFlowNode(node, "out", i, maxSats, palette);
    })
    .join("");

  return (
    '<div class="tx-flow">' +
    '<p class="tx-flow-hint muted-note">Click to copy.</p>' +
    '<div class="tx-flow-board">' +
    '<svg class="tx-flow-wires" aria-hidden="true"></svg>' +
    '<div class="tx-flow-col" data-side="in">' +
    '<h4 class="tx-flow-col__title">Inputs · ' +
    inpNodes.length +
    "</h4>" +
    inHtml +
    "</div>" +
    '<div class="tx-flow-col tx-flow-col--mid" data-side="tx">' +
    '<h4 class="tx-flow-col__title">Transaction</h4>' +
    '<button type="button" class="tx-flow-node tx-flow-node--tx" data-side="tx" data-copy="' +
    escapeHtml(txFull) +
    '" data-kind="Transaction ID" data-amount="' +
    escapeHtml(txAmount) +
    '" data-color="' +
    txColor +
    '" data-stroke="2.25" style="--tx-flow-weight:0.72;--tx-flow-color:' +
    txColor +
    '">' +
    '<span class="tx-flow-node__kind">Transaction ID</span>' +
    '<span class="tx-flow-node__id">' +
    escapeHtml(txFull) +
    "</span>" +
    '<span class="tx-flow-node__amt">' +
    escapeHtml(txAmount) +
    "</span></button></div>" +
    '<div class="tx-flow-col" data-side="out">' +
    '<h4 class="tx-flow-col__title">Outputs · ' +
    outNodes.length +
    "</h4>" +
    outHtml +
    "</div></div></div>"
  );
}

function showTxTableCopyToast(root, message) {
  const toast = root?.closest(".tx-detail-body")?.querySelector("#txTableCopyToast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showTxTableCopyToast._timer);
  showTxTableCopyToast._timer = setTimeout(function () {
    toast.hidden = true;
  }, 1400);
}

function txTableNavCells(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll(".tx-table-cell:not(.tx-table-cell--idx)")).filter(function (el) {
    if (el.hidden) return false;
    const row = el.closest("tr");
    if (row?.hidden) return false;
    const group = el.closest(".tx-table-group");
    if (group && group.dataset.collapsed !== "0") {
      return el.closest(".tx-table-group-summary") != null;
    }
    return true;
  });
}

function txTableClearFocus(root) {
  if (!root) return;
  root.querySelectorAll(".tx-table-cell--focused").forEach(function (el) {
    el.classList.remove("tx-table-cell--focused");
  });
}

function txTableCellHasTextSelection(cell) {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !cell) return false;
  const node = sel.anchorNode;
  return !!(node && cell.contains(node));
}

function txTableScrollContainer(el) {
  if (!el) return false;
  const s = window.getComputedStyle(el);
  return /(auto|scroll|overlay)/.test(s.overflowX + " " + s.overflowY);
}

function txTableScrollElementIntoContainer(container, target, pad) {
  const cRect = container.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  if (tRect.left < cRect.left + pad) {
    container.scrollLeft += tRect.left - (cRect.left + pad);
  } else if (tRect.right > cRect.right - pad) {
    container.scrollLeft += tRect.right - (cRect.right - pad);
  }
  if (tRect.top < cRect.top + pad) {
    container.scrollTop += tRect.top - (cRect.top + pad);
  } else if (tRect.bottom > cRect.bottom - pad) {
    container.scrollTop += tRect.bottom - (cRect.bottom - pad);
  }
}

function txTableScrollCellIntoView(cell) {
  if (!cell) return;
  const pad = 8;
  let node = cell.parentElement;
  while (node && node !== document.documentElement) {
    if (txTableScrollContainer(node)) {
      txTableScrollElementIntoContainer(node, cell, pad);
    }
    node = node.parentElement;
  }
}

function txTableMarkFocused(root, cell, opts) {
  opts = opts || {};
  if (!root || !cell) return;
  txTableClearFocus(root);
  cell.classList.add("tx-table-cell--focused");
  if (opts.focus !== false) {
    try {
      cell.focus({ preventScroll: true });
    } catch (_) {}
  }
  if (opts.clearSelection) {
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  }
  if (opts.scroll) {
    requestAnimationFrame(function () {
      txTableScrollCellIntoView(cell);
    });
  }
}

function txTableFocusCell(root, cell, opts) {
  opts = opts || {};
  txTableMarkFocused(root, cell, { clearSelection: true, scroll: !!opts.scroll });
}

function txTableFocusedCell(root) {
  return root?.querySelector(".tx-table-cell--focused") || null;
}

function txTableFocusRelative(root, delta) {
  const cells = txTableNavCells(root);
  if (!cells.length) return;
  let idx = cells.indexOf(txTableFocusedCell(root));
  if (idx < 0) idx = 0;
  else idx = Math.max(0, Math.min(cells.length - 1, idx + delta));
  txTableFocusCell(root, cells[idx], { scroll: true });
}

function txTableFocusGrid(root, rowDelta, colDelta) {
  const cells = txTableNavCells(root);
  if (!cells.length) return;
  const cell = txTableFocusedCell(root);
  if (!cell) {
    txTableFocusCell(root, cells[0], { scroll: true });
    return;
  }
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  if (!Number.isFinite(row) || !Number.isFinite(col)) {
    txTableFocusRelative(root, rowDelta !== 0 ? rowDelta : colDelta);
    return;
  }
  const target = cells.find(function (el) {
    return Number(el.dataset.row) === row + rowDelta && Number(el.dataset.col) === col + colDelta;
  });
  if (target) txTableFocusCell(root, target, { scroll: true });
  else txTableFocusRelative(root, rowDelta !== 0 ? rowDelta : colDelta);
}

function txTableToggleGroup(group, root) {
  if (!group) return;
  const collapsed = group.dataset.collapsed !== "0";
  group.dataset.collapsed = collapsed ? "0" : "1";
  const isExpanded = group.dataset.collapsed === "0";
  const summary = group.querySelector(".tx-table-group-summary");
  const collapseRow = group.querySelector(".tx-table-group-collapse");
  const detailRows = group.querySelectorAll(".tx-table-group-row");
  if (summary) summary.hidden = isExpanded;
  if (collapseRow) collapseRow.hidden = !isExpanded;
  detailRows.forEach(function (row) {
    row.hidden = !isExpanded;
  });
  const next = isExpanded
    ? group.querySelector(".tx-table-group-collapse .tx-table-cell") ||
      group.querySelector(".tx-table-group-row .tx-table-cell")
    : group.querySelector(".tx-table-group-summary .tx-table-cell");
  if (root && next) txTableFocusCell(root, next, { scroll: true });
}

async function copyTextToClipboard(text, restoreFocusEl) {
  if (text == null || text === "") return false;
  const value = String(text);
  const restore =
    restoreFocusEl && typeof restoreFocusEl.focus === "function" ? restoreFocusEl : null;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (_) {}
    }
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  } finally {
    if (restore) {
      try {
        restore.focus({ preventScroll: true });
      } catch (_) {}
    }
  }
}

async function txTableCopyCell(root, cell) {
  if (!cell) return;
  const sel = window.getSelection();
  let text = "";
  if (sel && !sel.isCollapsed && cell.contains(sel.anchorNode)) {
    text = sel.toString();
  }
  if (!text) {
    text = cell.getAttribute("data-copy") || cell.dataset.copy || "";
  }
  if (!text || text === "collapse") return;
  const ok = await copyTextToClipboard(text, cell);
  showTxTableCopyToast(root, ok ? "Copied" : "Copy failed");
  if (root && root.contains(cell)) {
    txTableMarkFocused(root, cell, { clearSelection: true });
  }
}

function focusTxTable(root) {
  if (!root || !root.classList.contains("tx-table-view")) return;
  requestAnimationFrame(function () {
    const first = txTableNavCells(root)[0];
    if (first) txTableFocusCell(root, first);
  });
}

function txFlowRelRect(board, el) {
  const b = board.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height };
}

function txFlowCurve(x1, y1, x2, y2) {
  const c = Math.max(24, Math.abs(x2 - x1) * 0.45);
  return "M" + x1 + "," + y1 + " C" + (x1 + c) + "," + y1 + " " + (x2 - c) + "," + y2 + " " + x2 + "," + y2;
}

function txFlowNodeIsHighlighted(el) {
  return !!(el && el.matches(":hover, :focus-visible"));
}

function txFlowFallbackColor() {
  const bw = currentBwMode();
  if (bw === "white") return "#111111";
  if (bw === "black") return "#ffffff";
  if (bw === "glow") return "#f7931a";
  return "#f7931a";
}

function txFlowHoverColor() {
  const bw = currentBwMode();
  if (bw === "white") return "#000000";
  if (bw === "glow") return "#f7931a";
  return "#ffffff";
}

function txFlowWireColor(el, txNode) {
  const dipped = !!(el && el.classList.contains("is-flashing")) || !!(txNode && txNode.classList.contains("is-flashing"));
  if (dipped) return (el && el.dataset.color) || txFlowFallbackColor();
  if (txFlowNodeIsHighlighted(el) || txFlowNodeIsHighlighted(txNode)) return txFlowHoverColor();
  return (el && el.dataset.color) || txFlowFallbackColor();
}

function drawTxFlowWires(root) {
  const board = root.querySelector(".tx-flow-board");
  const svg = root.querySelector(".tx-flow-wires");
  const txNode = root.querySelector('[data-side="tx"] .tx-flow-node');
  if (!board || !svg || !txNode) return;
  const width = board.clientWidth;
  const height = board.scrollHeight;
  svg.setAttribute("viewBox", "0 0 " + width + " " + height);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  const mid = txFlowRelRect(board, txNode);
  const ins = root.querySelectorAll('[data-side="in"] .tx-flow-node');
  const outs = root.querySelectorAll('[data-side="out"] .tx-flow-node');
  let paths = "";
  ins.forEach(function (el) {
    const a = txFlowRelRect(board, el);
    paths +=
      '<path d="' +
      txFlowCurve(a.x + a.w, a.y + a.h / 2, mid.x, mid.y + mid.h / 2) +
      '" fill="none" stroke="' +
      txFlowWireColor(el, txNode) +
      '" stroke-width="' +
      (el.dataset.stroke || "1.25") +
      '" stroke-linecap="round" opacity="0.82"></path>';
  });
  outs.forEach(function (el) {
    const a = txFlowRelRect(board, el);
    paths +=
      '<path d="' +
      txFlowCurve(mid.x + mid.w, mid.y + mid.h / 2, a.x, a.y + a.h / 2) +
      '" fill="none" stroke="' +
      txFlowWireColor(el, txNode) +
      '" stroke-width="' +
      (el.dataset.stroke || "1.25") +
      '" stroke-linecap="round" opacity="0.82"></path>';
  });
  svg.innerHTML = paths;
}

function flashTxFlowNode(root, node) {
  if (!node) return;
  node.classList.remove("is-flashing");
  void node.offsetWidth;
  node.classList.add("is-flashing");
  drawTxFlowWires(root);
  clearTimeout(node._txFlowFlashTimer);
  node._txFlowFlashTimer = setTimeout(function () {
    node.classList.remove("is-flashing");
    drawTxFlowWires(root);
  }, 520);
}

function showTxFlowCopiedTip(root, node, message) {
  const board = root?.querySelector(".tx-flow-board");
  if (!board || !node) return;
  let tip = board.querySelector(".tx-flow-copied-tip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "tx-flow-copied-tip";
    tip.setAttribute("aria-live", "polite");
    board.appendChild(tip);
  }
  tip.textContent = message;
  const b = board.getBoundingClientRect();
  const r = node.getBoundingClientRect();
  const pad = 10;
  let left = r.left - b.left + r.width / 2;
  const above = r.top - b.top >= 18;
  let top = above ? r.top - b.top - 4 : r.bottom - b.top + 4;
  left = Math.max(pad, Math.min(left, b.width - pad));
  top = Math.max(pad, Math.min(top, b.height - pad));
  tip.style.left = left + "px";
  tip.style.top = top + "px";
  tip.style.transform = above ? "translate(-50%, -100%)" : "translate(-50%, 0)";
  tip.hidden = false;
  clearTimeout(showTxFlowCopiedTip._timer);
  showTxFlowCopiedTip._timer = setTimeout(function () {
    tip.hidden = true;
  }, 1200);
}

async function copyTxFlowNode(root, node) {
  if (!node) return;
  const text = node.getAttribute("data-copy") || "";
  if (!text) return;
  flashTxFlowNode(root, node);
  showTxFlowCopiedTip(root, node, "Copied");
  const ok = await copyTextToClipboard(text, node);
  if (!ok) showTxFlowCopiedTip(root, node, "Copy failed");
}

function selectTxFlowNode(root, node, opts) {
  opts = opts || {};
  if (!root || !node) return;
  root.querySelectorAll(".tx-flow-node.is-selected").forEach(function (el) {
    el.classList.remove("is-selected");
  });
  node.classList.add("is-selected");
  if (opts.focus !== false) {
    try {
      node.focus({ preventScroll: false });
    } catch (_) {}
  }
}

function initTxFlowView(root) {
  if (!root) return;
  const draw = function () {
    drawTxFlowWires(root);
  };
  requestAnimationFrame(function () {
    draw();
    requestAnimationFrame(draw);
  });
  if (typeof ResizeObserver !== "undefined") {
    if (root._txFlowRo) root._txFlowRo.disconnect();
    root._txFlowRo = new ResizeObserver(draw);
    const board = root.querySelector(".tx-flow-board");
    if (board) root._txFlowRo.observe(board);
  }
  if (!root._txFlowHoverBound) {
    root._txFlowHoverBound = true;
    root.addEventListener("pointerenter", draw, true);
    root.addEventListener("pointerleave", draw, true);
    root.addEventListener("transitionend", function (e) {
      if (e.target && e.target.classList && e.target.classList.contains("tx-flow-node")) draw();
    });
  }
}

function initTxTableView(root) {
  initTxFlowView(root);
}

function renderTxGraphHtml(tx) {
  return renderTxTableHtml(tx);
}

function escapeHtml(s) {
  if (!s) return "";
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

let pendingMempoolMessage = null;
let openTxExplorer = function (_txid) {};

function postToMempoolIframe(data) {
  const iframe = document.getElementById("displayIframe");
  if (!iframe?.contentWindow || !iframe.src) {
    pendingMempoolMessage = data;
    return;
  }
  try {
    const win = iframe.contentWindow;
    let delivered = false;
    if (data?.type === "blockvase-load-block" && typeof win.applyHistoricalBlock === "function") {
      win.applyHistoricalBlock(data.txs || [], data.selectTxid || "");
      delivered = true;
    } else if (data?.type === "blockvase-resume-mempool" && typeof win.resumeLiveMempool === "function") {
      win.resumeLiveMempool(data.selectTxid || "");
      delivered = true;
    } else if (data?.type === "blockvase-select-tx" && data.txid && typeof win.selectMempoolTransaction === "function") {
      win.selectMempoolTransaction(data.txid);
      delivered = true;
    }
    if (!delivered) win.postMessage(data, window.location.origin);
    pendingMempoolMessage = null;
  } catch (_) {
    pendingMempoolMessage = data;
  }
}

function initTxDetailPanel() {
  const panel = document.getElementById("tx-detail-panel");
  const closeBtn = document.querySelector(".tx-detail-close");
  const txidEl = document.getElementById("tx-detail-txid");
  const statusEl = document.getElementById("tx-detail-status");
  const graph = document.getElementById("tx-graph");

  const loadingEl = document.getElementById("txDetailLoading");
  let txDetailLoadSeq = 0;
  let txDetailCloseTimer = 0;

  function setTxDetailLoading(isLoading) {
    panel.classList.toggle("is-loading", isLoading);
    if (!loadingEl) return;
    loadingEl.hidden = !isLoading;
    loadingEl.setAttribute("aria-hidden", isLoading ? "false" : "true");
    loadingEl.setAttribute("aria-busy", isLoading ? "true" : "false");
  }

  if (!panel || !closeBtn) return;

  function finishClosePanel() {
    clearTimeout(txDetailCloseTimer);
    txDetailCloseTimer = 0;
    if (document.fullscreenElement === panel || document.webkitFullscreenElement === panel) {
      (document.exitFullscreen ?? document.webkitExitFullscreen)?.call(document);
    }
    panel.classList.remove("expanded", "is-closing");
    panel.setAttribute("aria-hidden", "true");
    postToMempoolIframe({ type: "blockvase-tx-deselect" });
  }

  function closePanel() {
    if (!panel.classList.contains("expanded") || panel.classList.contains("is-closing")) return;
    panel.classList.add("is-closing");
    const fadeMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
    clearTimeout(txDetailCloseTimer);
    txDetailCloseTimer = setTimeout(finishClosePanel, fadeMs);
  }

  function cancelClosePanel() {
    clearTimeout(txDetailCloseTimer);
    txDetailCloseTimer = 0;
    panel.classList.remove("is-closing");
  }

  closeBtn.addEventListener("click", closePanel);

  if (!panel.dataset.txTableBound) {
    panel.dataset.txTableBound = "1";

    panel.addEventListener("click", function (e) {
      if (!panel.classList.contains("expanded") || panel.classList.contains("is-closing")) return;
      const node = e.target.closest(".tx-flow-node");
      if (!node || !panel.contains(node)) return;
      const root = document.getElementById("tx-graph");
      selectTxFlowNode(root, node);
      copyTxFlowNode(root, node);
    });

    document.addEventListener("keydown", function (e) {
      if (!panel.classList.contains("expanded") || panel.classList.contains("is-closing")) return;
      const root = document.getElementById("tx-graph");
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll(".tx-flow-node"));
      if (!nodes.length) return;
      let node = document.activeElement && document.activeElement.closest
        ? document.activeElement.closest(".tx-flow-node")
        : null;
      if (!node || !root.contains(node)) node = root.querySelector(".tx-flow-node.is-selected") || nodes[0];
      const idx = nodes.indexOf(node);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectTxFlowNode(root, nodes[Math.min(nodes.length - 1, idx + 1)]);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        selectTxFlowNode(root, nodes[Math.max(0, idx - 1)]);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const side = node.dataset.side;
        const nextSide = e.key === "ArrowRight"
          ? side === "in" ? "tx" : "out"
          : side === "out" ? "tx" : "in";
        const target = root.querySelector('[data-side="' + nextSide + '"] .tx-flow-node');
        if (target) selectTxFlowNode(root, target);
        return;
      }
      if (e.key === "Copy" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c")) {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed) return;
        e.preventDefault();
        selectTxFlowNode(root, node);
        copyTxFlowNode(root, node);
      }
    });
  }

  function swapContent(html) {
    if (!graph) return;
    graph.innerHTML = html;
    graph.classList.remove("tx-table-swapping");
    initTxTableView(graph);
  }

  const fullscreenBtn = document.getElementById("txDetailFullscreen");
  if (fullscreenBtn) {
    const fsEl = () => document.fullscreenElement ?? document.webkitFullscreenElement;
    fullscreenBtn.addEventListener("click", () => {
      if (!fsEl()) {
        (panel.requestFullscreen ?? panel.webkitRequestFullscreen)?.call(panel);
      } else if (fsEl() === panel) {
        (document.exitFullscreen ?? document.webkitExitFullscreen)?.call(document);
      }
    });
    document.addEventListener("fullscreenchange", () => {
      fullscreenBtn.setAttribute("aria-label", fsEl() === panel ? "Exit fullscreen" : "Fullscreen");
    });
    document.addEventListener("webkitfullscreenchange", () => {
      fullscreenBtn.setAttribute("aria-label", fsEl() === panel ? "Exit fullscreen" : "Fullscreen");
    });
  }

  openTxExplorer = function (txid, details) {
    if (!txid) return;
    if (txid === openTxExplorer._txid && panel.classList.contains("expanded") && panel.classList.contains("is-loading")) {
      return;
    }
    openTxExplorer._txid = txid;
    const loadId = ++txDetailLoadSeq;

    cancelClosePanel();
    panel.classList.add("expanded");
    panel.setAttribute("aria-hidden", "false");
    if (txidEl) txidEl.textContent = txid;
    if (statusEl) statusEl.textContent = "";
    setTxDetailLoading(true);
    try {
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (_) {}

    const preload = details && typeof details === "object" ? normalizeExplorerTx(details) || details : null;
    const loadPromise = preload && !preload.error
      ? Promise.resolve(preload)
      : blockvaseFetchWithTimeout("/tx/" + encodeURIComponent(txid), 10000).then(async (r) => {
        let tx = null;
        try {
          tx = await r.json();
        } catch (_) {
          tx = null;
        }
        if (r.ok && tx && !tx.error) return normalizeExplorerTx(tx) || tx;
        const msg =
          (tx && tx.error) ||
          (r.status === 404
            ? "Transaction details not available yet."
            : "Failed to load transaction (HTTP " + r.status + ")");
        throw new Error(msg);
      });
    loadPromise
      .then((tx) => {
        if (loadId !== txDetailLoadSeq) return;
        if (statusEl) {
          const fromMinedBlock = blockCarouselState.selected && blockCarouselState.selected !== "live";
          statusEl.textContent = tx.confirmations > 0 || fromMinedBlock ? "Confirmed" : "Unconfirmed (mempool)";
        }
        openTxExplorer._tx = tx;
        swapContent(renderTxTableHtml(tx));
        setTxDetailLoading(false);
      })
      .catch((e) => {
        if (loadId !== txDetailLoadSeq) return;
        if (statusEl) statusEl.textContent = "";
        const msg =
          e && (e.name === "AbortError" || /abort/i.test(String(e.message || "")))
            ? "Timed out loading transaction details."
            : e.message || "Failed to load transaction";
        swapContent('<div class="tx-detail-error">' + escapeHtml(msg) + "</div>");
        setTxDetailLoading(false);
      });
  };

  openTxExplorer._refreshPalette = function () {
    if (!openTxExplorer._tx || !panel.classList.contains("expanded")) return;
    swapContent(renderTxTableHtml(openTxExplorer._tx));
  };

  window.addEventListener("message", (ev) => {
    if (ev.origin !== window.location.origin) return;
    if (ev.data?.type !== "blockvase-tx-select" || !ev.data.txid) return;
    openTxExplorer(ev.data.txid);
  });
}

try {
  const bc = new BroadcastChannel("blockvase");
  bc.onmessage = (e) => {
    if (e.data?.type === "theme-change" && e.data?.theme) {
      document.body.dataset.theme = e.data.theme;
    }
  };
} catch (_) {}

async function refreshDashboardMetrics() {
  await loadMetrics();
}

function startMetricsPolling() {
  if (metricsPollTimer) clearInterval(metricsPollTimer);
  metricsPollTimer = setInterval(() => {
    refreshDashboardMetrics().catch(() => {});
  }, METRICS_POLL_MS);
}

function initBlockvaseProductModel() {
  const shopTab = document.querySelector('[data-portal-tab="shop"]');
  if (shopTab && (shopTab.disabled || shopTab.getAttribute("aria-disabled") === "true")) return;
  const viewer = document.getElementById("blockvaseProductModel");
  if (!viewer) return;

  const loadingOverlay = document.getElementById("blockvaseModelLoading");
  let overlayDismissed = false;

  // model-viewer draws a 1px system-blue focus ring on its shadow .userInput
  // (used for Shift-pan). Light-DOM CSS cannot reach it — inject into the shadow root.
  function suppressModelViewerFocusRing() {
    const root = viewer.shadowRoot;
    if (!root) return false;
    if (root.getElementById("hrs-no-focus-ring")) return true;
    const style = document.createElement("style");
    style.id = "hrs-no-focus-ring";
    style.textContent = `
      .userInput,
      .userInput:focus,
      .userInput:focus-visible,
      .userInput:focus-within,
      .userInput:focus-visible:active,
      canvas,
      canvas:focus,
      canvas:focus-visible,
      :host(:focus),
      :host(:focus-visible),
      :host(:focus-within) {
        outline: none !important;
        outline-width: 0 !important;
        outline-style: none !important;
        outline-color: transparent !important;
        outline-offset: 0 !important;
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `;
    root.appendChild(style);
    const userInput = root.querySelector(".userInput");
    if (userInput) {
      userInput.style.setProperty("outline", "none", "important");
      userInput.style.setProperty("outline-width", "0", "important");
      userInput.style.setProperty("outline-style", "none", "important");
      userInput.style.setProperty("outline-color", "transparent", "important");
      userInput.style.setProperty("box-shadow", "none", "important");
      if (!userInput.dataset.hrsFocusPatched) {
        userInput.dataset.hrsFocusPatched = "1";
        const killRing = () => {
          userInput.style.setProperty("outline", "none", "important");
          userInput.style.setProperty("outline-width", "0", "important");
          userInput.style.setProperty("outline-style", "none", "important");
        };
        userInput.addEventListener("focus", killRing);
        userInput.addEventListener("focusin", killRing);
      }
    }
    return true;
  }
  if (!suppressModelViewerFocusRing()) {
    const focusRingObserver = new MutationObserver(() => {
      if (suppressModelViewerFocusRing()) focusRingObserver.disconnect();
    });
    focusRingObserver.observe(viewer, { childList: true, subtree: true });
    customElements.whenDefined("model-viewer").then(() => {
      suppressModelViewerFocusRing();
      window.setTimeout(suppressModelViewerFocusRing, 0);
      window.setTimeout(suppressModelViewerFocusRing, 250);
      window.setTimeout(suppressModelViewerFocusRing, 1000);
    }).catch(() => {});
  }
  viewer.addEventListener("load", suppressModelViewerFocusRing);

  const LCD_VIDEO_URL = "/models/lcd-mempool.mp4?v=10";
  // Swap just before the baked end→start dissolve finishes so the join never hitch-seeks.
  const LCD_LOOP_LEAD_SEC = 0.18;
  let videoApplied = false;
  let bindAttempts = 0;
  let lcdVideoEl = null;
  let revealInFlight = false;
  let lcdLoopRaf = 0;

  const BODY = { x0: -1.193, y0: -1.2, z0: -1.193, x1: 1.193, y1: 1.175, z1: 1.193 };
  // Architectural spacing: clear extension-line gap, dim-line stand-off,
  // and a short overshoot past the dim line.
  const DIM_OFFSET = 0.58;
  const EXT_GAP = 0.14;
  const EXT_OVERSHOOT = 0.05;
  const LABEL_SCREEN_GAP_PX = 16;
  const LABEL_GAP_WORLD_MIN = 0.24;
  const LABEL_GAP_WORLD_MAX = 0.75;
  const LABEL_GAP_SMOOTH = 0.18;
  const OCCLUSION_HIDE_FRAMES = 3;
  const OCCLUSION_SHOW_FRAMES = 4;
  // Hairline bars (world units). Keep thin so they read as drafting ink, not tubes.
  const LINE_THICK = 0.0028;
  const EXT_THICK = 0.0022;
  const TICK_LEN = 0.12;
  // Construction-drafting dash pattern (world units): short ink, open gap.
  const DIM_DASH = 0.045;
  const DIM_GAP = 0.038;
  const EXT_DASH = 0.018;
  const EXT_GAP_DASH = 0.042;
  const LABEL_SLOTS = ["hotspot-dim-w", "hotspot-dim-h", "hotspot-dim-d"];
  let dimensionsReady = false;
  let labelOcclusionRaf = 0;
  let labelLayouts = null;
  let labelGapSmooth = {};
  let labelOcclusionVotes = { w: 0, h: 0, d: 0 };
  let labelOcclusionHidden = { w: false, h: false, d: false };
  function waitForVideoReady(video, timeoutMs = 12000) {
      if (!video) return Promise.resolve(false);
      if (video.readyState >= 3) return Promise.resolve(true);
      return new Promise((resolve) => {
        let done = false;
        const finish = (ok) => {
          if (done) return;
          done = true;
          video.removeEventListener("loadeddata", onReady);
          video.removeEventListener("canplay", onReady);
          video.removeEventListener("canplaythrough", onReady);
          video.removeEventListener("error", onErr);
          resolve(ok);
        };
        const onReady = () => {
          if (video.readyState >= 2) finish(true);
        };
        const onErr = () => finish(false);
        video.addEventListener("loadeddata", onReady);
        video.addEventListener("canplay", onReady);
        video.addEventListener("canplaythrough", onReady);
        video.addEventListener("error", onErr);
        window.setTimeout(() => finish(video.readyState >= 2), timeoutMs);
      });
    }
  function getViewerScene() {
      const sceneSym = Object.getOwnPropertySymbols(viewer).find(
        (sym) => String(sym) === "Symbol(scene)"
      );
      return sceneSym ? viewer[sceneSym] : null;
    }
  function makeBoxGeometry(BufferGeometry, BufferAttribute, sx, sy, sz) {
      const x = sx / 2;
      const y = sy / 2;
      const z = sz / 2;
      const positions = [];
      const normals = [];
      const faces = [
        [[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z], [0, 0, 1]],
        [[x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z], [0, 0, -1]],
        [[-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z], [0, 1, 0]],
        [[-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z], [0, -1, 0]],
        [[x, -y, z], [x, -y, -z], [x, y, -z], [x, y, z], [1, 0, 0]],
        [[-x, -y, -z], [-x, -y, z], [-x, y, z], [-x, y, -z], [-1, 0, 0]],
      ];
      const indices = [];
      let vi = 0;
      faces.forEach((face) => {
        const nn = face[4];
        for (let i = 0; i < 4; i += 1) {
          positions.push(face[i][0], face[i][1], face[i][2]);
          normals.push(nn[0], nn[1], nn[2]);
        }
        indices.push(vi, vi + 1, vi + 2, vi, vi + 2, vi + 3);
        vi += 4;
      });
      const geo = new BufferGeometry();
      geo.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
      geo.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3));
      if (typeof geo.setIndex === "function") geo.setIndex(indices);
      return geo;
    }
  function orientMeshAlongX(mesh, dx, dy, dz) {
      const len = Math.hypot(dx, dy, dz) || 1;
      const x = dx / len;
      const y = dy / len;
      const z = dz / len;
      const cx = 0;
      const cy = -z;
      const cz = y;
      const clen = Math.hypot(cy, cz);
      if (clen < 1e-8) {
        if (x >= 0) mesh.quaternion.set(0, 0, 0, 1);
        else mesh.quaternion.set(0, 1, 0, 0);
        return;
      }
      const angle = Math.acos(Math.max(-1, Math.min(1, x)));
      const s = Math.sin(angle / 2);
      const inv = 1 / clen;
      mesh.quaternion.set(cx * inv * s, cy * inv * s, cz * inv * s, Math.cos(angle / 2));
    }
  function addDimBar(group, Mesh, BufferGeometry, BufferAttribute, mat, a, b, thickness) {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const dz = b[2] - a[2];
      const len = Math.hypot(dx, dy, dz) || 1e-6;
      const mesh = new Mesh(
        makeBoxGeometry(BufferGeometry, BufferAttribute, len, thickness, thickness),
        mat
      );
      mesh.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
      orientMeshAlongX(mesh, dx, dy, dz);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      group.add(mesh);
      return mesh;
    }
  function addDashedDimBar(
      group,
      Mesh,
      BufferGeometry,
      BufferAttribute,
      mat,
      a,
      b,
      thickness,
      dashLen,
      gapLen
    ) {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const dz = b[2] - a[2];
      const len = Math.hypot(dx, dy, dz);
      if (len < 1e-6) return [];
      const ux = dx / len;
      const uy = dy / len;
      const uz = dz / len;
      const step = Math.max(1e-4, dashLen + gapLen);
      const meshes = [];
      let t = 0;
      while (t < len - 1e-6) {
        const seg = Math.min(dashLen, len - t);
        if (seg > 1e-4) {
          const a2 = [a[0] + ux * t, a[1] + uy * t, a[2] + uz * t];
          const b2 = [a[0] + ux * (t + seg), a[1] + uy * (t + seg), a[2] + uz * (t + seg)];
          meshes.push(
            addDimBar(group, Mesh, BufferGeometry, BufferAttribute, mat, a2, b2, thickness)
          );
        }
        t += step;
      }
      // Ensure the far end always gets a visible dash (drafting convention).
      if (meshes.length === 0) {
        meshes.push(addDimBar(group, Mesh, BufferGeometry, BufferAttribute, mat, a, b, thickness));
      }
      return meshes;
    }
  function addDimTick(group, Mesh, BufferGeometry, BufferAttribute, mat, point, axis, halfLen, thickness) {
      const a = [
        point[0] - axis[0] * halfLen,
        point[1] - axis[1] * halfLen,
        point[2] - axis[2] * halfLen,
      ];
      const b = [
        point[0] + axis[0] * halfLen,
        point[1] + axis[1] * halfLen,
        point[2] + axis[2] * halfLen,
      ];
      return addDimBar(group, Mesh, BufferGeometry, BufferAttribute, mat, a, b, thickness);
    }
  function placeHotspot(name, position, normal) {
      viewer.updateHotspot({
        name,
        position: `${position[0]}m ${position[1]}m ${position[2]}m`,
        normal: `${normal[0]}m ${normal[1]}m ${normal[2]}m`,
      });
    }
  function projectLocalPointToCanvas(model, cam, scene, p) {
      model.updateMatrixWorld(true);
      cam.updateMatrixWorld(true);
      const e = model.matrixWorld.elements;
      const wx = e[0] * p[0] + e[4] * p[1] + e[8] * p[2] + e[12];
      const wy = e[1] * p[0] + e[5] * p[1] + e[9] * p[2] + e[13];
      const wz = e[2] * p[0] + e[6] * p[1] + e[10] * p[2] + e[14];
      const v = cam.position.clone();
      v.set(wx, wy, wz);
      v.project(cam);
      const hw = ((scene && scene.width) || viewer.clientWidth || 1) / 2;
      const hh = ((scene && scene.height) || viewer.clientHeight || 1) / 2;
      return { x: v.x * hw + hw, y: -v.y * hh + hh };
    }
  function projectBodyScreenBounds(model, cam, scene) {
      const corners = [
        [BODY.x0, BODY.y0, BODY.z0],
        [BODY.x1, BODY.y0, BODY.z0],
        [BODY.x0, BODY.y1, BODY.z0],
        [BODY.x1, BODY.y1, BODY.z0],
        [BODY.x0, BODY.y0, BODY.z1],
        [BODY.x1, BODY.y0, BODY.z1],
        [BODY.x0, BODY.y1, BODY.z1],
        [BODY.x1, BODY.y1, BODY.z1],
      ];
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < corners.length; i += 1) {
        const s = projectLocalPointToCanvas(model, cam, scene, corners[i]);
        if (s.x < minX) minX = s.x;
        if (s.x > maxX) maxX = s.x;
        if (s.y < minY) minY = s.y;
        if (s.y > maxY) maxY = s.y;
      }
      return { minX, maxX, minY, maxY };
    }
  function addScaled(mid, out, t) {
      return [mid[0] + out[0] * t, mid[1] + out[1] * t, mid[2] + out[2] * t];
    }
  function setupDimensionLines() {
      if (dimensionsReady) return;
      if (typeof viewer.updateHotspot !== "function") return;
      const scene = getViewerScene();
      if (!scene || !scene.model) return;
  
      let refMesh = null;
      scene.model.traverse((obj) => {
        if (
          !refMesh &&
          obj.isMesh &&
          obj.name === "body" &&
          obj.geometry &&
          obj.geometry.attributes &&
          obj.geometry.attributes.position
        ) {
          refMesh = obj;
        }
      });
      if (!refMesh) {
        scene.model.traverse((obj) => {
          if (!refMesh && obj.isMesh && obj.geometry && obj.geometry.attributes && obj.geometry.attributes.position) {
            refMesh = obj;
          }
        });
      }
      if (!refMesh || !refMesh.material) return;
  
      const Mesh = refMesh.constructor;
      const BufferGeometry = refMesh.geometry.constructor;
      const BufferAttribute = refMesh.geometry.attributes.position.constructor;
      const Group = scene.model.constructor;
      const bodyRenderOrder = typeof refMesh.renderOrder === "number" ? refMesh.renderOrder : 1000;
  
      const existing = scene.model.getObjectByName("blockvaseDimensions");
      if (existing && existing.parent) existing.parent.remove(existing);
  
      const group = new Group();
      group.name = "blockvaseDimensions";
  
      // Hairline drafting ink — not a bright emissive bar.
      const mat = refMesh.material.clone();
      mat.color.setRGB(0.9, 0.88, 0.82);
      if (mat.emissive) mat.emissive.setRGB(0.55, 0.53, 0.48);
      if ("emissiveIntensity" in mat) mat.emissiveIntensity = 0.45;
      mat.metalness = 0;
      mat.roughness = 1;
      mat.depthTest = true;
      mat.depthWrite = false;
      mat.transparent = true;
      mat.opacity = 0.92;
      mat.map = null;
      mat.emissiveMap = null;
      mat.normalMap = null;
      mat.roughnessMap = null;
      mat.metalnessMap = null;
      if ("transmission" in mat) mat.transmission = 0;
      if ("clearcoat" in mat) mat.clearcoat = 0;

      // Softer dotted extension lines (construction drafting).
      const matExt = mat.clone();
      matExt.opacity = 0.55;
      if (matExt.emissive) matExt.emissive.setRGB(0.38, 0.36, 0.32);
      if ("emissiveIntensity" in matExt) matExt.emissiveIntensity = 0.28;
  
      const b = BODY;
      const o = DIM_OFFSET;
      const eg = EXT_GAP;
      const os = EXT_OVERSHOOT;
      const t = LINE_THICK;
      const te = EXT_THICK;
      const tick = TICK_LEN / 2;
      const midX = (b.x0 + b.x1) / 2;
      const midY = (b.y0 + b.y1) / 2;
      const midZ = (b.z0 + b.z1) / 2;
  
      // Fixed back-left layout (clockwise neighbor of the prior front-left pin).
      const zEdge = b.z0;
      const xEdge = b.x0;
      const xOut = -1;

      // Extension lines: gap from object → overshoot past dim line (classic arch. convention).
      const wExt0a = [b.x0, b.y1 + eg, zEdge];
      const wExt0b = [b.x0, b.y1 + o + os, zEdge];
      const w0 = [b.x0, b.y1 + o, zEdge];
      const w1 = [b.x1, b.y1 + o, zEdge];
      const wExt1a = [b.x1, b.y1 + eg, zEdge];
      const wExt1b = [b.x1, b.y1 + o + os, zEdge];
  
      const hExt0a = [xEdge - eg, b.y0, zEdge];
      const hExt0b = [xEdge - o - os, b.y0, zEdge];
      const h0 = [xEdge - o, b.y0, zEdge];
      const h1 = [xEdge - o, b.y1, zEdge];
      const hExt1a = [xEdge - eg, b.y1, zEdge];
      const hExt1b = [xEdge - o - os, b.y1, zEdge];
  
      const dExt0a = [xEdge - eg, b.y0, b.z0];
      const dExt0b = [xEdge - o - os, b.y0, b.z0];
      const d0 = [xEdge - o, b.y0, b.z0];
      const d1 = [xEdge - o, b.y0, b.z1];
      const dExt1a = [xEdge - eg, b.y0, b.z1];
      const dExt1b = [xEdge - o - os, b.y0, b.z1];

      // Straight end ticks, perpendicular to each dimension line.
      const tickW = [0, 1, 0];
      const tickH = [1, 0, 0];
      const tickD = [1, 0, 0];
  
      const bars = []
        .concat(
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, matExt, wExt0a, wExt0b, te, EXT_DASH, EXT_GAP_DASH
          ),
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, matExt, wExt1a, wExt1b, te, EXT_DASH, EXT_GAP_DASH
          ),
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, mat, w0, w1, t, DIM_DASH, DIM_GAP
          ),
          [addDimTick(group, Mesh, BufferGeometry, BufferAttribute, mat, w0, tickW, tick, t * 1.05)],
          [addDimTick(group, Mesh, BufferGeometry, BufferAttribute, mat, w1, tickW, tick, t * 1.05)],
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, matExt, hExt0a, hExt0b, te, EXT_DASH, EXT_GAP_DASH
          ),
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, matExt, hExt1a, hExt1b, te, EXT_DASH, EXT_GAP_DASH
          ),
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, mat, h0, h1, t, DIM_DASH, DIM_GAP
          ),
          [addDimTick(group, Mesh, BufferGeometry, BufferAttribute, mat, h0, tickH, tick, t * 1.05)],
          [addDimTick(group, Mesh, BufferGeometry, BufferAttribute, mat, h1, tickH, tick, t * 1.05)],
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, matExt, dExt0a, dExt0b, te, EXT_DASH, EXT_GAP_DASH
          ),
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, matExt, dExt1a, dExt1b, te, EXT_DASH, EXT_GAP_DASH
          ),
          addDashedDimBar(
            group, Mesh, BufferGeometry, BufferAttribute, mat, d0, d1, t, DIM_DASH, DIM_GAP
          ),
          [addDimTick(group, Mesh, BufferGeometry, BufferAttribute, mat, d0, tickD, tick, t * 1.05)],
          [addDimTick(group, Mesh, BufferGeometry, BufferAttribute, mat, d1, tickD, tick, t * 1.05)]
        );
      bars.forEach((mesh) => {
        mesh.renderOrder = bodyRenderOrder + 1;
      });
  
      // Must live under the glTF model root so model-viewer depth-tests against the body.
      // Keep dims out of framing bounds (setFromObject skips invisible objects).
      if (typeof scene.updateBoundingBox === "function") {
        const originalUpdateBoundingBox = scene.updateBoundingBox.bind(scene);
        scene.updateBoundingBox = function updateBoundingBoxWithoutDims() {
          group.visible = false;
          try {
            return originalUpdateBoundingBox();
          } finally {
            group.visible = true;
          }
        };
        scene.updateBoundingBox();
      }
      scene.model.add(group);
  
      const bodyCenter = [midX, midY, midZ];
      labelLayouts = {
        w: {
          slot: "hotspot-dim-w",
          mid: [midX, b.y1 + o, zEdge],
          preferredOut: [0, 1, 0],
          bodyCenter,
        },
        h: {
          slot: "hotspot-dim-h",
          mid: [xEdge - o, midY, zEdge],
          preferredOut: [xOut, 0, 0],
          bodyCenter,
        },
        d: {
          slot: "hotspot-dim-d",
          mid: [xEdge - o, b.y0, midZ],
          preferredOut: [xOut, 0, 0],
          bodyCenter,
        },
      };
  
      if (typeof scene.queueRender === "function") scene.queueRender();
      dimensionsReady = true;
      startLabelOcclusionTracking();
    }
  function isLabelOccludedByBody(labelPos) {
      const scene = getViewerScene();
      if (!scene || !scene.model || typeof scene.getCamera !== "function") return false;
      const cam = scene.getCamera();
      if (!cam || !labelPos) return false;
      const s = projectLocalPointToCanvas(
        scene.model,
        cam,
        scene,
        [labelPos.x, labelPos.y, labelPos.z]
      );
      const b = projectBodyScreenBounds(scene.model, cam, scene);
      // Must clear the projected body by a few pixels (label half-size handled
      // by placing the anchor further out).
      const pad = 6;
      const outside =
        s.x < b.minX - pad ||
        s.x > b.maxX + pad ||
        s.y < b.minY - pad ||
        s.y > b.maxY + pad;
      return !outside;
    }
  function updateLabelScreenGaps() {
      if (!dimensionsReady || !labelLayouts) return;
      const scene = getViewerScene();
      if (!scene || !scene.model || typeof scene.getCamera !== "function") return;
      const cam = scene.getCamera();
      if (!cam) return;
      const bodyBounds = projectBodyScreenBounds(scene.model, cam, scene);
  
      Object.keys(labelLayouts).forEach((key) => {
        const layout = labelLayouts[key];
        const out = layout.preferredOut;
        const screenMid = projectLocalPointToCanvas(scene.model, cam, scene, layout.mid);
        const screenCenter = projectLocalPointToCanvas(
          scene.model,
          cam,
          scene,
          layout.bodyCenter
        );
        let ax = screenMid.x - screenCenter.x;
        let ay = screenMid.y - screenCenter.y;
        const alen = Math.hypot(ax, ay);
  
        let targetGap = key === "d" ? 0.45 : 0.35;
        if (alen >= 1e-3) {
          ax /= alen;
          ay /= alen;
          const el = viewer.querySelector(`button[slot="${layout.slot}"]`);
          const halfW = Math.max(8, ((el && el.offsetWidth) || 42) / 2);
          const halfH = Math.max(4, ((el && el.offsetHeight) || 11) / 2);
          const halfTowardLine = Math.abs(ax) * halfW + Math.abs(ay) * halfH;
          const wantPx = halfTowardLine + LABEL_SCREEN_GAP_PX;
          const maxGap = key === "d" ? Math.max(LABEL_GAP_WORLD_MAX, 1.1) : LABEL_GAP_WORLD_MAX;
  
          const clearsSilhouette = (t) => {
            const s = projectLocalPointToCanvas(
              scene.model,
              cam,
              scene,
              addScaled(layout.mid, out, t)
            );
            const pad = Math.max(halfW, halfH) + 4;
            return (
              s.x < bodyBounds.minX - pad ||
              s.x > bodyBounds.maxX + pad ||
              s.y < bodyBounds.minY - pad ||
              s.y > bodyBounds.maxY + pad
            );
          };
  
          // Prefer the smallest gap that clears the line AND the body silhouette.
          let lo = LABEL_GAP_WORLD_MIN;
          let hi = maxGap;
          let found = false;
          for (let i = 0; i < 14; i += 1) {
            const t = (lo + hi) / 2;
            const s = projectLocalPointToCanvas(
              scene.model,
              cam,
              scene,
              addScaled(layout.mid, out, t)
            );
            const along = (s.x - screenMid.x) * ax + (s.y - screenMid.y) * ay;
            const okGap = along >= wantPx * 0.85;
            const okSil = clearsSilhouette(t);
            if (okGap && okSil) {
              hi = t;
              found = true;
            } else {
              lo = t;
            }
          }
          targetGap = found ? hi : maxGap;
        }
  
        const prev = labelGapSmooth[key] ?? targetGap;
        const smoothed = prev + (targetGap - prev) * LABEL_GAP_SMOOTH;
        labelGapSmooth[key] = smoothed;
        placeHotspot(layout.slot, addScaled(layout.mid, out, smoothed), out);
      });
    }
  function updateDimensionLabelOcclusion() {
      if (!dimensionsReady || typeof viewer.queryHotspot !== "function") return;
      const scene = getViewerScene();
      if (!scene || !scene.model) return;
      const keyBySlot = {
        "hotspot-dim-w": "w",
        "hotspot-dim-h": "h",
        "hotspot-dim-d": "d",
      };
      LABEL_SLOTS.forEach((name) => {
        const key = keyBySlot[name];
        const el = viewer.querySelector(`button[slot="${name}"]`);
        const hot = viewer.queryHotspot(name);
        if (!el || !hot || !hot.position || !key) return;
        const occludedNow = isLabelOccludedByBody(hot.position);
  
        let votes = labelOcclusionVotes[key] || 0;
        if (occludedNow) votes = Math.min(OCCLUSION_HIDE_FRAMES, votes + 1);
        else votes = Math.max(-OCCLUSION_SHOW_FRAMES, votes - 1);
        labelOcclusionVotes[key] = votes;
  
        let hidden = labelOcclusionHidden[key];
        if (!hidden && votes >= OCCLUSION_HIDE_FRAMES) hidden = true;
        if (hidden && votes <= -OCCLUSION_SHOW_FRAMES) hidden = false;
        labelOcclusionHidden[key] = hidden;
        el.classList.toggle("hide", hidden);
      });
    }
  function startLabelOcclusionTracking() {
      if (labelOcclusionRaf) return;
      const tick = () => {
        updateLabelScreenGaps();
        updateDimensionLabelOcclusion();
        labelOcclusionRaf = window.requestAnimationFrame(tick);
      };
      labelOcclusionRaf = window.requestAnimationFrame(tick);
    }
  function dismissModelLoadingOverlay() {
      if (overlayDismissed) return;
      overlayDismissed = true;
      if (!loadingOverlay) return;
      loadingOverlay.classList.add("is-done");
      loadingOverlay.setAttribute("aria-busy", "false");
      loadingOverlay.setAttribute("aria-hidden", "true");
      window.setTimeout(() => {
        if (loadingOverlay.parentElement) loadingOverlay.hidden = true;
      }, 400);
    }
  function startContinuousModelSpin() {
      // Drive yaw ourselves so interaction damping can't stall model-viewer's auto-rotate.
      const SPEED_RAD_PER_SEC = (8 * Math.PI) / 180;
      let lastTs = performance.now();
      let activePointers = 0;
  
      const onPointerDown = () => {
        activePointers += 1;
      };
      const onPointerUp = () => {
        activePointers = Math.max(0, activePointers - 1);
        lastTs = performance.now();
      };
  
      viewer.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
  
      viewer.autoRotate = false;
      if (viewer.hasAttribute("auto-rotate")) viewer.removeAttribute("auto-rotate");
  
      const tick = (now) => {
        const dt = Math.min(0.05, (now - lastTs) / 1000);
        lastTs = now;
        if (
          activePointers === 0 &&
          !document.hidden &&
          viewer.loaded &&
          typeof viewer.resetTurntableRotation === "function" &&
          typeof viewer.turntableRotation === "number"
        ) {
          viewer.resetTurntableRotation(viewer.turntableRotation + SPEED_RAD_PER_SEC * dt);
        }
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    }

  function getVideoFromTexture(texture) {
      return (
        texture?.source?.element ||
        texture?.source?.video ||
        (texture?.source && texture.source.tagName === "VIDEO" ? texture.source : null)
      );
    }
  function prepareLcdVideoEl(video) {
      if (!video || typeof video.play !== "function") return null;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = false;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("playsinline", "");
      video.setAttribute("muted", "");
      video.setAttribute("preload", "auto");
      return video;
    }
  function bindLcdTexture(material, texture) {
      if (material.pbrMetallicRoughness?.baseColorTexture?.setTexture) {
        material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
      }
      if (material.emissiveTexture?.setTexture) {
        material.emissiveTexture.setTexture(texture);
      } else if (material.setEmissiveTexture) {
        material.setEmissiveTexture(texture);
      }
    }
  function assertMatteLcdMaterial(material) {
      try {
        if (material.pbrMetallicRoughness) {
          if (typeof material.pbrMetallicRoughness.setMetallicFactor === "function") {
            material.pbrMetallicRoughness.setMetallicFactor(0);
          } else {
            material.pbrMetallicRoughness.metallicFactor = 0;
          }
          if (typeof material.pbrMetallicRoughness.setRoughnessFactor === "function") {
            material.pbrMetallicRoughness.setRoughnessFactor(0.95);
          } else {
            material.pbrMetallicRoughness.roughnessFactor = 0.95;
          }
        }
        if (typeof material.setEmissiveFactor === "function") {
          material.setEmissiveFactor([0.45, 0.45, 0.45]);
        } else if (material.emissiveFactor) {
          material.emissiveFactor = [0.45, 0.45, 0.45];
        }
        if (material.extensions?.KHR_materials_emissive_strength) {
          material.extensions.KHR_materials_emissive_strength.emissiveStrength = 0.65;
        }
      } catch (_) {
        /* non-fatal */
      }
    }
  function startSeamlessLcdLoop(material, slots) {
      if (!slots.length) return;
      let active = 0;
      let swapping = false;

      const armStandby = (idx) => {
        const slot = slots[idx];
        if (!slot?.video) return;
        try {
          slot.video.pause();
          slot.video.currentTime = 0;
        } catch (_) {
          /* ignore seek errors until metadata is ready */
        }
      };

      const swapTo = async (next) => {
        if (swapping || next === active) return;
        swapping = true;
        const nextSlot = slots[next];
        const prevSlot = slots[active];
        try {
          if (nextSlot.video) {
            if (nextSlot.video.readyState < 2) {
              await waitForVideoReady(nextSlot.video, 4000);
            }
            try {
              if (nextSlot.video.currentTime > 0.05) nextSlot.video.currentTime = 0;
            } catch (_) {
              /* ignore */
            }
            await nextSlot.video.play().catch(() => {});
          }
          bindLcdTexture(material, nextSlot.texture);
          active = next;
          lcdVideoEl = nextSlot.video || lcdVideoEl;
          if (prevSlot.video) {
            window.setTimeout(() => armStandby(1 - next), 80);
          }
        } finally {
          swapping = false;
        }
      };

      const tick = () => {
        lcdLoopRaf = 0;
        const slot = slots[active];
        const video = slot && slot.video;
        if (video && Number.isFinite(video.duration) && video.duration > 1) {
          const remaining = video.duration - video.currentTime;
          if (!swapping && remaining <= LCD_LOOP_LEAD_SEC) {
            swapTo(1 - active);
          }
        }
        lcdLoopRaf = window.requestAnimationFrame(tick);
      };

      armStandby(1);
      lcdLoopRaf = window.requestAnimationFrame(tick);
    }
  async function applyLcdVideo() {
    if (videoApplied || !viewer.model) return false;
    try {
      if (typeof viewer.createVideoTexture !== "function") return false;
      const materials = viewer.model.materials || [];
      const material =
        materials.find((mat) => String(mat.name || "").toLowerCase() === "mempool") ||
        materials.find((mat) => {
          const name = String(mat.name || "").toLowerCase();
          return name.includes("mempool") || name.includes("lcd") || name.includes("screen");
        });
      if (!material) return false;

      // Dual buffered videos: start the standby clip before the active one ends so
      // the HTML5 loop seek hitch never shows on the LCD texture.
      const textureA = viewer.createVideoTexture(LCD_VIDEO_URL);
      const textureB = viewer.createVideoTexture(LCD_VIDEO_URL);
      const videoA = prepareLcdVideoEl(getVideoFromTexture(textureA));
      const videoB = prepareLcdVideoEl(getVideoFromTexture(textureB));
      lcdVideoEl = videoA || videoB || lcdVideoEl;

      if (videoA) await waitForVideoReady(videoA, 8000);
      if (videoB) await waitForVideoReady(videoB, 8000);
      if (videoA) videoA.play().catch(() => {});

      bindLcdTexture(material, textureA);
      assertMatteLcdMaterial(material);

      const slots = [
        { texture: textureA, video: videoA },
        { texture: textureB, video: videoB },
      ].filter((slot) => slot.texture);
      if (videoA && videoB) {
        startSeamlessLcdLoop(material, slots);
      } else if (videoA) {
        // Fallback: native loop if only one element is available.
        videoA.loop = true;
      }

      videoApplied = true;
      return true;
    } catch (error) {
      console.warn("Blockvase LCD video texture failed:", error);
      return false;
    }
  }

  async function bindWhenReady() {
    if (videoApplied) return;
    if (viewer.loaded && viewer.model) {
      await applyLcdVideo();
      return;
    }
    if (bindAttempts++ > 40) return;
    window.setTimeout(() => {
      bindWhenReady().catch(() => {});
    }, 250);
  }

  async function revealModelWhenReady() {
    if (overlayDismissed || revealInFlight) return;
    revealInFlight = true;
    try {
      if (!viewer.loaded || !viewer.model) return;
      await applyLcdVideo();
    } finally {
      revealInFlight = false;
      dismissModelLoadingOverlay();
    }
  }

  viewer.addEventListener("load", () => {
    setupDimensionLines();
    revealModelWhenReady().catch(() => dismissModelLoadingOverlay());
  });

  viewer.addEventListener("error", () => {
    dismissModelLoadingOverlay();
  });

  const start = () => {
    startContinuousModelSpin();
    if (viewer.loaded) {
      setupDimensionLines();
      revealModelWhenReady().catch(() => dismissModelLoadingOverlay());
    }
    bindWhenReady().catch(() => {});
  };

  if (window.customElements && customElements.whenDefined) {
    customElements.whenDefined("model-viewer").then(start).catch(start);
  } else {
    start();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    if (lcdVideoEl) {
      lcdVideoEl.play().catch(() => {});
      return;
    }
    applyLcdVideo().catch(() => {});
  });
}

function initProductStageLoop() {
  const stage = document.getElementById("productStage");
  const cta = stage?.querySelector(".product-stage__cta");
  if (!stage) return;

  const INTRO_DELAY_MS = 1000;
  const PRODUCT_PHASE_MS = 15260;
  const CTA_PHASE_MS = 5000;
  let timers = [];

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  }

  function later(fn, ms) {
    const id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function resetIntroAnimations() {
    stage.classList.remove("is-revealed");
    stage.querySelectorAll(
      ".product-stage__brand, .product-stage__spec, .product-stage__benefit"
    ).forEach((el) => {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.removeProperty("animation");
    });
  }

  function showProductPhase() {
    clearTimers();
    resetIntroAnimations();
    stage.classList.remove("is-showing-cta");
    if (cta) cta.setAttribute("aria-hidden", "true");
    later(() => {
      stage.classList.add("is-revealed");
    }, INTRO_DELAY_MS);
    later(showCtaPhase, PRODUCT_PHASE_MS);
  }

  function showCtaPhase() {
    clearTimers();
    stage.classList.add("is-showing-cta");
    if (cta) cta.setAttribute("aria-hidden", "false");
    resetIntroAnimations();
    later(showProductPhase, CTA_PHASE_MS);
  }

  showProductPhase();
}

async function init() {
  // Standalone product stage page: 3D + animated specs/CTA loop.
  if (document.body?.dataset?.portalMode === "product-stage") {
    initBlockvaseProductModel();
    initProductStageLoop();
    return;
  }
  loadDeviceName();
  captureAffiliateReferral();
  initBwModeToggle();
  const portalTabs = initPortalTabs();
  initBlockvaseProductModel();
  initBlockvaseCheckout(portalTabs);
  initBlockvaseOrderPortals(portalTabs);
  initPortalFullscreen();
  initDisplayOpenFull();
  initPortalMempoolSearch();
  initPortalSelectionGuard();
  initBlockCarousel();
  initPoolShareChart();
  initDatumPoolBoard();
  initTxDetailPanel();
  loadPrimePool().catch(function () {});
  await refreshDashboardMetrics();
  initDeferredMempoolIframe();
  startMetricsPolling();
  startPrimePoolPolling();
}

init();
