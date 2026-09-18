function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const BLOCKVASE_VIEWER_PEER_CONNECTION = "addnode=node.blockvase.com:8333";

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

function overflowScrollEscape(token) {
  const value = String(token || "");
  if (window.CSS && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

function overflowScrollSelector(el) {
  if (!el || el.nodeType !== 1) return "";
  if (el.id) return "#" + overflowScrollEscape(el.id);
  const cls = typeof el.className === "string" ? el.className.trim() : "";
  if (!cls) return el.tagName ? el.tagName.toLowerCase() : "";
  return cls
    .split(/\s+/)
    .filter(Boolean)
    .map(function (name) {
      return "." + overflowScrollEscape(name);
    })
    .join("");
}

function overflowScrollIndex(root, el) {
  const sel = overflowScrollSelector(el);
  if (!sel || !root || !root.querySelectorAll) return 0;
  try {
    const matches = root.querySelectorAll(sel);
    const idx = Array.prototype.indexOf.call(matches, el);
    return idx < 0 ? 0 : idx;
  } catch (_err) {
    return 0;
  }
}

function captureOverflowScroll(root) {
  const host = root && root.querySelectorAll ? root : document;
  const nodes = host.nodeType === 1 ? [host] : [];
  if (host.querySelectorAll) host.querySelectorAll("*").forEach(function (el) { nodes.push(el); });
  const items = [];
  nodes.forEach(function (el) {
    if (!el || el.nodeType !== 1) return;
    const top = el.scrollTop || 0;
    const left = el.scrollLeft || 0;
    if (!top && !left) return;
    items.push({
      sel: overflowScrollSelector(el),
      index: overflowScrollIndex(host, el),
      top: top,
      left: left,
    });
  });
  return items;
}

function restoreOverflowScroll(root, items) {
  if (!items || !items.length) return;
  const host = root && root.querySelectorAll ? root : document;
  function apply() {
    items.forEach(function (item) {
      if (!item || !item.sel) return;
      let el = null;
      try {
        if (item.sel.charAt(0) === "#" && host.id && "#" + overflowScrollEscape(host.id) === item.sel) {
          el = host;
        } else {
          const matches = host.querySelectorAll(item.sel);
          el = matches[item.index] || matches[0] || null;
        }
      } catch (_err) {
        el = null;
      }
      if (!el) return;
      if (item.left) el.scrollLeft = item.left;
      if (item.top) el.scrollTop = item.top;
    });
  }
  apply();
  requestAnimationFrame(apply);
}

function withOverflowScroll(root, fn) {
  const saved = captureOverflowScroll(root);
  const result = fn();
  restoreOverflowScroll(root, saved);
  return result;
}

let viewHoldPointer = null;

function rememberViewHoldPointer(target) {
  viewHoldPointer = target && target.nodeType === 1 ? target : (target && target.parentElement) || null;
}

function hasLiveSelectionIn(root) {
  const sel = window.getSelection && window.getSelection();
  if (!root || !sel || sel.isCollapsed || !sel.rangeCount) return false;
  if (!String(sel.toString() || "").replace(/\s+/g, "")) return false;
  try {
    const node = sel.getRangeAt(0).commonAncestorContainer;
    const el = node.nodeType === 1 ? node : node.parentElement;
    return !!(el && root.contains(el));
  } catch (_) {
    return false;
  }
}

function shouldHoldDom(root) {
  if (!root) return false;
  if (hasLiveSelectionIn(root)) return true;
  return !!(viewHoldPointer && root.contains(viewHoldPointer));
}

function withLiveView(root, fn) {
  if (shouldHoldDom(root)) return;
  return withOverflowScroll(root, fn);
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

const METRIC_HISTORY_KEEP = 240;
const metricHistory = {
  viewer: [],
  pool: [],
  lightning: [],
  census: [],
  loaded: false,
  loading: null,
};

function metricSparkSvg(chart, series) {
  const extra = series && series.length ? " data-metric-series=\"" + metricEscape(series.join(",")) + "\"" : "";
  return (
    '<div class="metric-spark-block">' +
    '<svg class="metric-spark' +
    (series && series.length > 1 ? " metric-spark--multi" : "") +
    '" data-metric-chart="' +
    metricEscape(chart) +
    '"' +
    extra +
    ' viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden="true"></svg>' +
    '<p class="metric-spark-range" hidden></p>' +
    "</div>"
  );
}

function mergeMetricPoint(kind, point) {
  if (!point || typeof point !== "object") return;
  const t = Number(point.t);
  if (!Number.isFinite(t) || t <= 0) return;
  const list = metricHistory[kind];
  if (!Array.isArray(list)) return;
  const next = Object.assign({}, point, { t: Math.floor(t) });
  const last = list.length ? list[list.length - 1] : null;
  if (last && last.t === next.t) {
    list[list.length - 1] = Object.assign({}, last, next);
  } else if (!last || last.t < next.t) {
    list.push(next);
  } else {
    let i = list.length - 1;
    while (i >= 0 && list[i].t > next.t) i -= 1;
    if (i >= 0 && list[i].t === next.t) list[i] = Object.assign({}, list[i], next);
    else list.splice(i + 1, 0, next);
  }
  if (list.length > METRIC_HISTORY_KEEP) list.splice(0, list.length - METRIC_HISTORY_KEEP);
}

function metricSeriesValues(kind, key) {
  const list = metricHistory[kind] || [];
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    const n = Number(list[i][key]);
    if (Number.isFinite(n)) out.push(n);
  }
  return out;
}

function metricSeriesBounds(kind, keys) {
  const list = metricHistory[kind] || [];
  let first = null;
  let last = null;
  for (let i = 0; i < list.length; i += 1) {
    const point = list[i];
    const t = Number(point.t);
    if (!Number.isFinite(t) || t <= 0) continue;
    let hit = false;
    for (let k = 0; k < keys.length; k += 1) {
      if (Number.isFinite(Number(point[keys[k]]))) {
        hit = true;
        break;
      }
    }
    if (!hit) continue;
    if (first == null) first = t;
    last = t;
  }
  return { first: first, last: last };
}

function formatMetricRange(first, last) {
  if (first == null) return "";
  const startAt = new Date(first * 1000);
  const endAt = new Date((last == null ? first : last) * 1000);
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) return "";
  const timeOpts = { hour: "numeric", minute: "2-digit" };
  const start = startAt.toLocaleTimeString(undefined, timeOpts);
  const end = endAt.toLocaleTimeString(undefined, timeOpts);
  if (last == null || Math.abs(last - first) < 60) return start;
  const sameDay =
    startAt.getFullYear() === endAt.getFullYear() &&
    startAt.getMonth() === endAt.getMonth() &&
    startAt.getDate() === endAt.getDate();
  if (sameDay) return start + " – " + end;
  return (
    startAt.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) +
    " – " +
    end
  );
}

function metricSparkPath(values, width, height, padY) {
  const w = width || 120;
  const h = height || 36;
  const pad = padY == null ? 4 : padY;
  if (!values.length) return { line: "", fill: "" };
  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);
  const span = max - min;
  const inner = Math.max(1, h - pad * 2);
  if (span <= 0) {
    const y = (h * 0.58).toFixed(2);
    return {
      line: "M0," + y + " L" + w + "," + y,
      fill: "M0," + h + " L0," + y + " L" + w + "," + y + " L" + w + "," + h + " Z",
    };
  }
  function yAt(v) {
    return pad + (1 - (v - min) / span) * inner;
  }
  const step = values.length === 1 ? 0 : w / (values.length - 1);
  const pts = values.map(function (v, i) {
    const x = values.length === 1 ? w / 2 : i * step;
    return x.toFixed(2) + "," + yAt(v).toFixed(2);
  });
  const line = "M" + pts.join(" L");
  const fill =
    "M0," +
    h +
    " L" +
    pts.join(" L") +
    " L" +
    w +
    "," +
    h +
    " Z";
  return { line: line, fill: fill };
}

function paintMetricChart(svg) {
  if (!svg || !svg.getAttribute) return;
  const spec = String(svg.getAttribute("data-metric-chart") || "");
  const parts = spec.split(".");
  const kind = parts[0];
  const key = parts.slice(1).join(".");
  const seriesAttr = String(svg.getAttribute("data-metric-series") || "");
  const keys = seriesAttr
    ? seriesAttr.split(",").map(function (s) { return s.trim(); }).filter(Boolean)
    : key ? [key] : [];
  const rangeEl = svg.parentElement && svg.parentElement.querySelector
    ? svg.parentElement.querySelector(".metric-spark-range")
    : null;
  if (!kind || !keys.length) {
    svg.innerHTML = "";
    if (rangeEl) {
      rangeEl.hidden = true;
      rangeEl.textContent = "";
    }
    return;
  }
  const gid = "sparkCopper-" + spec.replace(/[^a-z0-9]+/gi, "-");
  const fid = gid + "-fill";
  const paths = keys.map(function (seriesKey, index) {
    const values = metricSeriesValues(kind, seriesKey);
    const d = metricSparkPath(values, 120, 36, 4);
    if (!d.line) return "";
    const tone = index === 0 ? "high" : index === 1 ? "med" : "low";
    const fill =
      index === 0
        ? '<path class="metric-spark-fill" d="' + d.fill + '" fill="url(#' + fid + ')" style="fill:url(#' + fid + ')"></path>'
        : "";
    return (
      fill +
      '<path class="metric-spark-line metric-spark-line--' +
      tone +
      '" d="' +
      d.line +
      '" stroke="url(#' +
      gid +
      ')" style="stroke:url(#' +
      gid +
      ')"></path>'
    );
  }).join("");
  svg.innerHTML =
    '<defs>' +
    '<linearGradient id="' + gid + '" x1="0" y1="1" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#c46a2e"/>' +
    '<stop offset="16%" stop-color="#cc7838"/>' +
    '<stop offset="34%" stop-color="#d4894a"/>' +
    '<stop offset="52%" stop-color="#dc964e"/>' +
    '<stop offset="68%" stop-color="#e09a52"/>' +
    '<stop offset="84%" stop-color="#e4a86a"/>' +
    '<stop offset="100%" stop-color="#e8b070"/>' +
    '</linearGradient>' +
    '<linearGradient id="' + fid + '" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#e8b070" stop-opacity="0.18"/>' +
    '<stop offset="48%" stop-color="#e09a52" stop-opacity="0.08"/>' +
    '<stop offset="100%" stop-color="#c46a2e" stop-opacity="0"/>' +
    '</linearGradient>' +
    '</defs>' +
    paths;
  const bounds = metricSeriesBounds(kind, keys);
  const range = formatMetricRange(bounds.first, bounds.last);
  if (rangeEl) {
    rangeEl.textContent = range;
    rangeEl.hidden = !range;
  }
}

function paintMetricCharts(root) {
  const host = root && root.querySelectorAll ? root : document;
  host.querySelectorAll("[data-metric-chart]").forEach(paintMetricChart);
}

async function ensureMetricHistory() {
  if (metricHistory.loaded) return;
  if (metricHistory.loading) return metricHistory.loading;
  metricHistory.loading = (async function () {
    try {
      const r = await blockvaseFetchWithTimeout("/metrics-history", 8000);
      const d = await r.json();
      (d.viewer || []).forEach(function (point) {
        mergeMetricPoint("viewer", point);
      });
      (d.pool || []).forEach(function (point) {
        mergeMetricPoint("pool", point);
      });
      (d.lightning || []).forEach(function (point) {
        mergeMetricPoint("lightning", point);
      });
    } catch (_err) {
    } finally {
      metricHistory.loaded = true;
    }
  })();
  return metricHistory.loading;
}

function viewerMetricPoint(d, mining) {
  const t = Date.parse(d && (d.updated_at || d.as_of || d.updatedAt) || "") / 1000;
  return {
    t: Number.isFinite(t) ? t : Math.floor(Date.now() / 1000),
    height: Number((mining && mining.miningHeight) || (d && d.blocks) || 0) || 0,
    difficulty: Number((mining && mining.difficulty) || (d && d.difficulty) || 0) || 0,
    networkhashps: Number((mining && mining.networkhashps) || (d && d.networkhashps) || 0) || 0,
    chain_bytes: Number((d && d.size_on_disk) || 0) || 0,
    mempool_tx: Number((d && d.mempool_tx) || 0) || 0,
    mempool_bytes: Number((d && (d.mempool_size || d.mempool_bytes)) || 0) || 0,
    connections: Number((d && d.connections) || 0) || 0,
    fee_low: Number.isFinite(Number(d && d.fee_low)) ? Number(d.fee_low) : null,
    fee_medium: Number.isFinite(Number(d && d.fee_medium)) ? Number(d.fee_medium) : null,
    fee_high: Number.isFinite(Number(d && d.fee_high)) ? Number(d.fee_high) : null,
  };
}

function lightningFiniteNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function lightningMetricPoint(lightning) {
  const status = lightningObject(lightning && lightning.status) || {};
  const t = Number(lightning && lightning.updated_at);
  const publicCount =
    status.public_channels != null
      ? Array.isArray(status.public_channels)
        ? status.public_channels.length
        : status.public_channels
      : null;
  const privateCount =
    status.private_channels != null
      ? Array.isArray(status.private_channels)
        ? status.private_channels.length
        : status.private_channels
      : null;
  return {
    t: Number.isFinite(t) && t > 1e9 ? t : Math.floor(Date.now() / 1000),
    num_peers: lightningFiniteNumber(status.num_peers),
    num_active_channels: lightningFiniteNumber(status.num_active_channels),
    num_pending_channels: lightningFiniteNumber(status.num_pending_channels),
    capacity_btc: lightningFiniteNumber(status.capacity_btc),
    public_channels: lightningFiniteNumber(publicCount),
    private_channels: lightningFiniteNumber(privateCount),
  };
}

function poolMetricPoint(pool) {
  const status = datumPoolObject(pool && pool.status) || {};
  const view = datumPoolNethashView(pool) || {};
  const t = Number(pool && pool.updated_at);
  return {
    t: Number.isFinite(t) && t > 1e9 ? t : Math.floor(Date.now() / 1000),
    hashrate_hs: datumPoolFiniteNumber(status.hashrate_hs),
    datum_clients: datumPoolFiniteNumber(status.connected_datum_clients),
    sv1_clients: datumPoolFiniteNumber(status.connected_sv1_clients),
    shares: datumPoolFiniteNumber(status.shares),
    share_pct: view.poolPercent,
    datum_pct: view.datumPercent,
    sv1_pct: view.sv1Percent,
    window_pct: datumPoolWindowPct(pool),
  };
}

