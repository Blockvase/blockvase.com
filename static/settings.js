const setupToken = new URLSearchParams(window.location.search).get("token") || "";

function withToken(path) {
  if (!setupToken) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}token=${encodeURIComponent(setupToken)}`;
}

function showLoading(msg) {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  const container = document.getElementById("mainContainer");
  if (text) text.textContent = msg || "Loading...";
  if (overlay) overlay.classList.add("active");
  if (container) container.classList.add("faded");
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  const container = document.getElementById("mainContainer");
  if (overlay) overlay.classList.remove("active");
  if (container) container.classList.remove("faded");
}

function showStatus(el, type, msg) {
  if (!el) return;
  el.style.display = "block";
  el.className = "status " + type;
  el.innerHTML = msg;
  if (el._hideTimeout) clearTimeout(el._hideTimeout);
  el._hideTimeout = setTimeout(() => { el.style.display = "none"; }, 5000);
}

function formatDeviceName(name) {
  if (!name) return "Blockvase";
  return name.trim().split(/[- ]+/).filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function loadDeviceName() {
  const h1 = document.getElementById("deviceNameHeader");
  const cached = localStorage.getItem("deviceName");
  if (cached && h1) h1.textContent = formatDeviceName(cached) + " Settings";

  fetch(withToken("/api/device-name"))
    .then(r => r.json())
    .then(n => {
      const name = n.name || "blockvase";
      localStorage.setItem("deviceName", name);
      if (h1) h1.textContent = formatDeviceName(name) + " Settings";
    })
    .catch(() => {});
}

async function validateQrToken() {
  if (!setupToken) return false;
  try {
    const r = await fetch(withToken("/api/validate-qr-token"));
    const d = await r.json();
    return !!d.valid;
  } catch {
    return false;
  }
}

function checkApMode() {
  // Fast path: /setup?token=... is already server-validated in the route handler.
  // Render immediately to avoid perceived hangs while async checks complete.
  if (setupToken) {
    window.isApMode = true;
    document.getElementById("setupSection").style.display = "block";
    document.getElementById("wifiRpcSection").style.display = "none";
    loadRpc();
    validateQrToken().then(valid => {
      if (!valid) {
        document.body.innerHTML = '<div style="padding:40px;text-align:center;color:#fff;"><h1>Access Denied</h1><p>Invalid or missing QR code token. Please scan the QR code displayed on the device.</p></div>';
      }
    });
    return;
  }

  fetch(withToken("/api/ap-mode"))
    .then(r => r.json())
    .then(d => {
      window.isApMode = !!d.ap_mode;
      if (d.ap_mode) {
        validateQrToken().then(valid => {
          if (!valid) {
            document.body.innerHTML = '<div style="padding:40px;text-align:center;color:#fff;"><h1>Access Denied</h1><p>Invalid or missing QR code token. Please scan the QR code displayed on the device.</p></div>';
            return;
          }
          document.getElementById("setupSection").style.display = "block";
          document.getElementById("wifiRpcSection").style.display = "none";
          loadRpc();
        });
      } else {
        document.getElementById("setupSection").style.display = "none";
        document.getElementById("wifiRpcSection").style.display = "block";
        loadRpc();
      }
    })
    .catch(() => {
      document.getElementById("setupSection").style.display = "none";
      document.getElementById("wifiRpcSection").style.display = "block";
      loadRpc();
    });
}

function loadTheme() {
  fetch(withToken("/api/theme"))
    .then(r => r.json())
    .then(d => {
      const theme = d.theme || "default";
      document.body.dataset.theme = theme;
      const sel = document.getElementById("theme");
      if (sel) sel.value = theme;
    })
    .catch(() => {});
}

function saveTheme() {
  const sel = document.getElementById("theme");
  if (!sel) return;
  const theme = sel.value || "default";
  const statusDiv = document.getElementById("themeStatus") || document.createElement("div");
  statusDiv.id = "themeStatus";
  statusDiv.className = "status info";
  statusDiv.style.display = "block";
  statusDiv.style.marginTop = "12px";
  if (!statusDiv.parentElement) {
    const btn = document.getElementById("saveThemeBtn");
    if (btn && btn.parentElement) btn.parentElement.appendChild(statusDiv);
  }
  showStatus(statusDiv, "info", "Saving theme...");
  fetch(withToken("/api/theme"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme }),
  })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        const newTheme = d.theme || theme;
        document.body.dataset.theme = newTheme;
        showStatus(statusDiv, "success", "Theme saved");
        try { new BroadcastChannel("blockvase").postMessage({ type: "theme-change", theme: newTheme }); } catch (_) {}
      } else {
        showStatus(statusDiv, "error", d.error || "Failed to save theme");
      }
    })
    .catch(err => showStatus(statusDiv, "error", "Error: " + err));
}

function loadRpc(retryCount = 0) {
  const maxRetries = 3;
  fetch(withToken("/api/rpc"))
    .then(r => r.json())
    .then(d => {
      if (window.isApMode) {
        document.getElementById("setupDeviceName").value = "";
      } else {
        document.getElementById("rpcNode").textContent = d.host ? d.host + ":" + d.port : "-";
        document.getElementById("rpcStatus").textContent = d.connected ? "Connected" : "Disconnected";
        document.getElementById("rpcNodeInfo").textContent = d.host ? d.host + ":" + d.port : "-";
      }
      return fetch(withToken("/api/wifi"));
    })
    .then(r => r.json())
    .then(w => {
      if (!window.isApMode && w.ssid) document.getElementById("ssid").value = w.ssid || "";
      return fetch(withToken("/api/device-name"));
    })
    .then(r => r.json())
    .then(n => {
      const name = n.name || "";
      if (!window.isApMode) {
        document.getElementById("deviceName").value = name;
        document.getElementById("deviceAddress").textContent = name ? name + ".local" : "-";
      }
    })
    .catch(err => {
      if (retryCount < 3) setTimeout(() => loadRpc(retryCount + 1), 1000 * (retryCount + 1));
      else console.error("Failed to load RPC config:", err);
    });
}

function saveDeviceName(e) {
  e.preventDefault();
  const nameInput = window.isApMode ? document.getElementById("setupDeviceName") : document.getElementById("deviceName");
  const displayName = nameInput.value.trim().toLowerCase();
  const deviceName = displayName.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "-");
  const statusDiv = document.getElementById("deviceNameStatus");
  if (!deviceName) {
    showStatus(statusDiv, "error", "Device name is required");
    return;
  }
  if (deviceName.length > 19) {
    showStatus(statusDiv, "error", "Device name must be 19 characters or less");
    return;
  }
  showLoading("Saving device name...");
  showStatus(statusDiv, "info", "Saving device name...");
  fetch(withToken("/api/device-name"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: deviceName }),
  })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        const savedName = d.name || deviceName;
        localStorage.setItem("deviceName", displayName);
        if (!window.isApMode) {
          showStatus(statusDiv, "success", d.message || "Device name saved. Redirecting...");
          document.getElementById("deviceAddress").textContent = savedName + ".local";
          nameInput.value = displayName;
          showLoading("Device name saved. Redirecting in 30 seconds...");
          setTimeout(() => { window.location.href = "http://" + savedName + ".local"; }, 30000);
        } else {
          hideLoading();
          showStatus(statusDiv, "success", "Device name saved. Will take effect after reboot.");
          nameInput.value = displayName;
        }
      } else {
        hideLoading();
        showStatus(statusDiv, "error", "Error: " + (d.error || "Unknown"));
      }
    })
    .catch(err => {
      hideLoading();
      showStatus(statusDiv, "error", "Network error: " + err);
    });
}

function saveAll(e) {
  e.preventDefault();
  let deviceName, ssid, password, statusDiv;
  if (window.isApMode) {
    deviceName = document.getElementById("setupDeviceName").value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "-");
    ssid = document.getElementById("setupSsid").value;
    password = document.getElementById("setupPassword").value;
    statusDiv = document.getElementById("setupStatus");
    document.getElementById("setupPassword").value = "";
  } else {
    deviceName = document.getElementById("deviceName").value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "-");
    ssid = document.getElementById("ssid").value;
    password = document.getElementById("password").value;
    statusDiv = document.getElementById("wifiRpcStatus");
    document.getElementById("password").value = "";
  }
  if (!deviceName) {
    showStatus(statusDiv, "error", "Device name is required");
    return;
  }
  if (deviceName.length > 19) {
    showStatus(statusDiv, "error", "Device name must be 19 characters or less");
    return;
  }
  if (!ssid) {
    showStatus(statusDiv, "error", "WiFi SSID is required");
    return;
  }
  showLoading("Saving settings...");
  showStatus(statusDiv, "info", "Saving settings...");
  fetch(withToken("/api/save-all"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceName, ssid, password }),
  })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        const finalDeviceName = (d.deviceName && d.deviceName.trim()) ? d.deviceName.trim() : deviceName;
        showStatus(statusDiv, "success", "Settings saved. Rebooting...");
        showLoading("Settings saved. Device rebooting. Redirecting to " + finalDeviceName + ".local in 30 seconds...");
        setTimeout(() => { window.location.href = "http://" + finalDeviceName + ".local"; }, 30000);
      } else {
        hideLoading();
        showStatus(statusDiv, "error", "Error: " + (d.error || "Unknown"));
      }
    })
    .catch(err => {
      hideLoading();
      showStatus(statusDiv, "error", "Network error: " + err);
    });
}

function refreshStats() {
  fetch(withToken("/api/stats"))
    .then(r => r.json())
    .then(d => {
      document.getElementById("uptime").textContent = d.uptime || "-";
      document.getElementById("freeHeap").textContent = d.freeHeap ?? "-";
      document.getElementById("largestBlock").textContent = d.largestBlock ?? "-";
      document.getElementById("wifiStatusText").textContent = d.wifiStatus || "-";
      document.getElementById("ipAddress").textContent = d.ipAddress || "-";
      document.getElementById("bitcoinNode").textContent = d.bitcoinNode || "-";
      document.getElementById("rpcNodeInfo").textContent = d.rpcNode || "-";
      let statusText = d.rpcConnected ? "Connected" : "Disconnected";
      if (!d.rpcConnected && d.rpcStatusCode) statusText += " (HTTP " + d.rpcStatusCode + ")";
      if (!d.rpcConnected && d.rpcErrorBody) statusText += " - " + d.rpcErrorBody;
      document.getElementById("rpcStatus").textContent = statusText;
      document.getElementById("blockHeight").textContent = d.blockHeight ?? "-";
      document.getElementById("blocksFound").textContent = d.blocksFound ?? "-";
    })
    .catch(() => {});
}

function simulateBlock() {
  const a = document.getElementById("actionStatus");
  showStatus(a, "info", "Triggering block animation...");
  fetch(withToken("/api/simulate-block"), { method: "POST" })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        showStatus(a, "success", "Block animation triggered");
        try { new BroadcastChannel("blockvase").postMessage({ type: "simulate-block" }); } catch (_) {}
      } else {
        showStatus(a, "error", "Error: " + (d.error || "Unknown"));
      }
    })
    .catch(err => showStatus(a, "error", "Error: " + err));
}

function reboot() {
  const a = document.getElementById("actionStatus");
  if (!confirm("Reboot device?")) return;
  showStatus(a, "info", "Rebooting...");
  fetch(withToken("/api/reboot"), { method: "POST" })
    .then(() => showStatus(a, "success", "Device rebooting..."))
    .catch(err => showStatus(a, "error", "Error: " + err));
}

function factoryReset() {
  const a = document.getElementById("actionStatus");
  if (!confirm("Factory reset will erase all settings. Continue?")) return;
  showStatus(a, "info", "Resetting to factory defaults...");
  fetch(withToken("/api/factory-reset"), { method: "POST" })
    .then(r => r.json().then(d => ({ ok: r.ok, data: d })))
    .then(({ ok, data }) => {
      if (ok && data.success) showStatus(a, "success", data.message || "Factory reset complete. Rebooting...");
      else showStatus(a, "error", data?.error || "Factory reset failed");
    })
    .catch(err => showStatus(a, "error", "Error: " + err));
}

function updateDeviceAddress() {
  const nameInput = document.getElementById("deviceName");
  if (!nameInput) return;
  const name = nameInput.value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "-");
  const addrEl = document.getElementById("deviceAddress");
  if (addrEl) addrEl.textContent = name ? name + ".local" : "-";
}

// Init
document.getElementById("setupForm")?.addEventListener("submit", saveAll);
document.getElementById("wifiRpcForm")?.addEventListener("submit", saveAll);
document.getElementById("deviceNameForm")?.addEventListener("submit", saveDeviceName);
setInterval(refreshStats, 5000);
document.getElementById("saveThemeBtn")?.addEventListener("click", saveTheme);

checkApMode();
refreshStats();
loadDeviceName();
loadTheme();
try {
  const bc = new BroadcastChannel("blockvase");
  bc.onmessage = (e) => {
    if (e.data?.type === "theme-change" && e.data?.theme) {
      document.body.dataset.theme = e.data.theme;
      const sel = document.getElementById("theme");
      if (sel) sel.value = e.data.theme;
    }
  };
} catch (_) {}
setTimeout(() => {
  const nameInput = document.getElementById("deviceName");
  if (nameInput) {
    nameInput.addEventListener("input", updateDeviceAddress);
    updateDeviceAddress();
  }
}, 100);
