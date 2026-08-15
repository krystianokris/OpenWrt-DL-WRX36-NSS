# DL-WRX36 NSS Custom OpenWrt

Custom OpenWrt NSS firmware for the **Dynalink DL-WRX36** (Qualcomm IPQ807x).

> **Project Status:** Personal / Community Performance Build  
> **Warning:** NSS components reside outside the standard upstream OpenWrt feature set and may exhibit lower stability than stock releases.  
> **Note:** **Mesh Wi-Fi and BATMAN are intentionally disabled** due to platform instability and are completely excluded from this build.

---

## 🛠️ Hardware Specifications

| Spec | Value |
| :--- | :--- |
| **Router** | Dynalink DL-WRX36 |
| **Platform** | Qualcomm IPQ807x / IPQ8072A |
| **CPU** | 4× Cortex-A53 @ up to 2.2 GHz |
| **RAM** | 1 GB |
| **Ethernet** | 4 × 1 GbE + 1 × 2.5 GbE |
| **Wireless** | Qualcomm Wi-Fi 6 (`ath11k`) |
| **USB** | USB 3.0 |
| **Storage** | NAND |

*Official OpenWrt target:* `qualcommax/ipq807x` → `dynalink_dl-wrx36`

---

## 📦 Build Information

| Item | Value |
| :--- | :--- |
| **Base** | AgustinLorenzo OpenWrt NSS |
| **Target** | `qualcommax/ipq807x` |
| **Device** | `dynalink_dl-wrx36` |
| **Profile** | DL-WRX36 NSS Performance Edition |
| **Builds** | GitHub Actions (manual workflow) |

---

## ✨ Main Features

- LuCI theme: luci-theme-openwrt-2020
* **Qualcomm NSS acceleration** (DP + ECM)
* **`ath11k` NSS Wi-Fi offload**
* **NSS Qdisc + SQM NSS scripts**
* **PPPoE WAN support** (including VLANs e.g., `wan.911`)
* **Native LuCI NSS Dashboard**
  * Per-core CPU usage monitoring (`CPU0`–`CPU3`)
  * Dynamic WAN detection (`ifstatus` / UCI + fallbacks)
  * Live WAN RX/TX rates
  * System / NSS / ECM / WAN / PPPoE status badges
  * Temperature, memory, uptime, and CPU frequency tracking

### ❌ Explicitly Disabled
* **Mesh Wi-Fi** (`wpad-mesh-*`)
* **BATMAN** (`kmod-batman-adv`, `batctl`, LuCI mesh packages)

> *Stripped entirely from the config, overlay files, and verified during the build workflow.*

---

## 📊 NSS Dashboard

Path: **Status → DL-WRX36 NSS Dashboard**

Designed to instantly answer one key question:  
> **"Is the router healthy and is NSS acceleration actively doing work?"**

### Sections Overview
* **WAN / PPPoE:** Link status, PPPoE state, IPv4/IPv6, live RX/TX rates, totals, L3 interface, device, and VLAN.
* **NSS:** Driver details, datapath, ECM, `ath11k` NSS, and Qdisc.
* **ECM:** Accelerated flows, database state, pipeline, and active exceptions.
* **System:** Load averages, **`CPU0`–`CPU3`**, memory consumption, uptime, temperature, and frequency.
* **LAN / Wi-Fi:** Port status, bridge state, radios, channels, and IRQs.

### Quick Notes
* Exception counters flash warnings only when non-zero.
* The first dashboard refresh after boot may display `n/a` or `0 B/s` for CPU cores and rates; values settle automatically after ~10–20 seconds (second poll).
* After a sysupgrade, use **`Ctrl+Shift+R`** if your browser serves a stale layout cache.

**Source Files:**
* Backend: `files/usr/libexec/rpcd/luci.nss-dashboard`
* Frontend: `files/www/luci-static/resources/view/nssdashboard/status.js`

---

## 💡 Why NSS?

Standard Linux packet processing can consume significant CPU resources on the IPQ807x architecture at high WAN throughputs (especially under heavy PPPoE loads with numerous active flows). 

NSS offloads qualifying traffic to Qualcomm’s dedicated Network Subsystem. Enhanced Connection Manager (ECM) manages these accelerated paths and drastically reduces CPU overhead.

### Design Goals
1. High routing throughput
2. Minimal CPU utilization
3. Stable PPPoE connections
4. Stable Wi-Fi performance
5. Effective QoS integration (NSS Qdisc / SQM)
6. Clear, actionable diagnostics

---

## ⚠️ Important Limitations

NSS does **not** accelerate everything universally. Traffic automatically falls back to the main CPU when processing:
* Certain complex firewall or NAT rules
* QoS / SQM queues
* VPN tunnels (e.g., WireGuard)
* Deep packet inspection
* Unsupported protocols
* Paths triggering ECM exceptions