function metricKvHtml(rows) {
  return (
    '<dl class="metric-kv-compact">' +
    (rows || [])
      .map(function (row) {
        const v = row[1];
        const opts = row[2] && typeof row[2] === "object" ? row[2] : {};
        const vHtml =
          typeof v === "string" && v.indexOf("<") >= 0 ? v : metricEscape(String(v ?? "N/A"));
        const chart = opts.chart ? metricSparkSvg(opts.chart, opts.series) : "";
        return (
          "<dt>" +
          metricEscape(row[0]) +
          "</dt><dd>" +
          vHtml +
          "</dd>" +
          (chart ? '<div class="metric-kv-chart">' + chart + "</div>" : "")
        );
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
  const chart = opts.chart ? metricSparkSvg(opts.chart, opts.series) : "";
  const tool = opts.tool || "";
  return (
    '<div class="portal-kpi' +
    (tool ? " portal-kpi--with-tool" : "") +
    '" role="group" aria-label="' +
    metricEscape(label) +
    '">' +
    (tool ? '<div class="portal-kpi-tool">' + tool + "</div>" : "") +
    '<span class="portal-kpi-label">' +
    metricEscape(label) +
    '</span><span class="' +
    valueClasses +
    '">' +
    valueHtml +
    unitHtml +
    "</span>" +
    chart +
    "</div>"
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
    "</div>" +
    metricSparkSvg("viewer.fees", ["fee_high", "fee_medium", "fee_low"])
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

const ALPHAPOOL_TEST_TAG_RE = /(?:^|[^A-Za-z0-9])Test\s+Test(?:[^A-Za-z0-9]|$)/i;
const LAZARUS_POOL_RE = /^\/?lazarus[a-z0-9]*\/?$/i;

function isAlphaPoolTestIdentity(pool, coinbase) {
  const p = String(pool || "").trim();
  const c = String(coinbase || "").trim();
  if (p.toLowerCase() === "test") return true;
  if (c.toLowerCase() === "test") return true;
  return ALPHAPOOL_TEST_TAG_RE.test(c);
}

function isLazarusIdentity(name) {
  return LAZARUS_POOL_RE.test(String(name || "").trim());
}

function aliasPoolShareKey(key) {
  const text = String(key || "").trim();
  if (isAlphaPoolTestIdentity(text, text)) return "AlphaPool";
  if (isLazarusIdentity(text)) return "Lazarus";
  return text;
}

function poolShareRows(share, view) {
  if (!share || typeof share !== "object") return [];
  const raw = view === "tag"
    ? (share.by_tag || []).map(function (row) {
      return { key: aliasPoolShareKey(row.tag), blocks: row.blocks, pct: row.pct };
    })
    : (share.by_pool || []).map(function (row) {
      return { key: aliasPoolShareKey(row.pool), blocks: row.blocks, pct: row.pct };
    });
  const merged = {};
  raw.forEach(function (row) {
    const key = String(row.key || "");
    if (!merged[key]) merged[key] = { key: key, blocks: 0, pct: 0 };
    merged[key].blocks += Number(row.blocks) || 0;
    merged[key].pct += Number(row.pct) || 0;
  });
  return Object.keys(merged).map(function (key) { return merged[key]; })
    .sort(function (a, b) { return (Number(b.blocks) || 0) - (Number(a.blocks) || 0); });
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
  const hint = view === "tag" ? "Show blocks with this tag" : "Show blocks found by this pool";
  return (
    '<ol class="pool-share-bars" aria-label="' +
    (view === "tag" ? "Share by coinbase tag" : "Share by pool") +
    '">' +
    rows
      .map(function (row) {
        const pct = Number(row.pct);
        const width = Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0;
        const label = row.key;
        const open = poolShareKey(poolShareExpandedKey).toLowerCase() === poolShareKey(label).toLowerCase();
        return (
          '<li class="pool-share-row' +
          (open ? " is-open" : "") +
          '" data-pool-share-key="' +
          escapeHtml(label) +
          '">' +
          '<button type="button" class="pool-share-name" title="' +
          escapeHtml(hint) +
          '" aria-expanded="' +
          (open ? "true" : "false") +
          '">' +
          escapeHtml(label) +
          "</button>" +
          '<span class="pool-share-track">' +
          '<span class="pool-share-fill" style="width:' +
          width +
          '%"></span></span>' +
          '<span class="pool-share-meta">' +
          escapeHtml(formatNumber(row.blocks)) +
          " · " +
          escapeHtml(formatPoolSharePct(row.pct)) +
          "</span>" +
          '<div class="pool-share-finds"' +
          (open ? "" : " hidden") +
          "></div></li>"
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
    restorePoolShareExpandedRow();
    bindPoolShareBoard(host.querySelector(".metric-board--pool-share"));
    poolShareApplyHot(host.querySelector(".metric-board--pool-share"));
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
  if (body && nextBody) {
    withLiveView(body, function () {
      body.innerHTML = nextBody.innerHTML;
      restorePoolShareExpandedRow();
    });
  }
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
  bindPoolShareBoard(existing);
  poolShareApplyHot(existing);
}

function poolShareWindowCacheKey(share) {
  if (!share || typeof share !== "object") return "";
  return [share.start_height || "", share.end_height || "", share.window || ""].join("|");
}

function poolShareWindowBounds(share) {
  const start = Number(share && share.start_height);
  const end = Number(share && share.end_height);
  return {
    start: Number.isFinite(start) && start > 0 ? start : 0,
    end: Number.isFinite(end) && end > 0 ? end : 0,
  };
}

function poolShareBlockInWindow(height, share) {
  const h = Number(height) || 0;
  if (!h) return false;
  const bounds = poolShareWindowBounds(share);
  if (bounds.start && h < bounds.start) return false;
  if (bounds.end && h > bounds.end) return false;
  return true;
}

function poolShareNormalizeBlock(block) {
  const height = Number(block && block.height) || 0;
  if (!height) return null;
  const labels = blockLabelFromSource(block);
  return {
    height: height,
    hash: block.hash || block.id || "",
    timestamp: Number(block.timestamp || block.time) || 0,
    tx_count: Number(block.tx_count || block.nTx) || 0,
    size: Number(block.size) || 0,
    pool: labels.pool || block.pool || "",
    coinbase_tag: labels.coinbase || block.coinbase_tag || block.coinbase || "",
  };
}

function poolShareWindowBlocksFromCarousel(share) {
  const out = [];
  (blockCarouselState.items || []).forEach(function (item) {
    if (!item || item.mining || !poolShareBlockInWindow(item.height, share)) return;
    const normalized = poolShareNormalizeBlock({
      height: item.height,
      hash: item.hash,
      timestamp: item.timestamp,
      tx_count: item.txCount,
      size: item.size,
      pool: item.pool,
      coinbase_tag: item.coinbase,
    });
    if (normalized) out.push(normalized);
  });
  return out;
}

function poolShareBlockMatches(block, key, view) {
  const want = poolShareKey(key).toLowerCase();
  if (!want || !block) return false;
  const labels = blockLabelFromSource(block);
  const value = view === "tag" ? (labels.coinbase || block.coinbase_tag || "") : (labels.pool || block.pool || "");
  const aliased = aliasPoolShareKey(value).toLowerCase();
  const raw = String(value || "").trim().toLowerCase();
  return aliased === want || raw === want;
}

function poolShareFindsHtml(blocks) {
  if (!blocks.length) {
    return '<p class="pool-share-finds__empty muted-note">No labeled blocks in this window yet.</p>';
  }
  const selected = String(blockCarouselState.selected || "");
  return (
    '<div class="pool-share-finds__track" role="list">' +
    blocks
      .map(function (block) {
        const time = block.timestamp ? formatTimeAgo(block.timestamp) : "";
        const txs = Number(block.tx_count) || 0;
        const key = String(block.height);
        return (
          '<button type="button" class="pool-share-find block-carousel__item block-carousel__item--mined' +
          (selected === key ? " is-selected" : "") +
          '" role="listitem" data-key="' +
          escapeHtml(key) +
          '" data-height="' +
          escapeHtml(key) +
          '"' +
          (block.hash ? ' data-hash="' + escapeHtml(block.hash) + '"' : "") +
          ">" +
          '<span class="block-carousel__height">#' +
          formatNumber(block.height) +
          "</span>" +
          '<span class="block-carousel__meta">' +
          (time ? "<span>" + escapeHtml(time) + "</span>" : "") +
          "</span>" +
          '<span class="block-carousel__stats">' +
          (txs ? "<span>" + escapeHtml(formatNumber(txs)) + " tx</span>" : "") +
          "</span></button>"
        );
      })
      .join("") +
    "</div>"
  );
}

function syncPoolShareFindSelection() {
  const key = String(blockCarouselState.selected || "");
  document.querySelectorAll(".pool-share-find").forEach(function (el) {
    el.classList.toggle("is-selected", el.getAttribute("data-height") === key);
  });
}

function mergePoolShareWindowBlocks(share, incoming) {
  const byHeight = {};
  poolShareWindowBlocksFromCarousel(share).forEach(function (block) {
    byHeight[block.height] = block;
  });
  (incoming || []).forEach(function (raw) {
    if (!poolShareBlockInWindow(raw && raw.height, share)) return;
    const block = poolShareNormalizeBlock(raw);
    if (!block) return;
    const prev = byHeight[block.height];
    byHeight[block.height] = prev
      ? {
        height: block.height,
        hash: block.hash || prev.hash,
        timestamp: block.timestamp || prev.timestamp,
        tx_count: block.tx_count || prev.tx_count,
        size: block.size || prev.size,
        pool: block.pool || prev.pool,
        coinbase_tag: block.coinbase_tag || prev.coinbase_tag,
      }
      : block;
  });
  return Object.keys(byHeight)
    .map(function (height) { return byHeight[height]; })
    .sort(function (a, b) { return (Number(b.height) || 0) - (Number(a.height) || 0); });
}

function loadPoolShareWindowBlocks(share) {
  const key = poolShareWindowCacheKey(share);
  if (!key) return Promise.resolve([]);
  if (poolShareFindsCache.key === key && poolShareFindsCache.blocks) {
    return Promise.resolve(poolShareFindsCache.blocks);
  }
  if (poolShareFindsCache.key === key && poolShareFindsCache.promise) {
    return poolShareFindsCache.promise;
  }
  const bounds = poolShareWindowBounds(share);
  const windowSize = Number(share.window) || 120;
  const limit = Math.min(120, Math.max(1, windowSize));
  const before = bounds.end ? String(bounds.end + 1) : "";
  const url = "/recent-blocks?limit=" + limit + (before ? "&before=" + encodeURIComponent(before) : "");
  const promise = blockvaseFetchWithTimeout(url, 8000)
    .then(function (response) { return response.json(); })
    .then(function (data) {
      const blocks = mergePoolShareWindowBlocks(share, Array.isArray(data.blocks) ? data.blocks : []);
      poolShareFindsCache = { key: key, blocks: blocks, promise: null };
      return blocks;
    })
    .catch(function (err) {
      if (poolShareFindsCache.promise === promise) poolShareFindsCache.promise = null;
      throw err;
    });
  poolShareFindsCache = {
    key: key,
    blocks: poolShareFindsCache.key === key ? poolShareFindsCache.blocks : null,
    promise: promise,
  };
  return promise;
}

function setPoolShareRowOpen(row, open) {
  if (!row) return;
  row.classList.toggle("is-open", !!open);
  const name = row.querySelector(".pool-share-name");
  if (name) name.setAttribute("aria-expanded", open ? "true" : "false");
  const host = row.querySelector(".pool-share-finds");
  if (host) host.hidden = !open;
}

function collapsePoolShareRows(exceptRow) {
  document.querySelectorAll(".metric-board--pool-share .pool-share-row.is-open").forEach(function (row) {
    if (exceptRow && row === exceptRow) return;
    setPoolShareRowOpen(row, false);
  });
}

function fillPoolShareFinds(row, key) {
  const host = row && row.querySelector(".pool-share-finds");
  if (!host || !lastPoolShare) return;
  const view = poolShareView === "tag" ? "tag" : "pool";
  const match = function (block) { return poolShareBlockMatches(block, key, view); };
  const cached = poolShareFindsCache.key === poolShareWindowCacheKey(lastPoolShare) && poolShareFindsCache.blocks;
  host.hidden = false;
  if (shouldHoldDom(host)) return;
  if (cached) {
    host.innerHTML = poolShareFindsHtml(cached.filter(match));
    return;
  }
  const preview = mergePoolShareWindowBlocks(lastPoolShare, []).filter(match);
  host.innerHTML = preview.length
    ? poolShareFindsHtml(preview)
    : '<p class="pool-share-finds__empty muted-note">Loading…</p>';
  loadPoolShareWindowBlocks(lastPoolShare)
    .then(function (blocks) {
      if (poolShareExpandedKey !== key || !row.isConnected) return;
      if (shouldHoldDom(host)) return;
      host.innerHTML = poolShareFindsHtml(blocks.filter(match));
    })
    .catch(function () {
      if (poolShareExpandedKey !== key || !row.isConnected) return;
      if (preview.length) return;
      host.innerHTML = '<p class="pool-share-finds__empty muted-note">Could not load those blocks.</p>';
    });
}

function expandPoolShareRow(row) {
  if (!row) return;
  const key = poolShareKey(row.getAttribute("data-pool-share-key"));
  if (!key) return;
  collapsePoolShareRows(row);
  poolShareExpandedKey = key;
  setPoolShareRowOpen(row, true);
  const board = row.closest(".metric-board--pool-share");
  if (board) poolShareApplyHot(board);
  fillPoolShareFinds(row, key);
}

function restorePoolShareExpandedRow() {
  const board = document.querySelector(".metric-board--pool-share");
  if (!board || !poolShareExpandedKey) return;
  const want = poolShareKey(poolShareExpandedKey).toLowerCase();
  let row = null;
  board.querySelectorAll(".pool-share-row").forEach(function (el) {
    if (poolShareKey(el.getAttribute("data-pool-share-key")).toLowerCase() === want) row = el;
  });
  if (!row) {
    poolShareExpandedKey = "";
    return;
  }
  expandPoolShareRow(row);
}

function togglePoolShareFinds(nameBtn) {
  const row = nameBtn && nameBtn.closest(".pool-share-row");
  if (!row) return;
  const key = poolShareKey(row.getAttribute("data-pool-share-key"));
  if (row.classList.contains("is-open") && poolShareKey(poolShareExpandedKey).toLowerCase() === key.toLowerCase()) {
    poolShareExpandedKey = "";
    setPoolShareRowOpen(row, false);
    const board = row.closest(".metric-board--pool-share");
    if (board) poolShareMarkHot(board, "");
    return;
  }
  expandPoolShareRow(row);
}

function poolShareFindSelectionIn(btn) {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return false;
  if (!String(sel.toString() || "").trim()) return false;
  try {
    const node = sel.getRangeAt(0).commonAncestorContainer;
    const el = node.nodeType === 1 ? node : node.parentElement;
    return !!(el && btn && btn.contains(el));
  } catch (_) {
    return false;
  }
}

function selectPoolShareFindHeight(btn) {
  const height = btn && btn.querySelector(".block-carousel__height");
  if (!height) return;
  const range = document.createRange();
  range.selectNodeContents(height);
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}

function cancelOpenPoolShareFind() {
  if (!openPoolShareFind._timer) return;
  clearTimeout(openPoolShareFind._timer);
  openPoolShareFind._timer = 0;
}

function scheduleOpenPoolShareFind(btn) {
  cancelOpenPoolShareFind();
  openPoolShareFind._timer = setTimeout(function () {
    openPoolShareFind._timer = 0;
    if (poolShareFindSelectionIn(btn)) return;
    openPoolShareFind(btn);
  }, 280);
}

function openPoolShareFind(btn) {
  const height = Number(btn && btn.getAttribute("data-height"));
  const hash = (btn && btn.getAttribute("data-hash")) || "";
  if (!Number.isFinite(height) || height <= 0) return;
  const cached = (poolShareFindsCache.blocks || []).find(function (block) {
    return Number(block.height) === height;
  });
  ensureCarouselRangeForHeight(height, hash || (cached && cached.hash) || "");
  if (cached) applyCarouselBlockMeta(cached);
  selectBlockCarouselItem(String(height), { hydrateNeighbors: true });
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

function poolShareApplyHot(board) {
  if (!board) return;
  poolShareMarkHot(board, board.open ? poolShareExpandedKey : "");
}

function poolShareSyncOpen(board) {
  if (!board) return;
  poolShareOpen = !!board.open;
  poolShareApplyHot(board);
}

function bindPoolShareBoard(board) {
  if (!board || board._poolShareHotBound) return;
  board._poolShareHotBound = true;
  board.addEventListener("toggle", function () {
    poolShareSyncOpen(board);
  });
  new MutationObserver(function () {
    poolShareSyncOpen(board);
  }).observe(board, { attributes: true, attributeFilter: ["open"] });
}

function initPoolShareChart() {
  const host = document.getElementById("metrics");
  if (!host || host._poolShareBound) return;
  host._poolShareBound = true;
  host.addEventListener(
    "toggle",
    function (e) {
      const board = e.target;
      if (!board || !board.classList || !board.classList.contains("metric-board--pool-share")) return;
      if (!board.isConnected) return;
      poolShareSyncOpen(board);
    },
    true
  );
  host.addEventListener("pointerdown", function (e) {
    const findBtn = e.target.closest(".pool-share-find");
    if (!findBtn || !host.contains(findBtn)) return;
    poolShareFindPointer = { x: e.clientX, y: e.clientY, moved: false };
  });
  host.addEventListener("pointermove", function (e) {
    if (!poolShareFindPointer || poolShareFindPointer.moved) return;
    const dx = e.clientX - poolShareFindPointer.x;
    const dy = e.clientY - poolShareFindPointer.y;
    if (dx * dx + dy * dy > 25) poolShareFindPointer.moved = true;
  });
  host.addEventListener("dblclick", function (e) {
    const findBtn = e.target.closest(".pool-share-find");
    if (!findBtn || !host.contains(findBtn)) return;
    e.preventDefault();
    e.stopPropagation();
    cancelOpenPoolShareFind();
    selectPoolShareFindHeight(findBtn);
  });
  host.addEventListener("click", function (e) {
    const summary = e.target.closest(".pool-share-summary");
    if (summary && host.contains(summary)) {
      const board = summary.closest(".metric-board--pool-share");
      queueMicrotask(function () {
        poolShareSyncOpen(board);
      });
    }
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
    const findBtn = e.target.closest(".pool-share-find");
    if (findBtn && host.contains(findBtn)) {
      e.stopPropagation();
      if (
        e.detail > 1 ||
        poolShareFindSelectionIn(findBtn) ||
        (poolShareFindPointer && poolShareFindPointer.moved)
      ) {
        e.preventDefault();
        cancelOpenPoolShareFind();
        return;
      }
      e.preventDefault();
      if (e.target.closest(".block-carousel__height")) {
        scheduleOpenPoolShareFind(findBtn);
        return;
      }
      openPoolShareFind(findBtn);
      return;
    }
    const nameBtn = e.target.closest(".pool-share-name");
    if (nameBtn && host.contains(nameBtn)) {
      e.preventDefault();
      e.stopPropagation();
      togglePoolShareFinds(nameBtn);
      return;
    }
    const btn = e.target.closest("[data-pool-share-view]");
    if (!btn || !host.contains(btn)) return;
    e.preventDefault();
    e.stopPropagation();
    const next = btn.getAttribute("data-pool-share-view") === "tag" ? "tag" : "pool";
    if (next === poolShareView) return;
    poolShareView = next;
    poolShareExpandedKey = "";
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
    if (poolShareExpandedKey) {
      poolShareApplyHot(board);
      return;
    }
    poolShareMarkHot(board, row.getAttribute("data-pool-share-key"));
  });
  host.addEventListener("pointerout", function (e) {
    const row = e.target.closest(".pool-share-row");
    if (!row || !host.contains(row)) return;
    const next = e.relatedTarget;
    if (next && row.contains(next)) return;
    if (next && next.closest && next.closest(".pool-share-row")) return;
    const board = row.closest(".metric-board--pool-share");
    if (board) poolShareApplyHot(board);
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
let datumPoolLoadSettled = false;
let poolShareView = "pool";
let poolShareOpen = false;
let poolShareExpandedKey = "";
let poolShareFindsCache = { key: "", blocks: null, promise: null };
let poolShareFindPointer = null;
const DATUM_POOL_NOTE =
  "Do not point public ASIC firmware at the DATUM port.";
const DATUM_POOL_SOURCE_FALLBACK = "http://pool.blockvase.com:28916/";
const DATUM_POOL_PRIVATE_PORTS = { 7152: 1, 7153: 1, 8332: 1, 23334: 1, 28916: 1, 28917: 1, 28918: 1 };

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

function datumPoolPortNumber(value) {
  const port = Number(value);
  return Number.isFinite(port) && port > 0 ? port : null;
}

function datumPoolPrivatePort(port) {
  return !!DATUM_POOL_PRIVATE_PORTS[port];
}

function datumPoolHostPort(value, allowedPorts) {
  const text = String(value || "").trim();
  if (!text) return null;
  let host = "";
  let port = null;
  try {
    const parsed = new URL(text.replace(/^stratum\+tcp:/i, "http:"));
    host = String(parsed.hostname || "").trim();
    port = datumPoolPortNumber(parsed.port);
  } catch (_err) {
    const cleaned = text.replace(/^[a-z0-9+]+:\/\//i, "");
    const cut = cleaned.split("/")[0] || "";
    const colon = cut.lastIndexOf(":");
    if (colon > 0) {
      host = cut.slice(0, colon).trim();
      port = datumPoolPortNumber(cut.slice(colon + 1));
    } else {
      host = cut.trim();
    }
  }
  if (!host || datumPoolPrivatePort(port)) return null;
  if (allowedPorts && allowedPorts.length && (port == null || allowedPorts.indexOf(port) === -1)) return null;
  return { host: host, port: port };
}

function datumPoolEndpoints(pool, kind) {
  const rows = Array.isArray(pool && pool.endpoints) ? pool.endpoints : [];
  const want = String(kind || "").toLowerCase();
  return rows.filter(function (row) {
    return row && typeof row === "object" && String(row.kind || "").toLowerCase() === want;
  });
}

function datumPoolEndpoint(pool) {
  const links = datumPoolObject(pool.links) || {};
  const info = datumPoolObject(pool.pool) || {};
  const ep = datumPoolEndpoints(pool, "datum")[0] || {};
  const parsed = datumPoolHostPort(links.datum_endpoint, [28915]) ||
    datumPoolHostPort(ep.url || ep.endpoint || ep.host, [28915]);
  const host = String((parsed && parsed.host) || info.datum_host || "").trim();
  const port = datumPoolPortNumber((parsed && parsed.port) != null ? parsed.port : info.datum_port) || 28915;
  if (!host || port !== 28915 || datumPoolPrivatePort(port)) return "";
  return host + ":" + String(port);
}

function datumPoolStratumConnect(pool) {
  const links = datumPoolObject(pool.links) || {};
  const info = datumPoolObject(pool.pool) || {};
  const ep = datumPoolEndpoints(pool, "stratum_v1")[0] || {};
  const rawUrl = String(info.stratum_v1_url || links.stratum_v1 || ep.url || ep.endpoint || "").trim();
  const parsed = datumPoolHostPort(rawUrl, [3333]);
  const host = String((parsed && parsed.host) || info.stratum_v1_host || ep.host || "").trim();
  const port = datumPoolPortNumber((parsed && parsed.port) != null ? parsed.port : (info.stratum_v1_port != null ? info.stratum_v1_port : ep.port));
  const present = !!(rawUrl || info.stratum_v1_url || info.stratum_v1_host || links.stratum_v1 || ep.kind);
  if (!present || !host || port !== 3333 || datumPoolPrivatePort(port)) return null;
  return {
    url: rawUrl && parsed ? rawUrl : "stratum+tcp://" + host + ":3333",
    host: host,
    port: 3333,
    username: "your Bitcoin address (optional .worker)",
    password: "any value (required)",
    pow: (!info.stratum_v1_pow || String(info.stratum_v1_pow).trim().toLowerCase() === "blake2b")
      ? "BLAKE2b"
      : String(info.stratum_v1_pow).trim(),
  };
}

function datumPoolPublicSourceHref(raw) {
  const text = String(raw || "").trim() || DATUM_POOL_SOURCE_FALLBACK;
  try {
    const parsed = new URL(text);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    const port = datumPoolPortNumber(parsed.port);
    if (port != null && port !== 28916 && datumPoolPrivatePort(port)) return "";
    if (parsed.hostname === "pool.blockvase.com" && (port === 28916 || parsed.href === DATUM_POOL_SOURCE_FALLBACK)) {
      return "http://pool.blockvase.com:28916/";
    }
    if (port === 28916) return parsed.href;
    if (port != null && datumPoolPrivatePort(port)) return "";
    return parsed.href;
  } catch (_err) {
    return "";
  }
}

function datumPoolSourceUrl(pool) {
  const links = datumPoolObject(pool.links) || {};
  const info = datumPoolObject(pool.pool) || {};
  return datumPoolPublicSourceHref(links.source || info.source_url || DATUM_POOL_SOURCE_FALLBACK);
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

function formatNethashSharePercent(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return "N/A";
  const abs = Math.abs(value);
  const digits = abs >= 10 ? 1 : abs >= 1 ? 2 : abs >= 0.1 ? 2 : 3;
  return formatDatumPercent(value, digits);
}

const NETHASH_SHARE_NOTE =
  "At the cap, newest public miners disconnect first. DATUM is not kicked.";

function datumPoolFiniteNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function datumPoolFlag(value) {
  if (value === false || value === "false" || value === 0 || value === "0") return false;
  if (value === true || value === "true" || value === 1 || value === "1") return true;
  return null;
}

function datumPoolNethashView(pool) {
  if (!datumPoolUsable(pool)) return null;
  const nethash = datumPoolObject(pool.nethash) || {};
  const status = datumPoolObject(pool.status) || {};
  const hasNethash = Object.keys(nethash).length > 0;
  const hasStatusExtras =
    status.network_share_percent != null ||
    status.nethash_cap_percent != null ||
    status.nethash_blocks != null ||
    status.sv1_admit != null ||
    status.public_open != null;
  if (!hasNethash && !hasStatusExtras) return null;

  const networkHs = datumPoolFiniteNumber(nethash.network_hs);
  const showPercents = networkHs != null && networkHs > 0;
  const poolHs = datumPoolFiniteNumber(nethash.pool_hs);
  const datumHs = datumPoolFiniteNumber(nethash.datum_hs);
  const sv1Hs = datumPoolFiniteNumber(nethash.sv1_hs);

  let poolPercent = datumPoolFiniteNumber(nethash.pool_percent);
  if (poolPercent == null) {
    const frac = datumPoolFiniteNumber(nethash.pool_fraction);
    poolPercent = frac != null ? frac * 100 : datumPoolFiniteNumber(status.network_share_percent);
  }
  if (poolPercent == null && showPercents) poolPercent = 0;

  let capPercent = datumPoolFiniteNumber(nethash.cap_percent);
  if (capPercent == null) {
    const capFrac = datumPoolFiniteNumber(nethash.cap_fraction);
    capPercent = capFrac != null ? capFrac * 100 : datumPoolFiniteNumber(status.nethash_cap_percent);
  }
  if (capPercent == null || capPercent <= 0) capPercent = 25;

  let remainingPercent = datumPoolFiniteNumber(nethash.remaining_percent);
  if (remainingPercent == null && poolPercent != null) {
    remainingPercent = Math.max(0, capPercent - poolPercent);
  }

  let datumPercent = datumPoolFiniteNumber(nethash.datum_percent);
  if (datumPercent == null) {
    const frac = datumPoolFiniteNumber(nethash.datum_fraction);
    if (frac != null) datumPercent = frac * 100;
    else if (poolHs != null && poolHs > 0 && datumHs != null) datumPercent = (datumHs / poolHs) * 100;
    else if (showPercents && datumHs != null) datumPercent = (datumHs / networkHs) * 100;
  }

  let sv1Percent = datumPoolFiniteNumber(nethash.sv1_percent);
  if (sv1Percent == null) {
    const frac = datumPoolFiniteNumber(nethash.sv1_fraction);
    if (frac != null) sv1Percent = frac * 100;
    else if (poolHs != null && poolHs > 0 && sv1Hs != null) sv1Percent = (sv1Hs / poolHs) * 100;
    else if (showPercents && sv1Hs != null) sv1Percent = (sv1Hs / networkHs) * 100;
  }

  let publicOpen = datumPoolFlag(nethash.public_open);
  if (publicOpen == null) publicOpen = datumPoolFlag(status.public_open);
  if (publicOpen == null) {
    const admit = datumPoolFlag(nethash.sv1_admit);
    publicOpen = admit != null ? admit : datumPoolFlag(status.sv1_admit) !== false;
  }

  const blocks = datumPoolFiniteNumber(nethash.blocks) || datumPoolFiniteNumber(status.nethash_blocks) || 120;
  const meaning = NETHASH_SHARE_NOTE;
  const fill = showPercents && poolPercent != null && capPercent > 0
    ? Math.max(0, Math.min(100, (poolPercent / capPercent) * 100))
    : null;

  return {
    blocks: blocks,
    showPercents: showPercents,
    poolPercent: poolPercent,
    capPercent: capPercent,
    remainingPercent: remainingPercent,
    datumPercent: datumPercent,
    sv1Percent: sv1Percent,
    publicOpen: publicOpen !== false,
    poolHs: poolHs,
    networkHs: networkHs,
    fill: fill,
    meaning: meaning,
  };
}

function datumPoolFactValue(text, unit, highlight) {
  let html = highlight
    ? '<span class="highlight">' + escapeHtml(text) + "</span>"
    : escapeHtml(text);
  if (unit) html += ' <span class="portal-kv-unit">' + escapeHtml(unit) + "</span>";
  return html;
}

function datumPoolMetricsHtml(pool) {
  const status = datumPoolObject(pool && pool.status) || {};
  const view = datumPoolNethashView(pool);
  const poolCluster = metricClusterHtml(
    "Pool",
    metricKvHtml([
      [
        "Blocks",
        datumPoolFactValue(
          formatNumber(Number(status.blocks_found) || 0) +
            " / " +
            formatNumber(datumPoolEmptyCount(pool, "empty_finds")) +
            " / " +
            formatNumber(datumPoolEmptyCount(pool, "empty_unsettled")),
          "found / empty / unsettled"
        ),
      ],
      [
        "Hashrate",
        datumPoolFactValue(
          formatDatumHashrate(status.hashrate_hs),
          datumPoolHashrateWindowLabel(pool),
          true
        ),
        { chart: "pool.hashrate_hs" },
      ],
      [
        "DATUM clients",
        formatNumber(Number(status.connected_datum_clients) || 0),
        { chart: "pool.datum_clients" },
      ],
      [
        "SV1 clients",
        formatNumber(Number(status.connected_sv1_clients) || 0),
        { chart: "pool.sv1_clients" },
      ],
      ["Shares", formatNumber(Number(status.shares) || 0), { chart: "pool.shares" }],
    ])
  );
  let shareCluster = "";
  if (view) {
    const rates = [];
    if (view.poolHs != null && view.poolHs > 0) rates.push(formatDatumHashrate(view.poolHs));
    if (view.networkHs != null && view.networkHs > 0) rates.push(formatDatumHashrate(view.networkHs));
    shareCluster = metricClusterHtml(
      "Network share (last " + String(view.blocks) + " blocks)",
      metricKvHtml([
        [
          "Cap",
          formatDatumPercent(view.capPercent, Number.isInteger(view.capPercent) ? 0 : 1),
        ],
        ["Pool / network", rates.length ? rates.join(" / ") : "N/A"],
        [
          "Share",
          datumPoolFactValue(
            view.showPercents ? formatNethashSharePercent(view.poolPercent) : "N/A",
            "",
            true
          ),
          { chart: "pool.share_pct" },
        ],
        [
          "DATUM",
          view.showPercents && view.datumPercent != null
            ? formatNethashSharePercent(view.datumPercent)
            : "N/A",
          { chart: "pool.datum_pct" },
        ],
        [
          "Stratum",
          view.showPercents && view.sv1Percent != null
            ? formatNethashSharePercent(view.sv1Percent)
            : "N/A",
          { chart: "pool.sv1_pct" },
        ],
      ])
    );
  }
  return (
    '<div class="datum-pool-metrics">' +
    '<div class="metric-cluster-grid datum-pool-metrics__grid">' +
    poolCluster +
    shareCluster +
    "</div>" +
    datumPoolWindowBarHtml(pool) +
    '<p class="datum-pool-miners__hint">' +
    escapeHtml(NETHASH_SHARE_NOTE) +
    "</p></div>"
  );
}

function datumPoolWindowBarHtml(pool) {
  const status = datumPoolObject(pool && pool.status) || {};
  const window = datumPoolObject(pool && pool.window) || {};
  const progress = datumPoolWindowPct(pool);
  const progressWidth = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
  return (
    '<div class="datum-pool-progress portal-retarget-bar pool-share-retarget">' +
    '<div class="portal-retarget-head">' +
    '<span class="portal-retarget-label">Window</span>' +
    '<span class="portal-retarget-meta">' +
    escapeHtml(formatDatumPercent(progress)) +
    " of target · " +
    escapeHtml(formatDatumWork(window.current_work != null ? window.current_work : status.work)) +
    " / " +
    escapeHtml(formatDatumWork(window.target_work != null ? window.target_work : status.window)) +
    (window.description ? " · " + escapeHtml(String(window.description)) : "") +
    "</span></div>" +
    '<div class="portal-retarget-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
    escapeHtml(String(progressWidth)) +
    '" aria-label="Pool work window fill">' +
    '<div class="portal-retarget-fill" style="width:' +
    progressWidth +
    '%"></div></div></div>'
  );
}

function formatDatumBps(bps, fallback) {
  const value = Number(bps);
  if (!Number.isFinite(value)) return fallback;
  return formatDatumPercent(value / 100, Math.abs(value) >= 100 ? 1 : 2);
}

function datumPoolHashrateWindowLabel(pool) {
  const sec = Number((datumPoolObject(pool && pool.status) || {}).hashrate_window_sec);
  if (!Number.isFinite(sec) || sec <= 0 || sec === 10800) return "3h avg";
  if (sec % 3600 === 0) return String(sec / 3600) + "h avg";
  if (sec % 60 === 0) return String(sec / 60) + "m avg";
  return String(sec) + "s avg";
}

function datumPoolMinerKindLabel(row) {
  const raw = String(row && row.kind || "").trim().toLowerCase();
  if (raw === "sv1" || raw === "stratum_v1" || raw === "stratum") return "SV1";
  if (raw === "mixed") return "Mixed";
  if (raw === "datum") return "DATUM";
  return raw ? raw.toUpperCase() : "—";
}

function datumPoolDatumFeeNote(info) {
  const fee = formatDatumBps(
    info.fee_after_first_block_bps != null ? info.fee_after_first_block_bps : info.fee_bps,
    "0.21%"
  );
  return "DATUM fee of " + fee + ".";
}

function datumPoolStratumFeeNote(info) {
  const fee = formatDatumBps(info.stratum_v1_fee_bps, "2.3%");
  const rebate = formatDatumBps(info.stratum_v1_datum_rebate_bps, "2%");
  const leftover = formatDatumBps(info.stratum_v1_operator_bps, "0.3%");
  return (
    "Public Stratum pays " +
    fee +
    " of the Stratum share of a found block: " +
    rebate +
    " of that slice is rebated to DATUM miners, " +
    leftover +
    " remainder goes to the pool. Public SV1 at pool.blockvase.com:3333; " +
    fee +
    "."
  );
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
    return '<p class="datum-pool-miner--empty">No identities in the split yet. DATUM and Stratum identities appear after their first accepted share.</p>';
  }
  return (
    '<div class="datum-pool-table-wrap">' +
    '<table class="datum-pool-table">' +
    '<thead><tr>' +
    '<th scope="col">Rank</th>' +
    '<th scope="col">Username</th>' +
    '<th scope="col">Kind</th>' +
    '<th scope="col">Window work</th>' +
    '<th scope="col">Window %</th>' +
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
          '<td class="datum-pool-table__kind">' +
          escapeHtml(datumPoolMinerKindLabel(row)) +
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
  if (kind === "hint") {
    return (
      '<div class="datum-pool-copy datum-pool-copy--static">' +
      '<span class="datum-pool-copy__label">' +
      escapeHtml(label) +
      "</span>" +
      '<span class="datum-pool-copy__value">' +
      escapeHtml(text) +
      "</span></div>"
    );
  }
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

function portalBoardStatusHtml(message) {
  return '<div class="loading pulse">' + escapeHtml(message || "Loading data...") + "</div>";
}

function datumPoolUnavailableHtml() {
  if (!datumPoolLoadSettled) return portalBoardStatusHtml("Loading data...");
  return portalBoardStatusHtml("Pool status is unavailable.");
}

function datumPoolMinDifficulty(pool) {
  const status = datumPoolObject(pool && pool.status) || {};
  const raw = status.min_difficulty != null ? status.min_difficulty : pool && pool.min_difficulty;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function datumPoolConnectCardsHtml(pool, info) {
  const endpoint = datumPoolEndpoint(pool);
  const pubkey = String(info.pool_pubkey || "").trim();
  const stratum = datumPoolStratumConnect(pool);
  const minDiff = datumPoolMinDifficulty(pool);
  const minDiffHtml = minDiff != null ? datumPoolCopyControl("Min difficulty", String(minDiff), "hint") : "";
  const datumCard =
    '<article class="datum-pool-card">' +
    '<h3 class="datum-pool-card__title">DATUM</h3>' +
    '<p class="datum-pool-card__note">' +
    escapeHtml(datumPoolDatumFeeNote(info) + " " + DATUM_POOL_NOTE) +
    "</p>" +
    datumPoolCopyControl("DATUM", endpoint) +
    datumPoolCopyControl("Pool pubkey", pubkey, "hex") +
    minDiffHtml +
    "</article>";
  const stratumCard = stratum
    ? '<article class="datum-pool-card">' +
      '<h3 class="datum-pool-card__title">Stratum V1</h3>' +
      '<p class="datum-pool-card__note">' +
      escapeHtml(datumPoolStratumFeeNote(info)) +
      "</p>" +
      datumPoolCopyControl("Stratum V1", stratum.url) +
      datumPoolCopyControl("User", stratum.username, "hint") +
      datumPoolCopyControl("Pass", stratum.password, "hint") +
      datumPoolCopyControl("Algo", stratum.pow || "BLAKE2b", "hint") +
      minDiffHtml +
      "</article>"
    : "";
  return '<div class="datum-pool-connect-grid">' + datumCard + stratumCard + "</div>";
}

const DATUM_POOL_EMPTY_NOTE =
  "Empty (subsidy-only) finds freeze the share window and pay that snapshot after 100 confirmations. Fees from the find, not today's live fee: DATUM 0.21%; SV1 2.3% of the Stratum share (2% rebated to DATUM miners, 0.3% remainder to the pool); top 128; 546 sat floor.";
const DATUM_POOL_FINDS_NOTE =
  "Coinbase splits from pool-found blocks. Paid in the find itself. DATUM 0.21%; SV1 2.3% of the Stratum share (2% rebated to DATUM miners, 0.3% remainder to the pool); top 128; 546 sat floor.";
const DATUM_POOL_EMPTY_PATH = "/api/empty";
const DATUM_POOL_FINDS_PATH = "/api/finds";
let lastEmptyFindsDoc = null;
let lastEmptyFindsKey = "";
let lastFindsDoc = null;
let lastFindsKey = "";
let datumPoolMinersView = "window";

function datumPoolEmptyCount(pool, key) {
  const status = datumPoolObject(pool && pool.status) || {};
  const n = Number(status[key] != null ? status[key] : pool && pool[key]);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function datumPoolEmptyLink(pool) {
  const links = datumPoolObject(pool && pool.links) || {};
  const raw = String(links.empty || DATUM_POOL_EMPTY_PATH).trim();
  if (!raw || raw.indexOf("28917") !== -1 || raw === "/empty.json") return DATUM_POOL_EMPTY_PATH;
  return raw;
}

function datumPoolEmptyPayoutMap(find) {
  const map = {};
  (find && Array.isArray(find.payouts) ? find.payouts : []).forEach(function (row) {
    const id = datumPoolMinerId(row);
    if (id) map[id] = row.sats;
  });
  return map;
}

function datumPoolFindHasWindowWork(find) {
  const miners = Array.isArray(find && find.miners) ? find.miners : [];
  return miners.some(function (row) {
    return (
      Number(row && row.work) > 0 ||
      Number(row && row.datum_work) > 0 ||
      Number(row && row.public_work) > 0
    );
  });
}

function datumPoolFindsNeedRefresh(doc) {
  const finds = doc && Array.isArray(doc.finds) ? doc.finds : [];
  if (!finds.length) return true;
  return finds.some(function (find) {
    const miners = Array.isArray(find && find.miners) ? find.miners : [];
    return miners.length > 0 && !datumPoolFindHasWindowWork(find);
  });
}

function datumPoolHistoryReady(pool) {
  const found = datumPoolEmptyCount(pool, "blocks_found");
  if (found <= 0) return true;
  const finds = lastFindsDoc && Array.isArray(lastFindsDoc.finds) ? lastFindsDoc.finds : [];
  return finds.length > 0 && !datumPoolFindsNeedRefresh(lastFindsDoc);
}

function datumPoolFindPayoutHref(find) {
  const txid = normalizeTxid(
    find && (find.txid || find.coinbase_txid || find.coinbase_tx || find.coinbase)
  );
  return txid ? viewerTxLocationHash(txid) : "";
}

function datumPoolFindPayoutCellHtml(find, sats) {
  const text = sats == null ? "—" : formatNumber(Number(sats) || 0) + " sats";
  const href = sats == null ? "" : datumPoolFindPayoutHref(find);
  if (!href) return escapeHtml(text);
  return (
    '<a class="datum-pool-table__payout" href="' +
    escapeHtml(href) +
    '" title="Open coinbase in the block viewer">' +
    escapeHtml(text) +
    "</a>"
  );
}

async function attachFindCoinbaseTxids(doc) {
  const finds = doc && Array.isArray(doc.finds) ? doc.finds : [];
  let changed = false;
  await Promise.all(
    finds.map(async function (find) {
      if (!find || datumPoolFindPayoutHref(find) || find.height == null) return;
      try {
        const r = await fetchBlockTxsForAnimation(find.height, find.hash || find.block);
        const txs = r && Array.isArray(r.txs) ? r.txs : [];
        const coinbase = txs.find(function (tx) {
          return tx && !Number(tx.fee_sats);
        }) || txs[0];
        const txid = normalizeTxid(coinbase && coinbase.txid);
        if (!txid) return;
        find.txid = txid;
        changed = true;
      } catch (_err) {}
    })
  );
  return changed;
}

function datumPoolEmptyFindMinersTableHtml(find) {
  let miners = Array.isArray(find && find.miners) ? find.miners.slice() : [];
  const payouts = datumPoolEmptyPayoutMap(find);
  if (!miners.length && Object.keys(payouts).length) {
    miners = Object.keys(payouts).map(function (id) {
      return { id: id, kind: "datum", work: 0, datum_work: 0, public_work: 0 };
    });
  }
  if (!miners.length) {
    return '<p class="datum-pool-miner--empty">No identities in this frozen window.</p>';
  }
  return (
    '<div class="datum-pool-table-wrap">' +
    '<table class="datum-pool-table">' +
    "<thead><tr>" +
    '<th scope="col">Username</th>' +
    '<th scope="col">Kind</th>' +
    '<th scope="col">Window work</th>' +
    '<th scope="col">DATUM work</th>' +
    '<th scope="col">Stratum work</th>' +
    '<th scope="col">Window %</th>' +
    '<th scope="col">Payout</th>' +
    "</tr></thead><tbody>" +
    miners
      .map(function (row) {
        const id = datumPoolMinerId(row);
        const sats = payouts[id];
        return (
          "<tr>" +
          '<td class="datum-pool-table__user portal-kpi-value--mono" title="' +
          escapeHtml(id) +
          '">' +
          escapeHtml(id) +
          "</td>" +
          '<td class="datum-pool-table__kind">' +
          escapeHtml(datumPoolMinerKindLabel(row)) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatDatumWork(row.work)) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatDatumWork(row.datum_work)) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatDatumWork(row.public_work)) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatDatumPercent(row.window_percent)) +
          "</td>" +
          '<td class="datum-pool-table__num">' +
          datumPoolFindPayoutCellHtml(find, sats) +
          "</td>" +
          "</tr>"
        );
      })
      .join("") +
    "</tbody></table></div>"
  );
}

function datumPoolEmptyFact(label, valueHtml) {
  return (
    '<p class="datum-pool-empty__chip"><span>' +
    escapeHtml(label) +
    "</span> " +
    valueHtml +
    "</p>"
  );
}

function datumPoolFindHtml(find, kind) {
  return datumPoolEmptyFindHtml(find, kind === "history" ? "history" : "empty");
}

function datumPoolEmptyFindHtml(find, kind) {
  kind = kind === "history" ? "history" : "empty";
  const height = find && find.height != null ? String(find.height) : "";
  const block = String((find && find.block) || "").trim();
  const found = formatMetricsAsOf(find && find.found_at);
  const value = Number(find && find.value);
  const leftover = Number(find && find.leftover_sats);
  const mature = find && find.mature_after_height != null ? String(find.mature_after_height) : "";
  const settled = !!(find && find.settled);
  const hashHtml = block
    ? '<a class="datum-pool-empty__block portal-kpi-value--mono" href="#viewer" title="' +
      escapeHtml(block) +
      '">' +
      escapeHtml(shortenDatumHex(block)) +
      "</a>"
    : escapeHtml("—");
  return (
    '<article class="datum-pool-card datum-pool-empty__find">' +
    '<h3 class="datum-pool-card__title">Height ' +
    escapeHtml(height || "—") +
    "</h3>" +
    '<div class="datum-pool-empty__chips">' +
    datumPoolEmptyFact("Height", escapeHtml(height || "—")) +
    datumPoolEmptyFact("Block", hashHtml) +
    datumPoolEmptyFact("Found", escapeHtml(found || "—")) +
    datumPoolEmptyFact("Value", escapeHtml(Number.isFinite(value) ? formatNumber(value) + " sats" : "—")) +
    datumPoolEmptyFact("Fee", escapeHtml(formatDatumBps(find && find.fee_bps, "0%"))) +
    datumPoolEmptyFact("Status", escapeHtml(kind === "history" ? "Paid in coinbase" : settled ? "Settled" : "Unsettled")) +
    (kind === "history" ? "" : datumPoolEmptyFact("Mature after", escapeHtml(mature || "—"))) +
    "</div>" +
    datumPoolEmptyFindMinersTableHtml(find) +
    '<p class="muted-note datum-pool-empty__leftover">Leftover ' +
    escapeHtml(Number.isFinite(leftover) ? formatNumber(leftover) + " sats" : "N/A") +
    (kind === "history"
      ? " stayed on the pool script (fee, dust, or past the 128-output cap)."
      : " stays on the pool script (fee, dust, or past the 128-output cap).") +
    "</p>" +
    "</article>"
  );
}

function datumPoolEmptyBankHtml(pool, emptyDoc) {
  const findsCount = datumPoolEmptyCount(pool, "empty_finds");
  const finds = emptyDoc && Array.isArray(emptyDoc.finds) ? emptyDoc.finds : [];
  let body = "";
  if (findsCount <= 0 && !finds.length) return "";
  if (findsCount > 0 && !emptyDoc) {
    body = '<p class="muted-note datum-pool-empty__state">Loading empty finds…</p>';
  } else if (finds.length) {
    body = finds.map(function (find) {
      return datumPoolEmptyFindHtml(find, "empty");
    }).join("");
  }
  return (
    '<div class="datum-pool-empty">' +
    '<h3 class="datum-pool-miners__title">Empty finds</h3>' +
    '<p class="datum-pool-miners__hint">' +
    escapeHtml(DATUM_POOL_EMPTY_NOTE) +
    "</p>" +
    body +
    "</div>"
  );
}

function datumPoolFindsHtml(pool, findsDoc) {
  const found = datumPoolEmptyCount(pool, "blocks_found");
  const finds = findsDoc && Array.isArray(findsDoc.finds) ? findsDoc.finds : [];
  if (found <= 0 && !finds.length) {
    return '<p class="muted-note datum-pool-empty__state">No pool-found blocks yet.</p>';
  }
  if (found > 0 && !findsDoc) {
    return '<p class="muted-note datum-pool-empty__state">Loading payout history…</p>';
  }
  if (!finds.length) {
    return (
      '<p class="muted-note datum-pool-empty__state">' +
      escapeHtml(
        found === 1
          ? "Prime counted 1 found block, but has not published its coinbase split yet."
          : "Prime counted " +
            formatNumber(found) +
            " found blocks, but has not published those coinbase splits yet."
      ) +
      "</p>"
    );
  }
  return finds.map(function (find) {
    return datumPoolEmptyFindHtml(find, "history");
  }).join("");
}

function datumPoolMinersToggleHtml(view) {
  return (
    '<div class="pool-share-toggle datum-pool-miners__toggle" role="tablist" aria-label="Payout identities view">' +
    '<button type="button" class="pool-share-toggle__btn' +
    (view === "window" ? " is-active" : "") +
    '" role="tab" aria-selected="' +
    (view === "window" ? "true" : "false") +
    '" data-datum-miners-view="window">Window</button>' +
    '<button type="button" class="pool-share-toggle__btn' +
    (view === "history" ? " is-active" : "") +
    '" role="tab" aria-selected="' +
    (view === "history" ? "true" : "false") +
    '" data-datum-miners-view="history">History</button></div>'
  );
}

function datumPoolBoardHtml(pool, emptyDoc, findsDoc) {
  if (!datumPoolUsable(pool)) return datumPoolUnavailableHtml();
  if (emptyDoc == null) emptyDoc = lastEmptyFindsDoc;
  if (findsDoc == null) findsDoc = lastFindsDoc;
  const info = datumPoolObject(pool.pool) || {};
  const name = String(info.name || "DATUM pool").trim() || "DATUM pool";
  const style = String(info.style || "").trim() ||
    "Non-custodial DATUM with an 8×-nethash rolling work window.";
  const maxSplit = Number(info.max_split_outputs);
  const minPayout = Number(info.min_payout_sats);
  const styleFacts = [];
  if (Number.isFinite(maxSplit) && maxSplit > 0) styleFacts.push("Max " + formatNumber(maxSplit) + " outputs");
  if (Number.isFinite(minPayout) && minPayout > 0) styleFacts.push(formatNumber(minPayout) + " sat min payout");
  const source = datumPoolSourceUrl(pool);
  const miners = datumPoolMiners(pool);
  const meaning = String(pool.window_percent_meaning || "").trim();
  const minerHint = meaning ||
    "Window % = payout split. Hash % = " +
    datumPoolHashrateWindowLabel(pool).replace(" avg", "") +
    " work share.";
  const sourceHtml = source
    ? '<a class="datum-pool-source" href="' +
      escapeHtml(source) +
      '" target="_blank" rel="noopener noreferrer">Source / AGPL</a>'
    : "";
  return (
    '<section class="metric-board metric-board--dense datum-pool-board">' +
    '<div class="datum-pool-masthead">' +
    '<div class="metric-board-heading">' +
    '<h2 class="metric-board-title">' +
    escapeHtml(name) +
    "</h2>" +
    "</div>" +
    '<div class="datum-pool-intro">' +
    '<p class="datum-pool-lede">' +
    escapeHtml((function () {
      let lede = style.replace(/\s+$/, "");
      if (lede && !/[.!?]$/.test(lede)) lede += ".";
      if (styleFacts.length) lede += (lede ? " " : "") + styleFacts.join(" · ") + ".";
      return lede;
    })()) +
    "</p></div></div>" +
    datumPoolMetricsHtml(pool) +
    '<div class="datum-pool-connect">' +
    datumPoolConnectCardsHtml(pool, info) +
    "</div>" +
    '<div class="datum-pool-miners">' +
    '<div class="datum-pool-miners__head">' +
    '<h3 class="datum-pool-miners__title">Payout identities</h3>' +
    datumPoolMinersToggleHtml(datumPoolMinersView) +
    "</div>" +
    '<p class="datum-pool-miners__hint" data-datum-miners-hint>' +
    escapeHtml(datumPoolMinersView === "history" ? DATUM_POOL_FINDS_NOTE : minerHint) +
    "</p>" +
    '<div class="datum-pool-miners__body">' +
    (datumPoolMinersView === "history"
      ? datumPoolFindsHtml(pool, findsDoc)
      : datumPoolMinersTableHtml(miners)) +
    "</div></div>" +
    datumPoolEmptyBankHtml(pool, emptyDoc) +
    '<div class="datum-pool-footer">' +
    '<p class="muted-note datum-pool-audit">' +
    '<a href="/api/pool">/api/pool</a>' +
    " · " +
    '<a href="/api/shares">/api/shares</a>' +
    " · " +
    '<a href="' +
    escapeHtml(datumPoolEmptyLink(pool)) +
    '">Empty finds</a>' +
    " · " +
    '<a href="' +
    escapeHtml(DATUM_POOL_FINDS_PATH) +
    '">Payout history</a>' +
    "</p>" +
    sourceHtml +
    "</div></section>"
  );
}

function datumPoolMinerHint(pool) {
  const meaning = String((pool && pool.window_percent_meaning) || "").trim();
  return meaning ||
    "Window % = payout split. Hash % = " +
    datumPoolHashrateWindowLabel(pool).replace(" avg", "") +
    " work share.";
}

function paintDatumPoolMinersChrome(pool) {
  const host = document.getElementById("datumPoolBoard");
  if (!host) return false;
  const view = datumPoolMinersView === "history" ? "history" : "window";
  host.querySelectorAll("[data-datum-miners-view]").forEach(function (btn) {
    const on = btn.getAttribute("data-datum-miners-view") === view;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  const hint = host.querySelector("[data-datum-miners-hint]");
  if (hint) hint.textContent = view === "history" ? DATUM_POOL_FINDS_NOTE : datumPoolMinerHint(pool);
  return true;
}

function paintDatumPoolMinersView(pool) {
  const host = document.getElementById("datumPoolBoard");
  if (!host) return;
  if (!paintDatumPoolMinersChrome(pool)) return;
  const body = host.querySelector(".datum-pool-miners__body");
  if (!body) {
    syncDatumPoolBoard(pool);
    return;
  }
  const view = datumPoolMinersView === "history" ? "history" : "window";
  const prevH = body.offsetHeight;
  if (prevH) body.style.minHeight = prevH + "px";
  body.innerHTML = view === "history"
    ? datumPoolFindsHtml(pool, lastFindsDoc)
    : datumPoolMinersTableHtml(datumPoolMiners(pool));
  requestAnimationFrame(function () {
    body.style.minHeight = "";
  });
}

function syncDatumPoolBoard(pool, emptyDoc, findsDoc) {
  const host = document.getElementById("datumPoolBoard");
  if (!host) return;
  if (datumPoolUsable(pool)) mergeMetricPoint("pool", poolMetricPoint(pool));
  withLiveView(host, function () {
    host.innerHTML = datumPoolBoardHtml(pool, emptyDoc, findsDoc);
  });
  paintMetricCharts(host);
}

async function loadEmptyFindsIfNeeded(pool) {
  const finds = datumPoolEmptyCount(pool, "empty_finds");
  const unsettled = datumPoolEmptyCount(pool, "empty_unsettled");
  if (finds <= 0) {
    const hadDoc = !!lastEmptyFindsDoc;
    lastEmptyFindsDoc = null;
    lastEmptyFindsKey = "";
    return hadDoc;
  }
  const key = finds + ":" + unsettled;
  if (lastEmptyFindsDoc && lastEmptyFindsKey === key) {
    return attachFindCoinbaseTxids(lastEmptyFindsDoc);
  }
  try {
    const r = await blockvasePublicFetch("/empty");
    const d = await r.json();
    if (!d || typeof d !== "object") return false;
    lastEmptyFindsDoc = d;
    lastEmptyFindsKey = key;
    await attachFindCoinbaseTxids(lastEmptyFindsDoc);
    return true;
  } catch (_err) {
    return false;
  }
}

async function loadFindsIfNeeded(pool) {
  const found = datumPoolEmptyCount(pool, "blocks_found");
  if (found <= 0) {
    const hadDoc = !!lastFindsDoc;
    lastFindsDoc = null;
    lastFindsKey = "";
    return hadDoc;
  }
  const key = String(found);
  if (lastFindsDoc && lastFindsKey === key && !datumPoolFindsNeedRefresh(lastFindsDoc)) {
    return attachFindCoinbaseTxids(lastFindsDoc);
  }
  try {
    const r = await blockvasePublicFetch("/finds");
    const d = await r.json();
    lastFindsDoc = d && typeof d === "object" ? d : { finds: [] };
    lastFindsKey = key;
    await attachFindCoinbaseTxids(lastFindsDoc);
    return true;
  } catch (_err) {
    lastFindsDoc = { finds: [] };
    lastFindsKey = "";
    return true;
  }
}

function initDatumPoolBoard() {
  const host = document.getElementById("datumPoolBoard");
  if (!host || host.dataset.bound === "1") return;
  host.dataset.bound = "1";
  if (!host.innerHTML.trim()) syncDatumPoolBoard(null);
  host.addEventListener("click", function (event) {
    const viewBtn = event.target.closest("[data-datum-miners-view]");
    if (viewBtn && host.contains(viewBtn)) {
      event.preventDefault();
      event.stopPropagation();
      const next = viewBtn.getAttribute("data-datum-miners-view") === "history" ? "history" : "window";
      if (next === datumPoolMinersView) return;
      datumPoolMinersView = next;
      if (next === "history" && !datumPoolHistoryReady(lastDatumPool)) {
        paintDatumPoolMinersChrome(lastDatumPool);
        loadFindsIfNeeded(lastDatumPool).then(function () {
          paintDatumPoolMinersView(lastDatumPool);
        });
        return;
      }
      paintDatumPoolMinersView(lastDatumPool);
      return;
    }
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

let lastLightning = null;
let lightningLoadSettled = false;

function lightningObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function lightningSchemaVersion(lightning) {
  if (!lightningObject(lightning)) return null;
  const raw = lightning.schema_version != null ? lightning.schema_version : lightning.schemaVersion;
  const version = Number(raw);
  if (!Number.isFinite(version) || version < 1) return null;
  return version;
}

function lightningAvailable(lightning) {
  if (!lightningObject(lightning)) return false;
  if (lightning.available === false || lightning.available === "false" || lightning.available === 0) return false;
  return true;
}

function lightningUsable(lightning) {
  return lightningSchemaVersion(lightning) != null && lightningAvailable(lightning);
}

function adoptLightning(next) {
  if (lightningUsable(next)) lastLightning = next;
  else if (lightningSchemaVersion(next) != null && !lightningAvailable(next)) lastLightning = null;
  return lastLightning;
}

function lightningCssColor(value) {
  const raw = String(value || "").trim().replace(/^#/, "");
  return /^[0-9a-fA-F]{3,8}$/.test(raw) ? "#" + raw : "";
}

function lightningSwatchHtml(color, extraClass) {
  const css = lightningCssColor(color);
  if (!css) return "";
  return (
    '<span class="lightning-swatch' +
    (extraClass ? " " + extraClass : "") +
    '" style="background:' +
    escapeHtml(css) +
    '" aria-hidden="true"></span>'
  );
}

function formatLightningBtcAmount(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  let text = n.toFixed(8).replace(/\.?0+$/, "");
  if (text === "-0") text = "0";
  return text;
}

function formatLightningBtc(value) {
  const text = formatLightningBtcAmount(value);
  return text ? text + " BTC" : "—";
}

function lightningCapacitySat(channel) {
  const sat = Number(channel && channel.capacity_sat);
  if (Number.isFinite(sat)) return sat;
  const msat = Number(channel && channel.capacity_msat);
  if (Number.isFinite(msat)) return msat / 1000;
  const btc = Number(channel && channel.capacity_btc);
  if (Number.isFinite(btc)) return btc * 1e8;
  return 0;
}

function lightningQrHtml(uri) {
  const text = String(uri || "").trim();
  if (!text || typeof qrcode !== "function") return "";
  try {
    const qr = qrcode(0, "M");
    qr.addData(text, "Byte");
    qr.make();
    return (
      '<div class="lightning-qr" aria-hidden="true">' +
      qr.createSvgTag({ cellSize: 3, margin: 1, scalable: true }) +
      "</div>"
    );
  } catch (_err) {
    return "";
  }
}

function lightningChannelIsPrivate(row) {
  const value = row && row.private;
  return value === true || value === 1 || value === "true";
}

function lightningChannels(lightning) {
  const rows = Array.isArray(lightning && lightning.channels) ? lightning.channels : [];
  return rows
    .filter(function (row) {
      return row && typeof row === "object" && !lightningChannelIsPrivate(row);
    })
    .slice()
    .sort(function (a, b) {
      return lightningCapacitySat(b) - lightningCapacitySat(a);
    });
}

function lightningPeerLabel(channel) {
  const alias = String((channel && channel.peer_alias) || "").trim();
  if (alias) return alias;
  return shortenDatumHex((channel && channel.peer_id) || "", 10, 8) || "—";
}

function lightningPageTitle(lightning) {
  const node = lightningObject(lightning && lightning.node) || {};
  const alias = String(node.alias || "Blockvase").trim() || "Blockvase";
  if (/lightning/i.test(alias)) return alias;
  return alias + " Lightning";
}

function lightningPlainNotice(text) {
  return String(text || "")
    .replace(/[^.!?]*SHA-?256d[^.!?]*[.!?]*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lightningUnavailableHtml() {
  if (!lightningLoadSettled) return portalBoardStatusHtml("Loading data...");
  return portalBoardStatusHtml("Lightning status is unavailable.");
}

function lightningMetricsHtml(lightning) {
  const status = lightningObject(lightning && lightning.status) || {};
  const publicCount = status.public_channels != null ? status.public_channels : lightningChannels(lightning).length;
  const privateCount = status.private_channels != null ? status.private_channels : 0;
  const capacityText = formatLightningBtcAmount(status.capacity_btc);
  return (
    '<div class="datum-pool-metrics">' +
    '<div class="metric-cluster-grid datum-pool-metrics__grid">' +
    metricClusterHtml(
      "Node",
      metricKvHtml([
        ["Peers", formatNumber(Number(status.num_peers) || 0), { chart: "lightning.num_peers" }],
        [
          "Active channels",
          formatNumber(Number(status.num_active_channels) || 0),
          { chart: "lightning.num_active_channels" },
        ],
        ["Pending", formatNumber(Number(status.num_pending_channels) || 0), { chart: "lightning.num_pending_channels" }],
      ])
    ) +
    metricClusterHtml(
      "Channels",
      metricKvHtml([
        [
          "Capacity",
          capacityText
            ? datumPoolFactValue(capacityText, "BTC", true)
            : "—",
          { chart: "lightning.capacity_btc" },
        ],
        ["Public", formatNumber(Number(publicCount) || 0), { chart: "lightning.public_channels" }],
        ["Private", formatNumber(Number(privateCount) || 0), { chart: "lightning.private_channels" }],
      ])
    ) +
    "</div></div>"
  );
}

function lightningConnectCardsHtml(lightning) {
  const links = lightningObject(lightning && lightning.links) || {};
  const node = lightningObject(lightning && lightning.node) || {};
  const status = lightningObject(lightning && lightning.status) || {};
  const uri = String(links.uri || node.uri || "").trim();
  const host = String(links.host || "").trim();
  const port = links.port != null ? String(links.port) : (node.port != null ? String(node.port) : "");
  const nodeId = String(node.id || "").trim();
  const color = String(node.color || "").trim();
  const connectCard =
    '<article class="datum-pool-card">' +
    '<h3 class="datum-pool-card__title">Connect</h3>' +
    '<p class="datum-pool-card__note">Use a BLAKE2b-capable Lightning node.</p>' +
    datumPoolCopyControl("URI", uri, "mono") +
    (host ? datumPoolCopyControl("Host", host, "hint") : "") +
    (port ? datumPoolCopyControl("Port", port, "hint") : "") +
    lightningQrHtml(uri) +
    "</article>";
  const nodeCard =
    '<article class="datum-pool-card">' +
    '<h3 class="datum-pool-card__title">Node</h3>' +
    datumPoolCopyControl("Alias", node.alias || "—", "hint") +
    datumPoolCopyControl("Node ID", nodeId, "hex") +
    datumPoolCopyControl("Version", node.version || "—", "hint") +
    datumPoolCopyControl("Network", node.network || "—", "hint") +
    datumPoolCopyControl("Color", color ? (color.charAt(0) === "#" ? color : "#" + color) : "—", "hint") +
    datumPoolCopyControl("Block height", status.blockheight != null ? formatNumber(status.blockheight) : "—", "hint") +
    "</article>";
  return '<div class="datum-pool-connect-grid">' + connectCard + nodeCard + "</div>";
}

function lightningChannelsTableHtml(channels) {
  if (!channels.length) {
    return '<p class="datum-pool-miner--empty">No public channels yet</p>';
  }
  return (
    '<div class="datum-pool-table-wrap">' +
    '<table class="datum-pool-table">' +
    "<thead><tr>" +
    '<th scope="col">Peer</th>' +
    '<th scope="col">Capacity</th>' +
    '<th scope="col">State</th>' +
    '<th scope="col">Opened by</th>' +
    '<th scope="col">Channel ID</th>' +
    "</tr></thead><tbody>" +
    channels
      .map(function (row) {
        const alias = lightningPeerLabel(row);
        const peerId = String(row.peer_id || "").trim();
        const label = String(row.state_label || "").trim();
        const rawState = String(row.state || "").trim();
        const opener = String(row.opener || "").trim().toLowerCase();
        const openedBy = opener === "local" ? "Blockvase" : opener === "remote" ? "Peer" : "—";
        const scid = String(row.short_channel_id || "").trim();
        const funding = String(row.funding_txid || "").trim();
        const stateHtml =
          escapeHtml(label || rawState || "—") +
          (label && label.toLowerCase() !== "open" && rawState && rawState.toLowerCase() !== label.toLowerCase()
            ? '<span class="lightning-sub">' + escapeHtml(rawState) + "</span>"
            : "");
        return (
          "<tr>" +
          '<td class="datum-pool-table__user" title="' +
          escapeHtml(peerId || alias) +
          '">' +
          '<span class="lightning-peer">' +
          escapeHtml(alias) +
          "</span></td>" +
          '<td class="datum-pool-table__num">' +
          escapeHtml(formatLightningBtc(row.capacity_btc != null ? row.capacity_btc : lightningCapacitySat(row) / 1e8)) +
          "</td>" +
          '<td class="datum-pool-table__kind">' +
          stateHtml +
          "</td>" +
          '<td class="datum-pool-table__kind">' +
          escapeHtml(openedBy) +
          "</td>" +
          '<td class="datum-pool-table__user">' +
          (scid ? datumPoolCopyControl("Channel ID", scid, "mono") : escapeHtml("—")) +
          (funding ? datumPoolCopyControl("Funding", funding, "hex") : "") +
          "</td></tr>"
        );
      })
      .join("") +
    "</tbody></table></div>"
  );
}

function lightningBoardHtml(lightning) {
  if (!lightningUsable(lightning)) return lightningUnavailableHtml();
  const notice = lightningPlainNotice(lightning.notice);
  return (
    '<section class="metric-board metric-board--dense datum-pool-board">' +
    '<div class="datum-pool-masthead">' +
    '<div class="metric-board-heading">' +
    '<h2 class="metric-board-title">' +
    escapeHtml(lightningPageTitle(lightning)) +
    "</h2></div>" +
    '<div class="datum-pool-intro">' +
    (notice
      ? '<p class="datum-pool-lede">' + escapeHtml(notice) + "</p>"
      : "") +
    "</div></div>" +
    lightningMetricsHtml(lightning) +
    '<div class="datum-pool-connect">' +
    lightningConnectCardsHtml(lightning) +
    "</div>" +
    '<div class="datum-pool-miners">' +
    '<h3 class="datum-pool-miners__title">Public channels</h3>' +
    '<p class="datum-pool-miners__hint">Public channels only. Private channels are counted above, not listed.</p>' +
    lightningChannelsTableHtml(lightningChannels(lightning)) +
    "</div></section>"
  );
}

function syncLightningBoard(lightning) {
  const host = document.getElementById("lightningBoard");
  if (!host) return;
  if (lightningUsable(lightning)) mergeMetricPoint("lightning", lightningMetricPoint(lightning));
  withLiveView(host, function () {
    host.innerHTML = lightningBoardHtml(lightning);
  });
  paintMetricCharts(host);
}

function initLightningBoard() {
  const host = document.getElementById("lightningBoard");
  if (!host || host.dataset.bound === "1") return;
  host.dataset.bound = "1";
  if (!host.innerHTML.trim()) syncLightningBoard(null);
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
    if (adoptDatumPool(pool)) {
      syncDatumPoolBoard(lastDatumPool);
      if (await loadEmptyFindsIfNeeded(lastDatumPool)) syncDatumPoolBoard(lastDatumPool);
      if (await loadFindsIfNeeded(lastDatumPool)) syncDatumPoolBoard(lastDatumPool);
    }
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
const BLOCK_CAROUSEL_HYDRATE_RETRY_MS = 4000;
const BLOCK_CAROUSEL_HYDRATE_RETRY_MAX = 5;
let blockTxsRetryTimer = 0;
let blockTxsRetryKey = "";
let carouselHydrateRetryTimer = 0;
let carouselHydrateRetryKey = "";
let carouselHydrateRetryCount = 0;
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
  userBrowsing: false,
  programmaticScroll: false,
  scrollIdleTimer: 0,
  programmaticScrollTimer: 0,
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
  return aliasPoolShareKey(text);
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
  let coinbase = formatCoinbaseTag(
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
  if (isAlphaPoolTestIdentity(pool, coinbase)) {
    pool = "AlphaPool";
    if (/^test$/i.test(coinbase)) coinbase = "AlphaPool";
  } else if (isLazarusIdentity(pool)) {
    pool = "Lazarus";
  }
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

function carouselItemHasDisplayMeta(item) {
  if (!item || item.mining) return true;
  return !!(item.timestamp || item.pool || item.coinbase);
}

function carouselItemIsPending(item) {
  return !!(item && !item.mining && (item._lookupContext || item._extra) && !carouselItemHasDisplayMeta(item));
}

function carouselBlockMetaFromSearchHit(data) {
  const details = data && data.details && typeof data.details === "object" ? data.details : {};
  const timestamp = Number(
    (data && (data.timestamp || data.time || data.blocktime || data.block_time)) ||
    details.blocktime ||
    details.time ||
    details.block_time ||
    details.timestamp
  ) || 0;
  const txCount = Number(
    (data && (data.tx_count || data.nTx || data.n_tx)) ||
    details.tx_count ||
    details.nTx ||
    details.n_tx
  ) || 0;
  const size = Number(data && data.size) || 0;
  const hash = String(
    (data && (data.hash || data.blockhash || data.block_hash)) ||
    details.blockhash ||
    details.block_hash ||
    details.blockHash ||
    ""
  ).trim();
  const labels = blockLabelFromSource(Object.assign({}, details, data || {}));
  return {
    height: data && data.height,
    timestamp: timestamp,
    tx_count: txCount,
    size: size,
    hash: hash,
    pool: (data && data.pool) || labels.pool,
    coinbase_tag: (data && (data.coinbase_tag || data.coinbase)) || labels.coinbase,
  };
}

function applySearchHitToCarouselItem(data) {
  if (!data || data.height == null) return null;
  const meta = carouselBlockMetaFromSearchHit(data);
  const item = ensureCarouselRangeForHeight(data.height, meta.hash);
  if (!item) return null;
  applyCarouselBlockMeta(Object.assign({ height: data.height }, meta));
  if (!carouselItemHasDisplayMeta(item)) item._lookupContext = true;
  renderBlockCarouselRefresh();
  void hydrateCarouselRangeAroundHeight(data.height, meta.hash || item.hash);
  return item;
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
  const pending = carouselItemIsPending(item);
  const time = item.mining
    ? "mining " + formatDuration(item.secondsSinceTip)
    : pending
      ? "Loading…"
      : item.timestamp
        ? formatTimeAgo(item.timestamp)
        : "";
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
      (pending && !item.size && !item.txCount
        ? "<span>…</span>"
        : "<span>" + formatNumber(item.txCount || 0) + " tx</span>" +
          "<span>" + escapeHtml(formatBytes(item.size || 0)) + "</span>") +
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
  if (!note) {
    asof.textContent = "";
    asof.hidden = true;
    return;
  }
  const compactNote = compactViewerTabAsOf(note);
  asof.hidden = false;
  asof.innerHTML =
    '<span class="viewer-tab-asof__time viewer-tab-asof__time--full">' +
    metricEscape(note) +
    "</span>" +
    '<span class="viewer-tab-asof__time viewer-tab-asof__time--compact">' +
    metricEscape(compactNote) +
    "</span>" +
    '<button type="button" class="datum-pool-copy viewer-peer-copy" data-viewer-peer-copy data-copy="' +
    metricEscape(BLOCKVASE_VIEWER_PEER_CONNECTION) +
    '">' +
    '<span class="datum-pool-copy__value">' +
    viewerPeerConnectionHtml() +
    "</span>" +
    "</button>";
}

function updateBlockCarouselAsOf(note) {
  updateViewerTabAsOf(note);
}

function compactViewerTabAsOf(note) {
  const text = String(note || "");
  const m = text.match(/(\d{1,2}:\d{2})(?::\d{2})?\s*([AP]M)?\s*([A-Z]{2,5})?\s*$/i);
  if (!m) return text;
  return "As of " + m[1] + (m[2] ? " " + m[2].toUpperCase() : "") + (m[3] ? " " + m[3].toUpperCase() : "");
}

function viewerPeerConnectionHtml() {
  const text = BLOCKVASE_VIEWER_PEER_CONNECTION;
  const prefix = "addnode=";
  if (!text.startsWith(prefix)) return metricEscape(text);
  return (
    '<span class="viewer-peer-copy__prefix">' +
    metricEscape(prefix) +
    "</span>" +
    '<span class="viewer-peer-copy__host">' +
    metricEscape(text.slice(prefix.length)) +
    "</span>"
  );
}

function initViewerPeerCopy() {
  const asof = document.getElementById("viewerTabAsOf");
  if (!asof) return;
  asof.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-viewer-peer-copy]");
    if (!btn || !asof.contains(btn)) return;
    event.preventDefault();
    const text = btn.getAttribute("data-copy") || "";
    const value = btn.querySelector(".datum-pool-copy__value") || btn;
    const original = value.innerHTML;
    copyTextToClipboard(text, btn).then(function (ok) {
      btn.classList.add("is-copied");
      value.textContent = ok ? "Copied" : "Copy failed";
      setTimeout(function () {
        btn.classList.remove("is-copied");
        value.innerHTML = original;
      }, 1000);
    });
  });
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

function visibleCarouselAnchor(track) {
  if (!track) return null;
  const cards = track.querySelectorAll(".block-carousel__item");
  const left = track.getBoundingClientRect().left;
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    if (rect.right > left + 4) {
      return {
        key: cards[i].getAttribute("data-key") || "",
        offset: rect.left - left,
      };
    }
  }
  return null;
}

function setCarouselScrollLeft(track, next) {
  if (!track) return;
  const max = Math.max(0, track.scrollWidth - track.clientWidth);
  blockCarouselState.programmaticScroll = true;
  track.scrollLeft = Math.max(0, Math.min(next, max));
  clearTimeout(blockCarouselState.programmaticScrollTimer);
  blockCarouselState.programmaticScrollTimer = setTimeout(function () {
    blockCarouselState.programmaticScroll = false;
  }, 250);
}

function applyCarouselAnchor(track, anchor) {
  if (!track || !anchor || !anchor.key) return false;
  const el = track.querySelector('.block-carousel__item[data-key="' + String(anchor.key).replace(/"/g, "") + '"]');
  if (!el) return false;
  const left = el.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  setCarouselScrollLeft(track, left - (Number(anchor.offset) || 0));
  return true;
}

function restoreCarouselScroll(track, keepLeft, anchor) {
  if (blockCarouselState.userBrowsing) {
    if (applyCarouselAnchor(track, anchor)) return;
    if (keepLeft > 0) setCarouselScrollLeft(track, keepLeft);
    return;
  }
  if (blockCarouselState.pinScrollKey) {
    revealPinnedCarouselCard();
    return;
  }
  if (applyCarouselAnchor(track, anchor)) return;
  if (keepLeft > 0) setCarouselScrollLeft(track, keepLeft);
}

function carouselMountedCount(items) {
  items = items || blockCarouselState.items || [];
  let n = blockCarouselState.renderCount || BLOCK_CAROUSEL_LAZY_BATCH;
  ["selected", "pinScrollKey"].forEach(function (field) {
    const key = blockCarouselState[field];
    if (!key) return;
    const idx = items.findIndex(function (b) { return b && b.key === key; });
    if (idx >= 0) n = Math.max(n, idx + 1);
    const height = Number(key);
    if (!Number.isFinite(height) || height <= 0) return;
    const minH = height - BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS;
    const maxH = height + BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item || item.mining) continue;
      const h = Number(item.height) || 0;
      if (h && h >= minH && h <= maxH) n = Math.max(n, i + 1);
    }
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
  const anchor = visibleCarouselAnchor(track);
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
  if (shouldHoldDom(track)) {
    restoreCarouselScroll(track, keepLeft || 0, anchor);
    return;
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
  restoreCarouselScroll(track, keepLeft || 0, anchor);
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
    extendCarouselIfNeeded();
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
  const anchor = visibleCarouselAnchor(track);
  track.insertAdjacentHTML("beforeend", add.map(blockCarouselCardHtml).join(""));
  blockCarouselState.renderCount = next;
  applyCarouselAnchor(track, anchor);
  return true;
}

function noteCarouselUserScroll(track) {
  if (!track) track = document.getElementById("blockCarouselTrack");
  if (track) {
    track.style.scrollSnapType = "none";
    track.classList.add("is-user-scrolling");
  }
  blockCarouselState.userBrowsing = true;
  blockCarouselState.pinScrollKey = "";
}

function onCarouselScrollIdle() {
  blockCarouselState.userBrowsing = false;
  const track = document.getElementById("blockCarouselTrack");
  if (track) track.classList.remove("is-user-scrolling");
  extendCarouselIfNeeded();
}

function scheduleCarouselScrollIdle() {
  clearTimeout(blockCarouselState.scrollIdleTimer);
  blockCarouselState.scrollIdleTimer = setTimeout(onCarouselScrollIdle, 180);
}

function extendCarouselIfNeeded() {
  const track = document.getElementById("blockCarouselTrack");
  if (!track) return;
  let steps = 0;
  while (track.scrollWidth - track.scrollLeft - track.clientWidth <= 220 && steps < 4) {
    if (!mountCarouselBatch()) {
      fetchOlderCarouselBlocks();
      return;
    }
    steps += 1;
  }
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

function closeTxExplorerPanel(keepLocation) {
  const panel = document.getElementById("tx-detail-panel");
  const closeBtn = document.querySelector(".tx-detail-close");
  if (keepLocation) openTxExplorer._keepLocation = true;
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
  track.style.scrollSnapType = "none";
  setCarouselScrollLeft(track, next);
}

function revealPinnedCarouselCard() {
  if (!blockCarouselState.pinScrollKey) return;
  scrollCarouselToKey(blockCarouselState.pinScrollKey);
  requestAnimationFrame(function () {
    if (!blockCarouselState.pinScrollKey) return;
    scrollCarouselToKey(blockCarouselState.pinScrollKey);
  });
}

function currentMinedTipHeight() {
  if (lastBlockHeight > 0) return lastBlockHeight;
  let tip = 0;
  (blockCarouselState.items || []).forEach(function (item) {
    if (!item || !item.height) return;
    const height = Number(item.height) || 0;
    if (!height) return;
    if (item.mining) {
      tip = Math.max(tip, height - 1);
      return;
    }
    if (!item._lookupContext || item.timestamp || item.hash || item.txCount) {
      tip = Math.max(tip, height);
    }
  });
  return tip;
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
  const tip = currentMinedTipHeight();
  const maxH = tip > 0 ? Math.min(h + BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS, tip) : h;
  const minH = Math.max(0, h - BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS);
  const live = blockCarouselState.items.filter(function (b) { return b && b.mining; });
  const byKey = {};
  blockCarouselState.items.forEach(function (item) {
    if (!item || item.mining || !item.key) return;
    const itemH = Number(item.height) || 0;
    if (item._lookupContext && tip > 0 && itemH > tip && !item.timestamp && !item.hash && !item.txCount) {
      return;
    }
    byKey[item.key] = item;
  });
  for (let n = maxH; n >= minH; n--) {
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

function carouselItemNeedsMeta(item) {
  if (!item || item.mining) return false;
  if (item._lookupContext || item._extra) {
    return !carouselItemHasDisplayMeta(item);
  }
  return !item.timestamp;
}

function applyCarouselBlockMeta(block) {
  const height = Number(block && block.height) || 0;
  if (!height) return null;
  const item = (blockCarouselState.items || []).find(function (b) { return b && b.key === String(height); });
  if (!item || item.mining) return null;
  const labels = blockLabelFromSource(block);
  const timestamp = Number(block.timestamp || block.time) || 0;
  const txCount = Number(block.tx_count || block.nTx || 0) || 0;
  const size = Number(block.size || 0) || 0;
  const hash = block.hash || block.id || "";
  if (timestamp) item.timestamp = timestamp;
  if (txCount) item.txCount = txCount;
  if (size) item.size = size;
  if (hash) item.hash = hash;
  if (labels.pool) item.pool = labels.pool;
  if (labels.coinbase) item.coinbase = labels.coinbase;
  if (carouselItemHasDisplayMeta(item)) {
    item._lookupContext = false;
  }
  return item;
}

function clearCarouselHydrateRetry() {
  if (carouselHydrateRetryTimer) {
    clearTimeout(carouselHydrateRetryTimer);
    carouselHydrateRetryTimer = 0;
  }
  carouselHydrateRetryKey = "";
  carouselHydrateRetryCount = 0;
}

function settleCarouselRangeMeta(height) {
  const h = Number(height);
  if (!Number.isFinite(h) || h < 0) return;
  const minH = Math.max(0, h - BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS);
  const maxH = h + BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS;
  let changed = false;
  (blockCarouselState.items || []).forEach(function (item) {
    if (!item || item.mining) return;
    const n = Number(item.height) || 0;
    if (n < minH || n > maxH) return;
    if ((item.size || item.txCount || item.hash) && item._lookupContext) {
      item._lookupContext = false;
      changed = true;
    }
  });
  if (changed) renderBlockCarouselRefresh();
}

function scheduleCarouselHydrateRetry(height, hash) {
  const key = String(height);
  if (carouselHydrateRetryKey === key && carouselHydrateRetryCount >= BLOCK_CAROUSEL_HYDRATE_RETRY_MAX) {
    settleCarouselRangeMeta(height);
    return;
  }
  if (carouselHydrateRetryTimer) clearTimeout(carouselHydrateRetryTimer);
  if (carouselHydrateRetryKey !== key) {
    carouselHydrateRetryKey = key;
    carouselHydrateRetryCount = 0;
  }
  carouselHydrateRetryCount += 1;
  carouselHydrateRetryTimer = setTimeout(function () {
    carouselHydrateRetryTimer = 0;
    void hydrateCarouselRangeAroundHeight(height, hash);
  }, BLOCK_CAROUSEL_HYDRATE_RETRY_MS);
}

function carouselRangeStillNeedsMeta(minH, maxH) {
  for (let n = minH; n <= maxH; n++) {
    const item = (blockCarouselState.items || []).find(function (b) { return b && b.key === String(n); });
    if (!item || carouselItemNeedsMeta(item)) return true;
  }
  return false;
}

async function hydrateCarouselRangeAroundHeight(height, hash) {
  const h = Number(height);
  if (!Number.isFinite(h) || h < 0) return;
  const tip = currentMinedTipHeight();
  const radius = BLOCK_CAROUSEL_LOOKUP_CONTEXT_RADIUS;
  const maxH = tip > 0 ? Math.min(h + radius, tip) : h;
  const minH = Math.max(0, h - radius);
  ensureCarouselRangeForHeight(h, hash);
  if (!carouselRangeStillNeedsMeta(minH, maxH)) {
    if (carouselHydrateRetryKey === String(h)) clearCarouselHydrateRetry();
    return;
  }
  try {
    const response = await blockvaseFetchWithTimeout(
      "/recent-blocks?before=" + encodeURIComponent(String(maxH + 1)) + "&limit=" + Math.min(120, Math.max(1, maxH - minH + 1)),
      8000
    );
    const data = await response.json();
    const incoming = Array.isArray(data.blocks) ? data.blocks : [];
    incoming.forEach(applyCarouselBlockMeta);
    renderBlockCarouselRefresh();
    revealPinnedCarouselCard();
    if (carouselRangeStillNeedsMeta(minH, maxH)) scheduleCarouselHydrateRetry(h, hash);
    else {
      settleCarouselRangeMeta(h);
      if (carouselHydrateRetryKey === String(h)) clearCarouselHydrateRetry();
    }
  } catch (_) {
    scheduleCarouselHydrateRetry(h, hash);
  }
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
  if (opts.hydrateNeighbors && item.height) {
    void hydrateCarouselRangeAroundHeight(item.height, item.hash);
  }
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
    const fallbackTxs = selectTxid && opts.tx ? [opts.tx] : [];
    postToMempoolIframe({
      type: "blockvase-load-block",
      height: item.height,
      hash: item.hash || "",
      txs: fallbackTxs,
      selectTxid: selectTxid || "",
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
  syncPoolShareFindSelection();
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
    if (!target || !target.closest) return false;
    if (target.closest(".pool-share-finds, .pool-share-find, .pool-share-name, .peer-census-peers")) return false;
    return !!(target.closest("button, .portal-tab-nav, .block-carousel"));
  }
  document.addEventListener("pointerdown", function (e) {
    rememberViewHoldPointer(e.target);
  }, true);
  document.addEventListener("pointerup", function () {
    viewHoldPointer = null;
  }, true);
  document.addEventListener("pointercancel", function () {
    viewHoldPointer = null;
  }, true);
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
  });
  track.addEventListener("scroll", function () {
    if (blockCarouselState.programmaticScroll) return;
    noteCarouselUserScroll(track);
    scheduleCarouselScrollIdle();
  }, { passive: true });
  track.addEventListener("scrollend", function () {
    if (blockCarouselState.programmaticScroll) return;
    clearTimeout(blockCarouselState.scrollIdleTimer);
    onCarouselScrollIdle();
  }, { passive: true });
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
    selectBlockCarouselItem(btn.getAttribute("data-key"), { hydrateNeighbors: true });
  }, true);
}

function setViewerSearchReady(ready) {
  const preview = document.getElementById("viewerMempoolPreview");
  if (!preview) return;
  preview.hidden = !ready;
}

async function loadMetrics() {
  const beforeEl = document.getElementById("metricsBeforeMempool");
  const upperDetailEl = document.getElementById("metricsUpperDetail");
  const historyReady = ensureMetricHistory();
  try {
    const r = await blockvaseFetch("/blockchain-info");
    const d = await r.json();
    await historyReady;

    const status = document.getElementById("status");
    if (!d.connected) {
      document.getElementById("metricsGrid").innerHTML =
        '<div class="error-msg">Not connected to Bitcoin node. Ensure Bitcoin Knots is running and reachable.</div>';
      lastPoolShare = null;
      adoptDatumPool(d.datum_pool && typeof d.datum_pool === "object" ? d.datum_pool : null);
      adoptLightning(d.lightning && typeof d.lightning === "object" ? d.lightning : null);
      datumPoolLoadSettled = true;
      lightningLoadSettled = true;
      syncDatumPoolBoard(lastDatumPool);
      syncLightningBoard(lastLightning);
      updateBlockCarouselAsOf("");
      syncPoolShareBoard(null);
      syncRetargetBar("");
      if (beforeEl) beforeEl.innerHTML = "";
      if (upperDetailEl) upperDetailEl.innerHTML = "";
      setViewerSearchReady(false);
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
    adoptLightning(d.lightning && typeof d.lightning === "object" ? d.lightning : null);
    datumPoolLoadSettled = true;
    lightningLoadSettled = true;
    mergeMetricPoint("viewer", viewerMetricPoint(d, mining));
    syncDatumPoolBoard(lastDatumPool);
    syncLightningBoard(lastLightning);
    const gridHtml = metricBoard(
      "Chain overview",
      portalKpiStrip(
        [
          portalKpiHtml("Height", formatNumber(mining.miningHeight || d.blocks || 0), {
            chart: "viewer.height",
          }),
          portalKpiHtml("Difficulty", diffParts.value, {
            unit: diffParts.unit,
            chart: "viewer.difficulty",
          }),
          portalKpiHtml("Network hash", hashParts.value, {
            unit: hashParts.unit,
            chart: "viewer.networkhashps",
          }),
          portalKpiHtml("Chain size", chainParts.value, {
            unit: chainParts.unit,
            chart: "viewer.chain_bytes",
          }),
          portalKpiHtml("Mempool tx", formatNumber(d.mempool_tx || 0), {
            chart: "viewer.mempool_tx",
          }),
          portalKpiHtml("Server node peers", formatNumber(d.connections || 0), {
            chart: "viewer.connections",
            tool: peerCensusOpenButtonHtml(),
          }),
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
            ["Size", escapeHtml(mempoolSize), { chart: "viewer.mempool_bytes" }],
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
    setViewerSearchReady(true);
    syncPoolShareBoard(lastPoolShare);
    syncRetargetBar(retargetHtml);
    if (upperDetailEl) upperDetailEl.innerHTML = upperDetailHtml;
    paintMetricCharts(document.getElementById("metricsGrid"));
    paintMetricCharts(upperDetailEl);
    bindPeerCensusOpen();

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
    setViewerSearchReady(false);
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

function applyBwMode() {
  document.documentElement.removeAttribute("data-bw");
  document.documentElement.classList.remove("soft-skin");
  if (document.body) {
    document.body.removeAttribute("data-bw");
    document.body.classList.remove("soft-skin");
  }
  const leftover = document.getElementById("bwModeToggle");
  if (leftover) leftover.remove();
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

function normalizeTxid(value) {
  const q = String(value || "").trim().toLowerCase().replace(/^0x/, "");
  return /^[0-9a-f]{64}$/.test(q) ? q : "";
}

function isCompleteTxidSearch(query) {
  return !!normalizeTxid(query);
}

function portalHashRaw() {
  return String(window.location.hash || "").replace(/^#/, "");
}

function portalHashTabPart(name) {
  const raw = String(name == null ? portalHashRaw() : name).replace(/^#/, "");
  const qIndex = raw.indexOf("?");
  return (qIndex === -1 ? raw : raw.slice(0, qIndex)).trim();
}

function parseViewerTxidFromLocation() {
  const hash = portalHashRaw();
  const qIndex = hash.indexOf("?");
  if (qIndex !== -1) {
    try {
      const params = new URLSearchParams(hash.slice(qIndex + 1));
      const fromHashQuery = normalizeTxid(params.get("tx") || params.get("txid"));
      if (fromHashQuery) return fromHashQuery;
    } catch (_) {}
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = normalizeTxid(params.get("tx") || params.get("txid"));
    if (fromQuery) return fromQuery;
  } catch (_) {}
  const match = hash.match(/^(?:viewer\/)?tx[=/]([0-9a-fA-F]{64})$/i);
  return match ? normalizeTxid(match[1]) : "";
}

function viewerTxLocationHash(txid) {
  const id = normalizeTxid(txid);
  return id ? "#viewer?tx=" + id : "#viewer";
}

let syncingViewerTxLocation = false;
let portalMempoolSearch = function (_query, _fromSubmit) {};
let cancelPortalMempoolSearch = function () {};

const PEER_CENSUS_POLL_MS = 45000;
const PEER_CENSUS_RETRY_MS = 8000;
const PEER_CENSUS_MOVE_MS = 720;
const PEER_CENSUS_UA_ORDER = [
  "knots",
  "core",
  "futurebit",
  "bitcoinj",
  "bcoin",
  "btcd",
  "crawler",
  "other",
  "unknown",
];
const PEER_CENSUS_UA_LABEL = {
  knots: "Knots",
  core: "Core",
  futurebit: "FutureBit",
  bitcoinj: "BitcoinJ",
  bcoin: "bcoin",
  btcd: "btcd",
  crawler: "Crawler",
  other: "Other",
  unknown: "Unknown",
};
const peerCensusState = {
  open: false,
  loading: false,
  timer: 0,
  retryTimer: 0,
  data: null,
  selectedKey: "",
  hoverKey: "",
  layout: [],
  clusters: [],
  splitX: 0,
  hubKey: "",
  layoutKey: "",
  size: { w: 0, h: 0 },
  raf: 0,
  now: 0,
  edgeLayer: null,
  edgeCacheKey: "",
  moving: false,
  allowTween: false,
  cluster: "location",
};

function peerCensusKey(node) {
  return [
    String((node && node.host) || ""),
    String((node && node.port) || ""),
    String((node && node.address_type) || ""),
    String((node && node.network) || ""),
  ].join("|");
}

function peerCensusPinKey(node) {
  return String((node && node.host) || "") + "|" + String((node && node.port) || "");
}

function peerCensusOpenButtonHtml() {
  return (
    '<button type="button" class="btn-icon peer-census-open" id="peerCensusOpen" aria-label="Open listening peer map" aria-expanded="false" title="Listening peer map">' +
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<circle cx="18" cy="5.5" r="2.25"></circle>' +
    '<circle cx="6" cy="12" r="2.25"></circle>' +
    '<circle cx="18" cy="18.5" r="2.25"></circle>' +
    '<path d="M8.15 11.05 L15.85 6.45 M8.15 12.95 L15.85 17.55" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>' +
    "</svg>" +
    '<span class="peer-census-open__sheen" aria-hidden="true"></span>' +
    "</button>"
  );
}

function syncPeerCensusOpenButton() {
  const btn = document.getElementById("peerCensusOpen");
  if (!btn) return;
  btn.classList.toggle("is-open", peerCensusState.open);
  btn.setAttribute("aria-expanded", peerCensusState.open ? "true" : "false");
  btn.setAttribute("aria-label", peerCensusState.open ? "Close listening peer map" : "Open listening peer map");
}

function bindPeerCensusOpen() {
  const btn = document.getElementById("peerCensusOpen");
  if (!btn) return;
  btn.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (peerCensusState.open) closePeerCensusPanel();
    else openPeerCensusPanel();
  });
  syncPeerCensusOpenButton();
}

function peerCensusHash(text) {
  let hash = 2166136261;
  const value = String(text || "");
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function peerCensusFormatHost(node) {
  const host = String((node && node.host) || "");
  const port = node && node.port != null ? String(node.port) : "";
  if (!host) return port || "Unknown";
  const wrapped = node.address_type === "ipv6" ? "[" + host + "]" : host;
  return port ? wrapped + ":" + port : wrapped;
}

function peerCensusAddNodeLine(node) {
  return "addnode=" + peerCensusFormatHost(node);
}

function reliableBlake2bPeers(nodes) {
  const list = (nodes || []).filter(function (node) {
    return node && node.network === "blake2b" && node.host;
  });
  if (!list.length) return [];
  let maxHeight = 0;
  let maxOk = 0;
  list.forEach(function (node) {
    const height = Number(node.start_height) || 0;
    const ok = Number(node.ok_count) || 0;
    if (height > maxHeight) maxHeight = height;
    if (ok > maxOk) maxOk = ok;
  });
  const minOk = maxOk ? Math.max(3, Math.floor(maxOk * 0.5)) : 0;
  const scored = list.filter(function (node) {
    const height = Number(node.start_height) || 0;
    const ok = Number(node.ok_count) || 0;
    if (maxHeight && height < maxHeight - 50) return false;
    if (minOk && ok < minOk) return false;
    return true;
  });
  scored.sort(function (a, b) {
    const ok = (Number(b.ok_count) || 0) - (Number(a.ok_count) || 0);
    if (ok) return ok;
    const height = (Number(b.start_height) || 0) - (Number(a.start_height) || 0);
    if (height) return height;
    const portA = Number(a.port) === 8333 ? 0 : 1;
    const portB = Number(b.port) === 8333 ? 0 : 1;
    if (portA !== portB) return portA - portB;
    return peerCensusFormatHost(a).localeCompare(peerCensusFormatHost(b));
  });
  const seen = {};
  const out = [];
  scored.forEach(function (node) {
    const key = node.prefix || "host:" + String(node.host || "");
    if (seen[key]) return;
    seen[key] = true;
    out.push(node);
  });
  return out.slice(0, 16);
}

function peerCensusNetworkLabel(network) {
  return network === "blake2b" ? "BLAKE2b" : "SHA-256";
}

function peerCensusAddressLabel(type) {
  if (type === "ipv6") return "IPv6";
  if (type === "onion") return "Onion";
  return "IPv4";
}

function peerCensusUaFamily(node) {
  const value = String((node && node.ua_family) || "").trim().toLowerCase();
  return PEER_CENSUS_UA_LABEL[value] ? value : "unknown";
}

function peerCensusUaLabel(node) {
  return PEER_CENSUS_UA_LABEL[peerCensusUaFamily(node)] || "Unknown";
}

function peerCensusPrefixKey(node) {
  if (!node) return "none";
  if (node.address_type === "onion") return "onion";
  return String(node.prefix || "").trim() || "none";
}

function peerCensusLocationKey(node) {
  if (!node) return "unknown";
  if (node.address_type === "onion") return "onion";
  const cc = String(node.as_cc || "").trim().toUpperCase();
  return cc.length === 2 ? cc : "unknown";
}

function peerCensusLocationLabel(key) {
  if (key === "onion") return "Onion";
  if (key === "other") return "Other";
  if (key === "unknown") return "Unknown";
  return String(key || "").toUpperCase();
}

function peerCensusAsnLabel(node) {
  const asn = node && node.asn;
  if (asn == null || asn === "") return "No ASN";
  const cc = node.as_cc ? " " + String(node.as_cc) : "";
  return "AS" + String(asn) + cc;
}

function peerCensusNodeLabel(node) {
  const bits = [peerCensusUaLabel(node)];
  if (node && node.asn != null && node.asn !== "") bits.push(peerCensusAsnLabel(node));
  else if (node && node.address_type === "onion") bits.push("Onion");
  const prefix = peerCensusPrefixKey(node);
  if (prefix !== "none" && prefix !== "onion") bits.push(prefix);
  return bits.join(" · ");
}

function peerCensusBadgeText(crawl, summary) {
  crawl = crawl || {};
  const reachable = Number(
    crawl.reachable != null ? crawl.reachable : (summary && summary.reachable) || 0
  ) || 0;
  if (String(crawl.state || "").toLowerCase() === "updating") {
    return "Live, " + formatNumber(reachable) + " listening nodes";
  }
  const pct = Number(crawl.progress_percent);
  if (Number.isFinite(pct)) return "Building map, " + pct.toFixed(2) + "%";
  return "Building map";
}

function peerCensusProgressText(crawl, updatedAt) {
  crawl = crawl || {};
  const bits = [];
  if (crawl.tried != null) bits.push(formatNumber(crawl.tried) + " tried");
  if (crawl.untried != null) bits.push(formatNumber(crawl.untried) + " untried");
  if (crawl.known_addresses != null) bits.push(formatNumber(crawl.known_addresses) + " known");
  const asOf = formatMetricsAsOf(updatedAt);
  if (asOf) bits.push("as of " + asOf);
  return bits.join(" · ");
}

function censusMetricPoint(payload) {
  const summary = (payload && payload.summary) || {};
  const crawl = (payload && payload.crawl) || {};
  const t = Number(payload && payload.updated_at);
  return {
    t: Number.isFinite(t) && t > 1e9 ? t : Math.floor(Date.now() / 1000),
    reachable: Number(summary.reachable != null ? summary.reachable : crawl.reachable) || 0,
    blake2b: Number(summary.blake2b != null ? summary.blake2b : crawl.blake2b) || 0,
    sha256: Number(summary.sha256 != null ? summary.sha256 : crawl.sha256) || 0,
    ipv4: Number(summary.ipv4) || 0,
    ipv6: Number(summary.ipv6) || 0,
    onion: Number(summary.onion) || 0,
    edges: Number(summary.edges) || 0,
    edges_same: Number(summary.edges_same) || 0,
    edges_cross: Number(summary.edges_cross) || 0,
  };
}

function renderPeerCensusCounts(summary) {
  const host = document.getElementById("peerCensusCounts");
  if (!host) return;
  summary = summary || {};
  const main = [
    portalKpiHtml("Reachable", formatNumber(summary.reachable || 0), { chart: "census.reachable" }),
    portalKpiHtml("BLAKE2b", formatNumber(summary.blake2b || 0), { chart: "census.blake2b" }),
    portalKpiHtml("SHA-256", formatNumber(summary.sha256 || 0), { chart: "census.sha256" }),
    portalKpiHtml("IPv4", formatNumber(summary.ipv4 || 0), { chart: "census.ipv4" }),
    portalKpiHtml("IPv6", formatNumber(summary.ipv6 || 0), { chart: "census.ipv6" }),
    portalKpiHtml("Onion", formatNumber(summary.onion || 0), { chart: "census.onion" }),
  ];
  const links = [
    portalKpiHtml("Links", formatNumber(summary.edges || 0), { chart: "census.edges" }),
    portalKpiHtml("Same net", formatNumber(summary.edges_same || 0), { chart: "census.edges_same" }),
    portalKpiHtml("Cross net", formatNumber(summary.edges_cross || 0), { chart: "census.edges_cross" }),
  ];
  host.innerHTML =
    '<section class="metric-board metric-board--chain metric-board--dense" aria-label="Listening peers">' +
    portalKpiStrip(main, "portal-kpi-strip--in-board") +
    portalKpiStrip(links, "portal-kpi-strip--in-board") +
    "</section>";
  paintMetricCharts(host);
}

function peerCensusNodeByKey(key) {
  if (!key) return null;
  return ((peerCensusState.data && peerCensusState.data.nodes) || []).find(function (node) {
    return peerCensusKey(node) === key;
  }) || null;
}

function selectPeerCensusNode(key, fromTable) {
  const node = peerCensusNodeByKey(key);
  peerCensusState.selectedKey = node ? key : "";
  renderPeerCensusDetail(node);
  syncPeerCensusPeerRows();
  paintPeerCensusMap();
  if (fromTable && node) {
    const host = document.getElementById("peerCensusDetail");
    if (host) host.scrollIntoView({ block: "nearest" });
  }
}

function syncPeerCensusPeerRows() {
  const body = document.getElementById("peerCensusPeersBody");
  if (!body) return;
  [].forEach.call(body.rows, function (row) {
    row.classList.toggle("is-selected", row.getAttribute("data-peer-key") === peerCensusState.selectedKey);
  });
}

function renderPeerCensusDetail(node) {
  const host = document.getElementById("peerCensusDetail");
  if (!host) return;
  if (!node) {
    host.hidden = true;
    host.innerHTML = "";
    return;
  }
  host.hidden = false;
  const services = (node.services_decoded || []).filter(Boolean).join(", ");
  const rows = [
    ["Host", '<span class="peer-census-detail-host">' + escapeHtml(peerCensusFormatHost(node)) + "</span>"],
    ["Network", escapeHtml(peerCensusNetworkLabel(node.network))],
    ["Address", escapeHtml(peerCensusAddressLabel(node.address_type))],
    ["Location", escapeHtml(peerCensusLocationLabel(peerCensusLocationKey(node)))],
    ["Family", escapeHtml(peerCensusUaLabel(node))],
    ["Prefix", escapeHtml(node.prefix || (node.address_type === "onion" ? "Onion" : "—"))],
    ["ASN", escapeHtml(node.asn != null && node.asn !== "" ? peerCensusAsnLabel(node) : "—")],
    ["Services", escapeHtml(node.services_group && node.services_group !== "base" ? node.services_group : services || "—")],
    ["Agent", escapeHtml(node.user_agent || "—")],
    ["Height", escapeHtml(node.start_height == null ? "—" : formatNumber(node.start_height))],
    ["Last ok", escapeHtml(node.last_ok ? formatTimeAgo(node.last_ok) : "—")],
  ];
  host.innerHTML =
    '<h3 class="peer-census-detail-title">Peer details</h3><dl>' +
    rows
      .map(function (row) {
        return "<dt>" + metricEscape(row[0]) + "</dt><dd>" + row[1] + "</dd>";
      })
      .join("") +
    "</dl>";
}

function peerCensusGroupBy(nodes, keyFn) {
  const groups = {};
  (nodes || []).forEach(function (node) {
    const key = keyFn(node);
    if (!groups[key]) groups[key] = [];
    groups[key].push(node);
  });
  return groups;
}

function peerCensusFamilyItems(nodes) {
  const families = peerCensusGroupBy(nodes, peerCensusUaFamily);
  const items = [];
  const leftover = [];
  PEER_CENSUS_UA_ORDER.forEach(function (key) {
    const list = families[key] || [];
    if (!list.length) return;
    if (list.length >= 24 && key !== "unknown") {
      items.push({ key: key, nodes: list, weight: list.length });
    } else {
      leftover.push.apply(leftover, list);
    }
  });
  if (leftover.length >= 24) {
    items.push({ key: "other", nodes: leftover, weight: leftover.length });
  } else if (leftover.length && items.length) {
    const host = items.reduce(function (best, item) {
      return item.weight > best.weight ? item : best;
    }, items[0]);
    host.nodes = host.nodes.concat(leftover);
    host.weight = host.nodes.length;
  } else if (leftover.length) {
    items.push({ key: "other", nodes: leftover, weight: leftover.length });
  }
  return items;
}

function peerCensusEstimateLabelWidth(label) {
  const text = String(label || "");
  let width = 0;
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    width += code <= 32 ? 3 : code < 65 ? 5.1 : 6.6;
  }
  return Math.ceil(width + 14);
}

function peerCensusLocationItems(nodes, box) {
  const groups = peerCensusGroupBy(nodes, peerCensusLocationKey);
  const items = [];
  const leftover = [];
  const onion = groups.onion || [];
  const gap = 12;
  const colMin = peerCensusEstimateLabelWidth("Onion");
  const colsPerRow = Math.max(2, Math.floor((Math.max(colMin, (box && box.w) || colMin) + gap) / (colMin + gap)));
  const maxSlots = Math.max(3, colsPerRow * 2);
  const namedCap = Math.max(1, Math.min(7, maxSlots - (onion.length ? 1 : 0) - 1));
  delete groups.onion;
  Object.keys(groups)
    .sort(function (a, b) {
      const diff = groups[b].length - groups[a].length;
      return diff || a.localeCompare(b);
    })
    .forEach(function (key, index) {
      const list = groups[key];
      if (index < namedCap && list.length >= 6) {
        items.push({ key: key, nodes: list, weight: list.length });
      } else {
        leftover.push.apply(leftover, list);
      }
    });
  if (onion.length) items.push({ key: "onion", nodes: onion, weight: onion.length });
  if (leftover.length) items.push({ key: "other", nodes: leftover, weight: leftover.length });
  return items;
}

function peerCensusClusterItems(nodes, box) {
  return peerCensusState.cluster === "family" ? peerCensusFamilyItems(nodes) : peerCensusLocationItems(nodes, box);
}

function peerCensusClusterLabel(item) {
  if (peerCensusState.cluster === "family") return PEER_CENSUS_UA_LABEL[item.key] || item.key;
  return peerCensusLocationLabel(item.key);
}

function peerCensusClusterCount(item) {
  if (!item) return 0;
  if (item.nodes && item.nodes.length) return item.nodes.length;
  return item.weight || 0;
}

function peerCensusClusterCaption(item) {
  return peerCensusClusterLabel(item) + " " + formatNumber(peerCensusClusterCount(item));
}

function peerCensusPackBoxes(items, box, gap, axis) {
  if (!items.length) return [];
  gap = gap || 0;
  if (items.length === 1) return [{ item: items[0], box: box }];
  const horizontal = axis ? axis === "x" : box.w >= box.h;
  const avail = Math.max(1, (horizontal ? box.w : box.h) - gap * (items.length - 1));
  const total = items.reduce(function (sum, item) {
    return sum + Math.max(1, item.weight || 0);
  }, 0);
  const minShare = Math.min(horizontal ? 72 : 40, avail / items.length);
  const hasCore = horizontal && items.some(function (item) { return item.key === "core"; });
  const smallFloor = hasCore ? Math.min(136, Math.max(112, (avail - 180) / Math.max(1, items.length - 1))) : minShare;
  let sizes;
  if (hasCore) {
    const smallCount = items.filter(function (item) { return item.key !== "core"; }).length;
    const reserved = smallFloor * smallCount;
    sizes = items.map(function (item) {
      return item.key === "core" ? Math.max(160, avail - reserved) : smallFloor;
    });
  } else {
    const raw = items.map(function (item) {
      return Math.max(minShare, avail * (Math.max(1, item.weight || 0) / total));
    });
    const rawSum = raw.reduce(function (sum, value) {
      return sum + value;
    }, 0);
    sizes = raw.map(function (value) {
      return (value * avail) / rawSum;
    });
  }
  let cursor = horizontal ? box.x : box.y;
  return items.map(function (item, index) {
    const size = sizes[index];
    const next = horizontal
      ? { item: item, box: { x: cursor, y: box.y, w: size, h: box.h } }
      : { item: item, box: { x: box.x, y: cursor, w: box.w, h: size } };
    cursor += size + gap;
    return next;
  });
}

function peerCensusPackLabeledBoxes(items, box, gap, labelOf) {
  if (!items.length) return [];
  gap = gap || 12;
  const labeled = items.map(function (item) {
    const label = labelOf(item);
    return {
      item: item,
      minW: Math.max(36, Math.min(box.w, peerCensusEstimateLabelWidth(label))),
    };
  });
  const rows = [];
  let row = [];
  let used = 0;
  labeled.forEach(function (entry) {
    const next = row.length ? used + gap + entry.minW : entry.minW;
    if (row.length && next > box.w + 0.5) {
      rows.push(row);
      row = [entry];
      used = entry.minW;
    } else {
      row.push(entry);
      used = next;
    }
  });
  if (row.length) rows.push(row);
  const rowGap = 12;
  const rowH = Math.max(56, (box.h - rowGap * (rows.length - 1)) / rows.length);
  const packed = [];
  rows.forEach(function (entries, rowIndex) {
    const y = box.y + rowIndex * (rowH + rowGap);
    const mins = entries.map(function (entry) {
      return entry.minW;
    });
    const minSum = mins.reduce(function (sum, value) {
      return sum + value;
    }, 0);
    const extra = Math.max(0, box.w - minSum - gap * Math.max(0, entries.length - 1));
    const weights = entries.map(function (entry) {
      return Math.max(1, entry.item.weight || 0);
    });
    const weightSum = weights.reduce(function (sum, value) {
      return sum + value;
    }, 0);
    let x = box.x;
    entries.forEach(function (entry, index) {
      const width = Math.min(box.w, mins[index] + extra * (weights[index] / weightSum));
      packed.push({ item: entry.item, box: { x: x, y: y, w: width, h: rowH } });
      x += width + gap;
    });
  });
  return packed;
}

function peerCensusVogel(index, count, cx, cy, radius) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const n = Math.max(1, count);
  const rad = radius * Math.sqrt((index + 0.5) / n);
  const ang = index * golden;
  return { x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad };
}

function peerCensusClamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function peerCensusPlaceInCell(nodes, cell) {
  const padX = 10;
  const padY = 14;
  const inner = {
    x: cell.x + padX,
    y: cell.y + padY,
    w: Math.max(10, cell.w - padX * 2),
    h: Math.max(10, cell.h - padY * 2),
  };
  const prefixes = peerCensusGroupBy(nodes, peerCensusPrefixKey);
  const keys = Object.keys(prefixes).sort();
  const cx = inner.x + inner.w / 2;
  const cy = inner.y + inner.h / 2;
  const radius = Math.min(inner.w, inner.h) * 0.46;
  const layout = [];
  keys.forEach(function (key, groupIndex) {
    const members = prefixes[key];
    const slot = peerCensusVogel(groupIndex, keys.length, cx, cy, radius);
    members.forEach(function (node, memberIndex) {
      const seed = peerCensusHash(peerCensusKey(node));
      const local =
        members.length === 1
          ? { x: 0, y: 0 }
          : peerCensusVogel(memberIndex, members.length, 0, 0, Math.min(8, 1.6 + members.length * 0.45));
      const jitterX = (((seed & 255) / 255) - 0.5) * 2.4;
      const jitterY = ((((seed >>> 8) & 255) / 255) - 0.5) * 2.4;
      layout.push({
        key: peerCensusKey(node),
        node: node,
        x: peerCensusClamp(slot.x + local.x + jitterX, inner.x + 1, inner.x + inner.w - 1),
        y: peerCensusClamp(slot.y + local.y + jitterY, inner.y + 1, inner.y + inner.h - 1),
      });
    });
  });
  return layout;
}

function layoutPeerCensusNodes(nodes, width, height) {
  const clusters = [];
  const layout = [];
  const list = nodes || [];
  const padX = 10;
  const paneGap = 20;
  const headerH = 22;
  const legendH = 28;
  const box = {
    x: padX,
    y: headerH,
    w: Math.max(40, width - padX * 2),
    h: Math.max(40, height - headerH - legendH),
  };
  const blake = list.filter(function (node) {
    return node.network === "blake2b";
  });
  const sha = list.filter(function (node) {
    return node.network !== "blake2b";
  });
  const blakeShare = list.length
    ? Math.max(0.38, Math.min(0.48, blake.length / list.length + 0.24))
    : 0.42;
  const blakeW = Math.round((box.w - paneGap) * blakeShare);
  const panes = [
    { network: "blake2b", nodes: blake, box: { x: box.x, y: box.y, w: blakeW, h: box.h } },
    {
      network: "sha256",
      nodes: sha,
      box: { x: box.x + blakeW + paneGap, y: box.y, w: box.w - blakeW - paneGap, h: box.h },
    },
  ];
  const splitX = box.x + blakeW + paneGap / 2;

  panes.forEach(function (pane) {
    clusters.push({
      kind: "network",
      label: peerCensusNetworkLabel(pane.network),
      count: pane.nodes.length,
      x: pane.box.x,
      y: 4,
      maxW: pane.box.w,
    });
    if (!pane.nodes.length) return;
    peerCensusPackLabeledBoxes(peerCensusClusterItems(pane.nodes, pane.box), pane.box, 12, peerCensusClusterCaption).forEach(function (packed) {
      const familyBox = packed.box;
      clusters.push({
        kind: "family",
        label: peerCensusClusterLabel(packed.item),
        count: peerCensusClusterCount(packed.item),
        x: familyBox.x,
        y: familyBox.y + 2,
        maxW: familyBox.w,
      });
      layout.push.apply(
        layout,
        peerCensusPlaceInCell(packed.item.nodes, {
          x: familyBox.x,
          y: familyBox.y + 20,
          w: familyBox.w,
          h: Math.max(16, familyBox.h - 20),
        })
      );
    });
  });

  return { layout: layout, clusters: clusters, splitX: splitX };
}

function peerCensusHubPin(edges) {
  const degree = {};
  (edges || []).forEach(function (edge) {
    [edge.a, edge.b].forEach(function (end) {
      const pin = peerCensusPinKey(end);
      if (pin !== "|") degree[pin] = (degree[pin] || 0) + 1;
    });
  });
  let hub = "";
  let best = 0;
  Object.keys(degree).forEach(function (pin) {
    if (degree[pin] > best) {
      hub = pin;
      best = degree[pin];
    }
  });
  return best >= 8 ? hub : "";
}

function peerCensusEaseOut(t) {
  const p = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - p, 3);
}

function peerCensusPointMoved(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy > 1;
}

function peerCensusSnapItem(item) {
  item.x = item.toX;
  item.y = item.toY;
  item.fromX = item.toX;
  item.fromY = item.toY;
  item.opacity = item.leaving ? 0 : 1;
  item.born = false;
}

function tickPeerCensusLayout(now) {
  if (peerCensusPrefersReducedMotion()) {
    peerCensusState.layout = peerCensusState.layout.filter(function (item) {
      if (item.leaving) return false;
      peerCensusSnapItem(item);
      return true;
    });
    peerCensusState.moving = false;
    peerCensusState.allowTween = false;
    return;
  }
  if (!peerCensusState.moving) return;
  let moving = false;
  const keep = [];
  peerCensusState.layout.forEach(function (item) {
    const t = peerCensusEaseOut((now - (item.moveStart || now)) / PEER_CENSUS_MOVE_MS);
    if (item.leaving) {
      item.opacity = 1 - t;
      if (t < 1) {
        moving = true;
        keep.push(item);
      }
      return;
    }
    item.x = item.fromX + (item.toX - item.fromX) * t;
    item.y = item.fromY + (item.toY - item.fromY) * t;
    item.opacity = item.born ? t : 1;
    if (t < 1 && (item.born || peerCensusPointMoved(item.fromX, item.fromY, item.toX, item.toY))) {
      moving = true;
    } else {
      peerCensusSnapItem(item);
    }
    keep.push(item);
  });
  peerCensusState.layout = keep;
  peerCensusState.moving = moving;
  if (!moving) peerCensusState.allowTween = false;
  if (moving) peerCensusState.edgeCacheKey = "";
}

function ensurePeerCensusLayout(nodes, width, height) {
  const data = peerCensusState.data;
  const key = [
    Math.round(width),
    Math.round(height),
    (nodes || []).length,
    data && data.updated_at,
    data && data.fresh_seconds,
    peerCensusState.cluster || "location",
  ].join("|");
  if (key === peerCensusState.layoutKey && !peerCensusState.moving) {
    return;
  }
  if (key === peerCensusState.layoutKey) {
    tickPeerCensusLayout(peerCensusState.now || performance.now());
    return;
  }
  const next = layoutPeerCensusNodes(nodes, width, height);
  const hubPin = peerCensusHubPin(data && data.edges);
  next.layout.forEach(function (item) {
    item.hub = peerCensusPinKey(item.node) === hubPin;
  });
  const now = performance.now();
  peerCensusState.now = now;
  const prevByKey = {};
  peerCensusState.layout.forEach(function (item) {
    if (!item.leaving) prevByKey[item.key] = item;
  });
  const snap = peerCensusPrefersReducedMotion() || !peerCensusState.layout.length || (peerCensusIsLean() && !peerCensusState.allowTween);
  let moving = false;
  const incoming = next.layout.map(function (item) {
    const prev = prevByKey[item.key];
    if (prev) delete prevByKey[item.key];
    item.toX = item.x;
    item.toY = item.y;
    item.moveStart = now;
    if (!prev || snap) {
      item.fromX = item.x;
      item.fromY = item.y;
      item.born = !prev && !snap;
      item.opacity = item.born ? 0 : 1;
      if (item.born) moving = true;
      return item;
    }
    item.fromX = prev.x;
    item.fromY = prev.y;
    item.x = prev.x;
    item.y = prev.y;
    item.opacity = prev.opacity == null ? 1 : prev.opacity;
    item.born = false;
    if (peerCensusPointMoved(item.fromX, item.fromY, item.toX, item.toY)) moving = true;
    return item;
  });
  if (!snap) {
    Object.keys(prevByKey).forEach(function (key) {
      const prev = prevByKey[key];
      prev.leaving = true;
      prev.fromX = prev.x;
      prev.fromY = prev.y;
      prev.toX = prev.x;
      prev.toY = prev.y;
      prev.moveStart = now;
      incoming.push(prev);
      moving = true;
    });
  }
  peerCensusState.layoutKey = key;
  peerCensusState.layout = incoming;
  peerCensusState.clusters = next.clusters;
  peerCensusState.splitX = next.splitX;
  peerCensusState.hubKey = (next.layout.find(function (item) { return item.hub; }) || {}).key || "";
  peerCensusState.moving = moving;
  if (moving) peerCensusState.edgeCacheKey = "";
  tickPeerCensusLayout(now);
}

function peerCensusSnap(n) {
  return Math.round(n) + 0.5;
}

const PEER_CENSUS_COLORS = {
  "blake2b:ipv4": "#f3c48a",
  "blake2b:ipv6": "#e09a52",
  "blake2b:onion": "#8f4318",
  "sha256:ipv4": "#d7c7a4",
  "sha256:ipv6": "#9a8460",
  "sha256:onion": "#6b5736",
};

function peerCensusNodeColor(node) {
  const network = node && node.network === "blake2b" ? "blake2b" : "sha256";
  const type = node && (node.address_type === "ipv6" || node.address_type === "onion") ? node.address_type : "ipv4";
  return PEER_CENSUS_COLORS[network + ":" + type];
}

function peerCensusPrefersReducedMotion() {
  if (!window.matchMedia) return false;
  if (!peerCensusState.motionMq) {
    peerCensusState.motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  }
  return peerCensusState.motionMq.matches;
}

function peerCensusIsLean() {
  if (peerCensusPrefersReducedMotion()) return true;
  if (!window.matchMedia) return false;
  if (!peerCensusState.leanMq) {
    peerCensusState.leanMq = window.matchMedia("(max-width: 720px), (pointer: coarse)");
  }
  return peerCensusState.leanMq.matches;
}

function peerCensusDpr() {
  const dpr = window.devicePixelRatio || 1;
  return peerCensusIsLean() ? Math.min(dpr, 1.25) : dpr;
}

function peerCensusMarkColor(item, selected) {
  if (selected || item.key === peerCensusState.hoverKey) return "#ffffff";
  return peerCensusNodeColor(item.node);
}

function peerCensusLabelStyle(kind) {
  if (kind === "network") {
    return { font: "700 11px ui-sans-serif, system-ui, sans-serif", fill: "#f0d2b0", padX: 6, padY: 3, h: 16 };
  }
  if (kind === "family") {
        return { font: "600 10px ui-sans-serif, system-ui, sans-serif", fill: "#efe4d6", padX: 5, padY: 2, h: 15 };
  }
  return { font: "600 9px ui-sans-serif, system-ui, sans-serif", fill: "#d8c4ae", padX: 5, padY: 2, h: 14 };
}

function peerCensusBoxesOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function paintPeerCensusClusters(ctx, width, height) {
  ctx.save();
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  const placed = [];
  const order = { network: 0, family: 1, asn: 2 };
  const labels = (peerCensusState.clusters || []).slice().sort(function (a, b) {
    return (order[a.kind] || 9) - (order[b.kind] || 9);
  });
  labels.forEach(function (item) {
    const style = peerCensusLabelStyle(item.kind);
    ctx.font = style.font;
    const text = item.label;
    const countText = item.count != null ? " " + formatNumber(item.count) : "";
    const nameW = ctx.measureText(text).width;
    const countW = countText ? ctx.measureText(countText).width : 0;
    const box = {
      x: item.x,
      y: item.y,
      w: nameW + countW + style.padX * 2,
      h: style.h,
    };
    if (box.x + box.w > width - 4) box.x = Math.max(4, width - 4 - box.w);
    let attempts = 0;
    while (attempts < 4 && placed.some(function (prev) { return peerCensusBoxesOverlap(prev, box); })) {
      box.y += style.h + 1;
      attempts += 1;
    }
    if (item.kind !== "family" && placed.some(function (prev) { return peerCensusBoxesOverlap(prev, box); })) return;
    placed.push(box);
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = "#110f0d";
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.globalAlpha = 1;
    ctx.fillStyle = item.kind === "network" ? (item.label === "BLAKE2b" ? "#e09a52" : "#e2c08a") : style.fill;
    ctx.fillText(text, box.x + style.padX, box.y + style.padY);
    if (countText) {
      ctx.fillStyle = item.kind === "network" ? "#c4a07a" : "#b9a790";
      ctx.fillText(countText, box.x + style.padX + nameW, box.y + style.padY);
    }
  });
  ctx.restore();
}

function peerCensusEdgeGradient(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, "#c46a2e");
  g.addColorStop(0.16, "#cc7838");
  g.addColorStop(0.34, "#d4894a");
  g.addColorStop(0.52, "#dc964e");
  g.addColorStop(0.68, "#e09a52");
  g.addColorStop(0.84, "#e4a86a");
  g.addColorStop(1, "#e8b070");
  return g;
}

function paintPeerCensusEdges(ctx) {
  const edges = (peerCensusState.data && peerCensusState.data.edges) || [];
  if (!edges.length) return;
  const byKey = {};
  const byPin = {};
  peerCensusState.layout.forEach(function (item) {
    byKey[item.key] = item;
    byPin[peerCensusPinKey(item.node)] = item;
  });
  const lookup = function (end) {
    const node = end || {};
    return byKey[peerCensusKey(node)] || byPin[peerCensusPinKey(node)] || null;
  };
  const focus = peerCensusState.hoverKey || peerCensusState.selectedKey;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  edges.forEach(function (edge) {
    const left = lookup(edge.a || edge.source || edge.from);
    const right = lookup(edge.b || edge.target || edge.to);
    if (!left || !right) return;
    const active = focus && (left.key === focus || right.key === focus);
    const x0 = peerCensusSnap(left.x);
    const y0 = peerCensusSnap(left.y);
    const x1 = peerCensusSnap(right.x);
    const y1 = peerCensusSnap(right.y);
    ctx.globalAlpha = active ? 0.92 : 0.2;
    ctx.strokeStyle = active ? "#ffffff" : (peerCensusIsLean() ? "#d4894a" : peerCensusEdgeGradient(ctx, x0, y0, x1, y1));
    ctx.lineWidth = active ? 1.2 : 0.7;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

function paintPeerCensusEdgesCached(ctx, width, height, dpr) {
  if (peerCensusState.moving) {
    paintPeerCensusEdges(ctx);
    return;
  }
  const key = [
    width,
    height,
    peerCensusState.layoutKey,
    peerCensusState.hoverKey,
    peerCensusState.selectedKey,
    ((peerCensusState.data && peerCensusState.data.edges) || []).length,
  ].join("|");
  if (!peerCensusState.edgeLayer) peerCensusState.edgeLayer = document.createElement("canvas");
  const layer = peerCensusState.edgeLayer;
  const nextW = Math.round(width * dpr);
  const nextH = Math.round(height * dpr);
  if (peerCensusState.edgeCacheKey !== key || layer.width !== nextW || layer.height !== nextH) {
    layer.width = nextW;
    layer.height = nextH;
    const layerCtx = layer.getContext("2d");
    layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layerCtx.clearRect(0, 0, width, height);
    paintPeerCensusEdges(layerCtx);
    peerCensusState.edgeCacheKey = key;
  }
  ctx.drawImage(layer, 0, 0, width, height);
}

function drawPeerCensusMark(ctx, item, selected) {
  const type = item.node.address_type;
  const x = peerCensusSnap(item.x);
  const y = peerCensusSnap(item.y);
  const focused = selected || item.key === peerCensusState.hoverKey;
  const scale = item.node && item.node.network === "blake2b" ? 1 : 0.62;
  const paint = peerCensusMarkColor(item, selected);
  ctx.globalAlpha = item.opacity == null ? 1 : item.opacity;
  ctx.strokeStyle = paint;
  ctx.fillStyle = paint;
  ctx.lineWidth = scale < 1 ? 1 : 1.2;
  ctx.lineJoin = "miter";
  ctx.lineCap = "butt";
  ctx.beginPath();
  if (type === "ipv6") {
    const s = (focused || item.hub ? 4.5 : 3.5) * scale;
    ctx.strokeRect(x - s, y - s, s * 2, s * 2);
  } else if (type === "onion") {
    const s = (focused || item.hub ? 5 : 4) * scale;
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s, y + s);
    ctx.lineTo(x - s, y + s);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.arc(x, y, (focused || item.hub ? 2.8 : 2.1) * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  if (item.hub) {
    ctx.beginPath();
    ctx.strokeStyle = focused ? "#ffffff" : "#f3c48a";
    ctx.lineWidth = 1.2;
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function startPeerCensusAnim() {
  if (peerCensusState.raf || !peerCensusState.open) return;
  if (peerCensusPrefersReducedMotion() || document.hidden || !peerCensusState.moving) {
    return;
  }
  const tick = function (ts) {
    if (!peerCensusState.open || document.hidden || peerCensusPrefersReducedMotion() || !peerCensusState.moving) {
      peerCensusState.raf = 0;
      paintPeerCensusMap();
      return;
    }
    peerCensusState.now = ts;
    paintPeerCensusMap();
    peerCensusState.raf = requestAnimationFrame(tick);
  };
  peerCensusState.raf = requestAnimationFrame(tick);
}

function stopPeerCensusAnim() {
  if (peerCensusState.raf) cancelAnimationFrame(peerCensusState.raf);
  peerCensusState.raf = 0;
}

function paintPeerCensusMap() {
  const canvas = document.getElementById("peerCensusCanvas");
  const wrap = document.getElementById("peerCensusMap");
  if (!canvas || !wrap || wrap.clientWidth < 8) return;
  const dpr = peerCensusDpr();
  const width = wrap.clientWidth;
  const height = wrap.clientHeight;
  const nextW = Math.round(width * dpr);
  const nextH = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  if (canvas.width !== nextW || canvas.height !== nextH) {
    canvas.width = nextW;
    canvas.height = nextH;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, width, height);
  const data = peerCensusState.data;
  const nodes = (data && data.nodes) || [];
  peerCensusState.size = { w: width, h: height };
  if (!peerCensusState.now) peerCensusState.now = performance.now();
  ensurePeerCensusLayout(nodes, width, height);
  paintPeerCensusEdgesCached(ctx, width, height, dpr);

  const hoverKey = peerCensusState.hoverKey;
  const selectedKey = peerCensusState.selectedKey;
  peerCensusState.layout.forEach(function (item) {
    if (item.key === hoverKey || item.key === selectedKey) return;
    drawPeerCensusMark(ctx, item, false);
  });
  peerCensusState.layout.forEach(function (item) {
    if (item.key !== hoverKey && item.key !== selectedKey) return;
    drawPeerCensusMark(ctx, item, item.key === selectedKey);
  });
  paintPeerCensusClusters(ctx, width, height);
  const hub = peerCensusState.layout.find(function (item) {
    return item.hub;
  });
  if (hub && hub.key !== hoverKey && hub.key !== selectedKey) {
    drawPeerCensusMark(ctx, hub, false);
    ctx.save();
    ctx.font = "700 10px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const tag = "This host";
    const tw = ctx.measureText(tag).width;
    const tx = Math.min(hub.x + 10, width - tw - 16);
    const ty = Math.max(6, hub.y - 18);
    ctx.fillStyle = "#110f0d";
    ctx.fillRect(tx - 5, ty - 2, tw + 10, 16);
    ctx.fillStyle = "#f0d2b0";
    ctx.fillText(tag, tx, ty);
    ctx.restore();
  }

  const focus = peerCensusState.layout.find(function (item) {
    return item.key === hoverKey || item.key === selectedKey;
  });
  if (focus) {
    const host = peerCensusFormatHost(focus.node);
    const cluster = (focus.hub ? "This host · " : "") + peerCensusNodeLabel(focus.node);
    ctx.font = "700 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    const hostW = ctx.measureText(host).width;
    ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
    const clusterW = ctx.measureText(cluster).width;
    const pad = 7;
    const tw = Math.min(Math.max(hostW, clusterW), width - 28);
    const boxH = 34;
    let tx = Math.min(Math.max(focus.x, 14 + tw / 2), width - 14 - tw / 2);
    let ty = focus.y - 24;
    if (ty < 36) ty = focus.y + 28;
    ctx.fillStyle = "#110f0d";
    ctx.fillRect(tx - tw / 2 - pad, ty - 13, tw + pad * 2, boxH);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "700 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.fillText(host, tx, ty + 1, width - 28);
    ctx.fillStyle = "#f0d2b0";
    ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(cluster, tx, ty + 15, width - 28);
  }
}

function peerCensusHit(x, y) {
  let best = null;
  let bestDist = 16;
  peerCensusState.layout.forEach(function (item) {
    if (item.leaving) return;
    const dx = item.x - x;
    const dy = item.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const limit = item.hub ? 22 : 14;
    if (dist <= limit && dist <= bestDist) {
      best = item;
      bestDist = dist;
    }
  });
  return best;
}

function peerCensusCanvasPoint(event) {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * (peerCensusState.size.w || rect.width),
    y: ((event.clientY - rect.top) / rect.height) * (peerCensusState.size.h || rect.height),
  };
}

function onPeerCensusMove(event) {
  const point = peerCensusCanvasPoint(event);
  const hit = peerCensusHit(point.x, point.y);
  const next = hit ? hit.key : "";
  if (next === peerCensusState.hoverKey) return;
  peerCensusState.hoverKey = next;
  paintPeerCensusMap();
}

function onPeerCensusLeave() {
  if (!peerCensusState.hoverKey) return;
  peerCensusState.hoverKey = "";
  paintPeerCensusMap();
}

function onPeerCensusClick(event) {
  const point = peerCensusCanvasPoint(event);
  const hit = peerCensusHit(point.x, point.y);
  selectPeerCensusNode(hit ? hit.key : "");
}

function applyPeerCensusPayload(payload, statusText) {
  peerCensusState.data = payload || null;
  const summary = (payload && payload.summary) || {};
  const crawl = (payload && payload.crawl) || {};
  const badge = document.getElementById("peerCensusBadge");
  const progress = document.getElementById("peerCensusProgress");
  const status = document.getElementById("peerCensusStatus");
  if (badge) {
    badge.textContent = peerCensusBadgeText(crawl, summary);
    badge.classList.toggle("is-live", String(crawl.state || "").toLowerCase() === "updating");
  }
  if (progress) {
    const line = peerCensusProgressText(crawl, payload && payload.updated_at);
    progress.hidden = !line;
    progress.textContent = line;
  }
  if (payload && payload.ready !== false) mergeMetricPoint("census", censusMetricPoint(payload));
  renderPeerCensusCounts(summary);
  const selected = ((payload && payload.nodes) || []).find(function (node) {
    return peerCensusKey(node) === peerCensusState.selectedKey;
  });
  if (!selected) peerCensusState.selectedKey = "";
  renderPeerCensusDetail(selected || null);
  renderPeerCensusPeers((payload && payload.nodes) || []);
  syncPeerCensusPeerRows();
  paintPeerCensusMap();
  startPeerCensusAnim();
  if (status) status.textContent = statusText || "";
}

function renderPeerCensusPeers(nodes) {
  const host = document.getElementById("peerCensusPeers");
  const body = document.getElementById("peerCensusPeersBody");
  const copyAll = document.getElementById("peerCensusPeersCopyAll");
  if (!host || !body) return;
  const peers = reliableBlake2bPeers(nodes);
  host.hidden = !peers.length;
  if (copyAll) {
    copyAll.hidden = !peers.length;
    copyAll.dataset.lines = peers.map(peerCensusAddNodeLine).join("\n");
  }
  const hubPin = peerCensusHubPin((peerCensusState.data && peerCensusState.data.edges) || []);
  withLiveView(host, function () {
  body.innerHTML = peers
    .map(function (node) {
      const line = peerCensusAddNodeLine(node);
      const hub = hubPin && peerCensusPinKey(node) === hubPin;
      return (
        "<tr data-peer-key=\"" +
        escapeHtml(peerCensusKey(node)) +
        "\">" +
        "<td><span class=\"peer-census-detail-host\">" +
        escapeHtml(peerCensusFormatHost(node)) +
        "</span>" +
        (hub ? " <span class=\"peer-census-peers-hub\">This host</span>" : "") +
        "</td>" +
        "<td>" +
        escapeHtml(peerCensusAddressLabel(node.address_type)) +
        "</td>" +
        "<td>" +
        escapeHtml(node.start_height == null ? "—" : formatNumber(node.start_height)) +
        "</td>" +
        "<td><button type=\"button\" class=\"datum-pool-copy peer-census-peers-copy\" data-copy=\"" +
        escapeHtml(line).replace(/"/g, "&quot;") +
        "\" title=\"Copy bitcoin.conf line\" aria-label=\"Copy " +
        escapeHtml(line).replace(/"/g, "&quot;") +
        "\"><span class=\"datum-pool-copy__value\">" +
        escapeHtml(line) +
        "</span></button></td>" +
        "</tr>"
      );
    })
    .join("");
  });
}

function stopPeerCensusPolling() {
  if (peerCensusState.timer) {
    clearInterval(peerCensusState.timer);
    peerCensusState.timer = 0;
  }
  if (peerCensusState.retryTimer) {
    clearTimeout(peerCensusState.retryTimer);
    peerCensusState.retryTimer = 0;
  }
}

async function fetchPeerCensusPayload() {
  const response = await fetch("/api/blockvase/p2p-nodes", { credentials: "include", cache: "no-store" });
  let body = null;
  try {
    body = await response.json();
  } catch (_) {
    body = {};
  }
  return { status: response.status, body: body || {} };
}

async function refreshPeerCensus(isRetry) {
  if (!peerCensusState.open || peerCensusState.loading) return;
  peerCensusState.loading = true;
  const status = document.getElementById("peerCensusStatus");
  if (status && !peerCensusState.data) status.textContent = "Loading listening peers…";
  try {
    const result = await fetchPeerCensusPayload();
    if (result.status === 503) {
      applyPeerCensusPayload(peerCensusState.data, result.body.message || "Census snapshot is not ready yet.");
      schedulePeerCensusRetry();
      return;
    }
    if (result.status !== 200 || !result.body.ready) {
      applyPeerCensusPayload(peerCensusState.data, result.body.error || result.body.message || "Census snapshot is unavailable.");
      schedulePeerCensusRetry();
      return;
    }
    applyPeerCensusPayload(result.body, result.body.warning || "");
    startPeerCensusPolling();
  } catch (error) {
    applyPeerCensusPayload(peerCensusState.data, error.message || "Census snapshot is unavailable.");
    schedulePeerCensusRetry();
  } finally {
    peerCensusState.loading = false;
  }
}

function startPeerCensusPolling() {
  if (peerCensusState.timer) return;
  peerCensusState.timer = setInterval(function () {
    refreshPeerCensus(false);
  }, PEER_CENSUS_POLL_MS);
}

function schedulePeerCensusRetry() {
  if (peerCensusState.retryTimer || !peerCensusState.open) return;
  peerCensusState.retryTimer = setTimeout(function () {
    peerCensusState.retryTimer = 0;
    refreshPeerCensus(true);
  }, PEER_CENSUS_RETRY_MS);
}

function openPeerCensusPanel() {
  const panel = document.getElementById("peerCensusPanel");
  if (!panel) return;
  peerCensusState.open = true;
  panel.hidden = false;
  panel.setAttribute("aria-hidden", "false");
  syncPeerCensusOpenButton();
  if (!peerCensusState.data) renderPeerCensusCounts({});
  paintPeerCensusMap();
  startPeerCensusAnim();
  refreshPeerCensus(false);
}

function closePeerCensusPanel() {
  const panel = document.getElementById("peerCensusPanel");
  peerCensusState.open = false;
  stopPeerCensusAnim();
  stopPeerCensusPolling();
  if (panel) {
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
  }
  syncPeerCensusOpenButton();
}

function syncPeerCensusClusterToggle() {
  const mode = peerCensusState.cluster === "family" ? "family" : "location";
  [].forEach.call(document.querySelectorAll("[data-peer-cluster]"), function (btn) {
    const active = btn.getAttribute("data-peer-cluster") === mode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function setPeerCensusCluster(mode) {
  const next = mode === "family" ? "family" : "location";
  if (peerCensusState.cluster === next) return;
  peerCensusState.cluster = next;
  peerCensusState.layoutKey = "";
  peerCensusState.allowTween = true;
  syncPeerCensusClusterToggle();
  if (peerCensusState.open) {
    paintPeerCensusMap();
    startPeerCensusAnim();
  }
}

function initPeerCensusPanel() {
  renderPeerCensusCounts({});
  syncPeerCensusClusterToggle();
  const closeBtn = document.getElementById("peerCensusClose");
  const canvas = document.getElementById("peerCensusCanvas");
  const map = document.getElementById("peerCensusMap");
  if (closeBtn) closeBtn.addEventListener("click", closePeerCensusPanel);
  const clusterToggle = document.querySelector(".peer-census-cluster-toggle");
  if (clusterToggle) {
    clusterToggle.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-peer-cluster]");
      if (!btn || !clusterToggle.contains(btn)) return;
      setPeerCensusCluster(btn.getAttribute("data-peer-cluster"));
    });
  }
  if (canvas) {
    canvas.addEventListener("mousemove", onPeerCensusMove);
    canvas.addEventListener("mouseleave", onPeerCensusLeave);
    canvas.addEventListener("click", onPeerCensusClick);
  }
  if (map && typeof ResizeObserver === "function") {
    let resizeTimer = 0;
    const observer = new ResizeObserver(function () {
      if (!peerCensusState.open) return;
      if (!peerCensusIsLean()) {
        paintPeerCensusMap();
        return;
      }
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resizeTimer = 0;
        paintPeerCensusMap();
      }, 80);
    });
    observer.observe(map);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopPeerCensusAnim();
    else if (peerCensusState.open) {
      paintPeerCensusMap();
      startPeerCensusAnim();
    }
  });
  const peers = document.getElementById("peerCensusPeers");
  if (peers) {
    peers.addEventListener("click", function (event) {
      const copy = event.target.closest(".peer-census-peers-copy, .peer-census-peers-copyall");
      if (copy) {
        event.preventDefault();
        event.stopPropagation();
        const text = copy.getAttribute("data-copy") || copy.dataset.copy || copy.dataset.lines || "";
        const value = copy.querySelector(".datum-pool-copy__value") || copy;
        const prev = value.textContent;
        copyTextToClipboard(text, copy).then(function (ok) {
          if (!ok) return;
          copy.classList.add("is-copied");
          value.textContent = "Copied";
          window.setTimeout(function () {
            copy.classList.remove("is-copied");
            value.textContent = prev;
          }, 1200);
        });
        return;
      }
      const row = event.target.closest("tr[data-peer-key]");
      if (!row) return;
      selectPeerCensusNode(row.getAttribute("data-peer-key"), true);
    });
  }
}

function resetViewerToLiveMempool() {
  cancelPortalMempoolSearch();
  const input = document.getElementById("mempoolTxSearchInput");
  if (input) input.value = "";
  setPortalMempoolSearchStatus("");
  setPortalSearchingNode(false);
  clearViewerTxidFromLocation();
  blockCarouselState.pendingSelectTxid = "";
  closeTxExplorerPanel();
  clearBlockTxsRetry();
  const live = (blockCarouselState.items || []).find(function (b) { return b && b.mining; });
  if (live) {
    void selectBlockCarouselItem("live");
  } else {
    blockCarouselState.selected = "live";
    blockCarouselState.loadingKey = "";
    blockCarouselState.pinScrollKey = "live";
    renderBlockCarouselRefresh();
    postToMempoolIframe({ type: "blockvase-resume-mempool", selectTxid: "" });
  }
  window.scrollTo(0, 0);
  closePeerCensusPanel();
}

function setViewerTxidInLocation(txid) {
  const url = new URL(window.location.href);
  url.searchParams.delete("tx");
  url.searchParams.delete("txid");
  url.hash = viewerTxLocationHash(txid);
  const next = url.pathname + url.search + url.hash;
  const cur = window.location.pathname + window.location.search + window.location.hash;
  if (cur === next) return;
  syncingViewerTxLocation = true;
  history.replaceState(null, "", next);
  syncingViewerTxLocation = false;
}

function clearViewerTxidFromLocation() {
  const url = new URL(window.location.href);
  const hash = portalHashRaw();
  const hasQueryTx = url.searchParams.has("tx") || url.searchParams.has("txid");
  const hasHashTx = /(?:^|[?&])tx(?:id)?=/i.test(hash) || /^(?:viewer\/)?tx[=/]/i.test(hash);
  if (!hasQueryTx && !hasHashTx) return;
  url.searchParams.delete("tx");
  url.searchParams.delete("txid");
  url.hash = "#viewer";
  const next = url.pathname + url.search + url.hash;
  const cur = window.location.pathname + window.location.search + window.location.hash;
  if (cur === next) return;
  syncingViewerTxLocation = true;
  history.replaceState(null, "", next);
  syncingViewerTxLocation = false;
}

function clearViewerForLinkedTx() {
  cancelPortalMempoolSearch();
  setPortalMempoolSearchStatus("");
  setPortalSearchingNode(false);
  blockCarouselState.pendingSelectTxid = "";
  blockCarouselState.selected = "";
  blockCarouselState.loadingKey = "";
  blockCarouselState.pinScrollKey = "";
  closeTxExplorerPanel(true);
  clearBlockTxsRetry();
  renderBlockCarouselRefresh();
  postToMempoolIframe({ type: "blockvase-clear-mempool" });
}

function applyViewerTxDeepLink() {
  const txid = parseViewerTxidFromLocation();
  if (!txid) return;
  clearViewerForLinkedTx();
  setViewerTxidInLocation(txid);
  const input = document.getElementById("mempoolTxSearchInput");
  if (input) input.value = txid;
  portalMempoolSearch(txid, true, { skipIframe: true });
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

  function search(query, fromSubmit, options) {
    const q = String(query || "").trim();
    const opts = options || {};
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
    if (isCompleteBlockHeightSearch(q) || opts.skipIframe) {
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
      applySearchHitToCarouselItem(data);
      const ok = await selectBlockCarouselItem(String(data.height), { force: true, hydrateNeighbors: true });
      if (seq != null && seq !== portalSearchSeq) return false;
      if (ok) {
        setPortalMempoolSearchStatus("Showing block #" + formatNumber(data.height) + ".");
      }
      return ok;
    }
    if (!data.txid) return false;
    if (data.source === "block" && data.height == null) {
      if (data.details) openTxExplorer(data.txid, data.details);
      setPortalMempoolSearchStatus("Searching node", false, { searching: true, hold: true });
      return false;
    }
    const wantLive = data.source === "mempool";
    const key = wantLive ? "live" : (data.height == null ? "" : String(data.height));
    if (!wantLive && data.height != null) applySearchHitToCarouselItem(data);
    const alreadyThere = Boolean(key) && blockCarouselState.selected === key;
    if (alreadyThere) {
      blockCarouselState.pinScrollKey = key;
      if (!wantLive && data.height != null) {
        void hydrateCarouselRangeAroundHeight(data.height, data.hash || "");
      }
      revealPinnedCarouselCard();
      if (blockCarouselState.loadingKey) blockCarouselState.pendingSelectTxid = data.txid;
      else postToMempoolIframe({ type: "blockvase-select-tx", txid: data.txid });
      openTxExplorer(data.txid, data.details);
      setPortalMempoolSearchStatus(
        data.matches > 1 ? "Showing the closest of " + data.matches + " matches." : "Showing the matching transaction."
      );
      return true;
    }
    const ok = await selectBlockCarouselItem(key, { selectTxid: data.txid, force: true, tx: data.tx, details: data.details, hydrateNeighbors: true });
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
  portalMempoolSearch = search;
  cancelPortalMempoolSearch = function () {
    portalSearchSeq += 1;
    clearTimeout(debounce);
    setPortalMempoolSearchStatus("");
  };
  window.addEventListener("message", (ev) => {
    if (ev.origin !== window.location.origin) return;
    if (ev.data?.type !== "blockvase-tx-search-result") return;
    if (ev.data.seq != null && ev.data.seq !== portalSearchSeq) return;
    if (!ev.data.isMiss && ev.data.txid) {
      if (blockCarouselState.loadingKey || (blockCarouselState.selected && blockCarouselState.selected !== "live")) {
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
  const raw = portalHashTabPart(name).toLowerCase();
  if (!raw) return "viewer";
  if (raw === "tx" || raw.indexOf("tx/") === 0 || raw.indexOf("tx=") === 0 || raw.indexOf("viewer/tx/") === 0) {
    return "viewer";
  }
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
  const navTabNames = new Set(["viewer", "pool", "lightning", "shop", "resources"]);
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
    const url = new URL(window.location.href);
    url.searchParams.delete("tx");
    url.searchParams.delete("txid");
    if (tabName === "viewer") {
      url.hash = viewerTxLocationHash(parseViewerTxidFromLocation());
    } else {
      url.hash = "#" + tabName;
    }
    const next = url.pathname + url.search + url.hash;
    const cur = window.location.pathname + window.location.search + window.location.hash;
    if (cur !== next) {
      syncingViewerTxLocation = true;
      history.replaceState(null, "", next);
      syncingViewerTxLocation = false;
    }
  }

  function currentPortalTab() {
    const active = buttons.find((button) => button.classList.contains("is-active"));
    return normalizePortalTab(active && active.dataset.portalTab);
  }

  function goPortalHome() {
    resetViewerToLiveMempool();
    showTab("viewer");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.portalTab;
      if (tab === "viewer" && currentPortalTab() === "viewer") {
        resetViewerToLiveMempool();
        return;
      }
      showTab(tab);
    });
  });
  const homeLink = document.getElementById("portalHomeLink");
  if (homeLink) {
    homeLink.addEventListener("click", function (event) {
      event.preventDefault();
      goPortalHome();
    });
  }
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-portal-tab-link]");
    if (!link) return;
    event.preventDefault();
    showTab(link.dataset.portalTabLink);
  });
  window.addEventListener("hashchange", () => {
    if (syncingViewerTxLocation) return;
    const txid = parseViewerTxidFromLocation();
    showTab(window.location.hash.replace("#", ""));
    if (txid && normalizePortalTab(window.location.hash.replace("#", "")) === "viewer") {
      applyViewerTxDeepLink();
    }
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
    return normalizePortalTab(window.location.hash.replace("#", ""));
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

const TX_FLOW_COLORS_STUDIO = [
  "#e4b07a", "#e09a52", "#c46a2e", "#b85a2e", "#d4894a",
  "#8c4a28", "#a85224", "#c67a3a", "#d4a06a", "#9a5230",
];

function txFlowPalette() {
  return TX_FLOW_COLORS_STUDIO;
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
  return "#e09a52";
}

function txFlowHoverColor() {
  return "#e4b07a";
}

function txFlowWireColor(el, txNode) {
  const dipped = !!(el && el.classList.contains("is-flashing")) || !!(txNode && txNode.classList.contains("is-flashing"));
  if (dipped) return (el && el.dataset.color) || txFlowFallbackColor();
  if (txFlowNodeIsHighlighted(el) || txFlowNodeIsHighlighted(txNode)) return txFlowHoverColor();
  return (el && el.dataset.color) || txFlowFallbackColor();
}

function txFlowCopperGradient(id) {
  return (
    '<linearGradient id="' +
    id +
    '" x1="0" y1="1" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#c46a2e"/>' +
    '<stop offset="16%" stop-color="#cc7838"/>' +
    '<stop offset="34%" stop-color="#d4894a"/>' +
    '<stop offset="52%" stop-color="#dc964e"/>' +
    '<stop offset="68%" stop-color="#e09a52"/>' +
    '<stop offset="84%" stop-color="#e4a86a"/>' +
    '<stop offset="100%" stop-color="#e8b070"/>' +
    "</linearGradient>"
  );
}

function txFlowWireStrokeAttrs(color, gradientId) {
  const value = String(color || "").toLowerCase();
  if (value === "#ffffff" || value === "white") return 'stroke="#ffffff" style="stroke:#ffffff"';
  return 'stroke="url(#' + gradientId + ')" style="stroke:url(#' + gradientId + ')"';
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
  const gradientId = "txFlowCopperWire";
  let paths = "<defs>" + txFlowCopperGradient(gradientId) + "</defs>";
  ins.forEach(function (el) {
    const a = txFlowRelRect(board, el);
    const strokeAttrs = txFlowWireStrokeAttrs(txFlowWireColor(el, txNode), gradientId);
    paths +=
      '<path d="' +
      txFlowCurve(a.x + a.w, a.y + a.h / 2, mid.x, mid.y + mid.h / 2) +
      '" fill="none" ' +
      strokeAttrs +
      ' stroke-width="' +
      (el.dataset.stroke || "1.25") +
      '" stroke-linecap="round" opacity="0.82"></path>';
  });
  outs.forEach(function (el) {
    const a = txFlowRelRect(board, el);
    const strokeAttrs = txFlowWireStrokeAttrs(txFlowWireColor(el, txNode), gradientId);
    paths +=
      '<path d="' +
      txFlowCurve(mid.x + mid.w, mid.y + mid.h / 2, a.x, a.y + a.h / 2) +
      '" fill="none" ' +
      strokeAttrs +
      ' stroke-width="' +
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
    } else if (data?.type === "blockvase-clear-mempool" && typeof win.clearMempoolView === "function") {
      win.clearMempoolView();
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
    openTxExplorer._txid = "";
    if (!openTxExplorer._keepLocation) clearViewerTxidFromLocation();
    openTxExplorer._keepLocation = false;
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
    openTxExplorer._keepLocation = false;
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
    const normalized = normalizeTxid(txid) || String(txid).trim();
    if (normalized === openTxExplorer._txid && panel.classList.contains("expanded") && panel.classList.contains("is-loading")) {
      return;
    }
    openTxExplorer._txid = normalized;
    setViewerTxidInLocation(normalized);
    const searchInput = document.getElementById("mempoolTxSearchInput");
    if (searchInput && normalizeTxid(searchInput.value) !== normalizeTxid(normalized)) {
      searchInput.value = normalized;
    }
    const loadId = ++txDetailLoadSeq;

    cancelClosePanel();
    panel.classList.add("expanded");
    panel.setAttribute("aria-hidden", "false");
    if (txidEl) txidEl.textContent = normalized;
    if (statusEl) statusEl.textContent = "";
    setTxDetailLoading(true);
    try {
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (_) {}

    const preload = details && typeof details === "object" ? normalizeExplorerTx(details) || details : null;
    const loadPromise = preload && !preload.error
      ? Promise.resolve(preload)
      : blockvaseFetchWithTimeout("/tx/" + encodeURIComponent(normalized), 10000).then(async (r) => {
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
  initViewerPeerCopy();
  initPeerCensusPanel();
  initPoolShareChart();
  initDatumPoolBoard();
  initLightningBoard();
  initTxDetailPanel();
  loadPrimePool().catch(function () {});
  await refreshDashboardMetrics();
  applyViewerTxDeepLink();
  initDeferredMempoolIframe();
  startMetricsPolling();
  startPrimePoolPolling();
}

init();