> *Tip: Always correlate acceleration hardware counters with actual CPU usage and real throughput metrics.*

---

## ⚙️ Performance Philosophy

1. **Avoid blind optimizations:** Extra background daemons and aggressive tweaks can cost RAM/IRQs without delivering real gains.
2. **Measure before changing:** Benchmark LAN↔WAN, 2.5 GbE, PPPoE, concurrent streams, Wi-Fi→WAN, WireGuard, latency under load, and CPU/ECM behavior.
3. **Protect the NSS path:** Keep the fast path clean for maximum throughput; test SQM separately (best bufferbloat score ≠ highest Mbps).
4. **No aggressive IRQ pinning by default:** `wifi-nss-tuning` strictly applies `nss_offload=1`.

---

## 📶 Wi-Fi Notes

The `ath11k` driver requires careful tuning for long-term memory management and stability. Although 1 GB of RAM provides more headroom than 512 MB boards, you should still monitor HE160 widths, multi-client loads, idle memory after 24–72 hours, and client reconnect behaviors.

> *Do not assume a newer `ath11k` firmware version is automatically superior on an NSS branch.*

---

## 🚦 QoS / SQM

NSS Qdisc is fully supported. Recommended approach:
* **Max throughput:** Keep the NSS path clean and bypass heavy queue management.
* **Low latency / gaming:** Test NSS Qdisc / SQM and measure the performance trade-off.
* Compare overall latency under heavy load, not just raw download/upload speeds.

*Default SQM configuration is included but remains disabled until active rates are set.*

---

## 📦 Package Strategy

Maintained as a lean performance image. Standard inclusions:
* LuCI SSL (`OpenSSL`)
* Essential diagnostics (`htop`, `iperf3`, `tcpdump`, `ethtool`, etc.)
* Optional `usteer`

> *Avoid bloating the image with unnecessary packages simply because 1 GB of RAM is available.*

---

## 🛟 Recovery & Safety

* Always keep a verified, working recovery image accessible.
* Have a physical USB recovery method ready.
* Never flash experimental kernel/NSS builds without a known fallback path.

*(Note: Advanced-reboot options are unavailable on this device per the OpenWrt wiki).*

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Per-core CPU load metrics on dashboard
- [x] Live WAN RX/TX traffic rates
- [x] Dynamic WAN / PPPoE interface detection
- [x] JSON escaping for ECM exception dumps
- [x] Complete removal of mesh / BATMAN from image and UI
- [x] Single LuCI dashboard entry (eliminated duplicate tabs)
- [x] Safe `wifi-nss-tuning` implementation (no strict IRQ affinity pinning)

### 🔜 Next Steps
- [ ] Granular ECM exception breakdowns (categorized by reason)
- [ ] Optional thermal min/max trackers
- [ ] Optional IRQ diagnostics view (diagnostic only, no auto-pinning)
- [ ] Keep NSS/`ath11k` firmware cleanly aligned with the active Agustin branch

### 🔮 Future Goals (Post-Measurement)
- [ ] WireGuard-focused optimization checks
- [ ] Cautious TCP/BBR algorithm experiments
- [ ] Fine-tuned SQM profile presets

> *Every modification should be rigorously benchmarked against the preceding image release.*

---

## 📋 Benchmark Checklist

Before designating a build as stable ("good enough"), verify:
- [ ] Cold boot cycle
- [ ] 24h / 72h continuous uptime stability
- [ ] Reliable PPPoE reconnection behavior
- [ ] IPv4 routing (and IPv6 if utilized)
- [ ] Full 1 GbE + 2.5 GbE throughput limits
- [ ] Wi-Fi 2.4 GHz / 5 GHz + HE160 stability
- [ ] WireGuard performance (if applicable)
- [ ] QoS / SQM behavior under load (if enabled)
- [ ] CPU0–CPU3 behavior under high load
- [ ] Memory consumption and thermal trends
- [ ] ECM acceleration effectiveness and exception rates
- [ ] LuCI dashboard responsiveness and refresh loops

---

## 📂 Project Structure

```text
configs/dl-wrx36.config          # Build configuration
files/                          # Rootfs overlay
├── etc/init.d/                 # nss-tuning, wifi-nss-tuning scripts
├── etc/sysctl.d/               # 99-nss.conf kernel tweaks
└── usr/libexec/rpcd/           # luci.nss-dashboard backend RPC script
www/luci-static/.../status.js   # LuCI dashboard frontend UI
scripts/patch_apk.py            # Utility patch scripts
.github/workflows/              # Automated build pipeline workflows
