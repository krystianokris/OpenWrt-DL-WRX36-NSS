# DL-WRX36 NSS

Custom OpenWrt NSS firmware for the **Dynalink DL-WRX36** (Qualcomm IPQ807x).

> **Project status:** personal / community performance build.  
> NSS components are outside the normal upstream OpenWrt feature set and can be less stable than a stock OpenWrt release.

**Mesh Wi-Fi and BATMAN are intentionally disabled** — they were problematic on this platform and are not included.

---

## Hardware

| Spec | Value |
|------|--------|
| Router | Dynalink DL-WRX36 |
| Platform | Qualcomm IPQ807x / IPQ8072A |
| CPU | 4× Cortex-A53 @ up to 2.2 GHz |
| RAM | 1 GB |
| Ethernet | 4 × 1 GbE + 1 × 2.5 GbE |
| Wireless | Qualcomm Wi-Fi 6 (ath11k) |
| USB | USB 3.0 |
| Storage | NAND |

Official OpenWrt target: `qualcommax/ipq807x` → `dynalink_dl-wrx36`.

---

## Build info

| Item | Value |
|------|--------|
| Base | AgustinLorenzo OpenWrt NSS |
| Target | `qualcommax/ipq807x` |
| Device | `dynalink_dl-wrx36` |
| Profile | DL-WRX36 NSS Performance Edition |
| Builds | GitHub Actions (manual workflow) |

---

## Main features

- Qualcomm NSS acceleration (DP + ECM)
- ath11k NSS Wi-Fi offload
- NSS Qdisc + SQM NSS scripts
- PPPoE WAN support (incl. VLAN e.g. `wan.911`)
- Native LuCI NSS dashboard
- Per-core CPU usage (CPU0–CPU3)
- Dynamic WAN detection (`ifstatus` / UCI + fallbacks)
- Live WAN RX/TX rates
- System / NSS / ECM / WAN / PPPoE status badges
- Temperature, memory, uptime, CPU frequency

### Explicitly disabled

- **Mesh Wi-Fi** (`wpad-mesh-*`)
- **BATMAN** (`kmod-batman-adv`, `batctl`, LuCI mesh packages)

Stripped from config, overlay files, and verified in the build workflow.

---

## NSS Dashboard

**Status → DL-WRX36 NSS Dashboard**

Answers one question quickly:

> **Is the router healthy and is NSS acceleration actually doing work?**

### Status strip
System · NSS · ECM · WAN · PPPoE

### Sections
- **WAN / PPPoE** — link, PPPoE, IPv4/IPv6, live RX/TX rate, totals, L3 if, device, VLAN
- **NSS** — driver, datapath, ECM, ath11k NSS, Qdisc
- **ECM** — accelerated flows, database, pipeline, active exceptions
- **System** — load average, **CPU0–CPU3**, memory, uptime, temperature, frequency
- **LAN / Wi-Fi** — ports, bridge, radios, channel, IRQs

Notes:
- Exception counters warn only when non-zero
- First dashboard refresh after boot may show `n/a` / `0 B/s` for CPU cores and rates; values settle after ~10–20 s (second poll)
- After sysupgrade, use **Ctrl+Shift+R** if the browser shows a stale layout

Source:
- Backend: `files/usr/libexec/rpcd/luci.nss-dashboard`
- Frontend: `files/www/luci-static/resources/view/nssdashboard/status.js`

---

## Why NSS?

Standard Linux packet processing can still consume significant CPU on IPQ807x at high WAN throughput (especially PPPoE + many flows).

NSS offloads selected work to Qualcomm’s Network Subsystem. ECM manages accelerated flows and can substantially cut CPU load on supported paths.

Goals:

1. High routing throughput  
2. Low CPU usage  
3. Stable PPPoE  
4. Stable Wi-Fi  
5. Useful QoS (NSS Qdisc / SQM)  
6. Clear diagnostics  

---

## Important limitations

NSS does **not** mean everything is hardware accelerated. Traffic can fall back to the CPU when using:

- some firewall / NAT rules  
- QoS / SQM  
- VPN / tunnels  
- packet inspection  
- unsupported protocols  
- paths that raise ECM exceptions  

Always correlate acceleration counters with CPU usage and real throughput.

---

## Performance philosophy

1. **Do not add every optimisation blindly** — extra daemons and aggressive tweaks can cost RAM/IRQs without gain.  
2. **Measure before changing** — LAN↔WAN, 2.5 GbE, PPPoE, concurrent flows, Wi-Fi→WAN, WireGuard, latency under load, CPU + ECM.  
3. **Protect the NSS path** for max throughput; test SQM separately (best bufferbloat ≠ highest Mbps).  
4. **No aggressive IRQ pinning by default** — `wifi-nss-tuning` only sets `nss_offload=1`.

---

## Wi-Fi notes

ath11k still needs attention for memory and long-term stability. With 1 GB RAM there is more headroom than on 512 MB boards, but still monitor HE160, multi-client load, idle memory after 24–72 h, and reconnects.

Do not assume a newer ath11k firmware is automatically better on an NSS branch.

---

## QoS / SQM

NSS Qdisc is supported. Recommended approach:

- **Max throughput** → keep the NSS path clean  
- **Low latency / gaming** → test NSS Qdisc / SQM and measure the cost  
- Compare latency under load, not only Mbps  

Default SQM config is present but **disabled** until you set rates and enable it.

---

## Package strategy

Lean performance image. Typical includes:

- LuCI SSL (OpenSSL)  
- diagnostics (`htop`, `iperf3`, `tcpdump`, `ethtool`, …)  
- optional `usteer`  

Avoid large packages only because 1 GB RAM is available.

---

## Recovery / safety

- Keep a known-good recovery image  
- Have USB recovery ready  
- Do not test experimental kernel/NSS builds without a recovery path  

Advanced-reboot is not available for this device (OpenWrt wiki).

---

## Roadmap

### Done (recent)

- [x] Per-core CPU load on dashboard  
- [x] Live WAN RX/TX rates  
- [x] Dynamic WAN / PPPoE interface detection  
- [x] JSON escaping for ECM exception dumps  
- [x] Remove mesh / BATMAN from image and UI  
- [x] Single LuCI dashboard entry (no duplicate tab)  
- [x] Safe wifi-nss-tuning (no IRQ affinity)  

### Next

- Better ECM exception breakdown (by reason)  
- Optional thermal min/max  
- Optional IRQ **diagnostics only** (no auto-pinning)  
- Keep NSS/ath11k firmware aligned with the Agustin branch in use  

### Later (only after measurement)

- WireGuard-focused checks  
- Cautious TCP/BBR experiments  
- SQM tuning profiles  

Every change should be benchmarked against the previous image.

---

## Benchmark checklist

Before calling a build “good enough”:

- [ ] Cold boot  
- [ ] 24 h / 72 h uptime  
- [ ] PPPoE reconnect  
- [ ] IPv4 routing (IPv6 if used)  
- [ ] 1 GbE + 2.5 GbE throughput  
- [ ] Wi-Fi 2.4 / 5 GHz + HE160  
- [ ] WireGuard (if used)  
- [ ] QoS / SQM (if enabled)  
- [ ] CPU0–3 under load  
- [ ] Memory + temperature  
- [ ] ECM acceleration + exceptions  
- [ ] LuCI dashboard refresh  

---

## Project structure
configs/dl-wrx36.config     # build config
files/                      # rootfs overlay
etc/init.d/               # nss-tuning, wifi-nss-tuning
etc/sysctl.d/99-nss.conf
usr/libexec/rpcd/         # luci.nss-dashboard backend
www/luci-static/.../nssdashboard/status.js
scripts/patch_apk.py
.github/workflows/          # build pipeline
text### Dashboard validation

```sh
node --check files/www/luci-static/resources/view/nssdashboard/status.js
git diff --check
Keep the working tree clean before a long firmware build.

Credits
Based on OpenWrt and Qualcomm NSS community work, especially the AgustinLorenzo NSS tree and earlier work associated with qosmio.
The DL-WRX36 is officially supported by OpenWrt. NSS hardware acceleration comes from community/custom builds.

Disclaimer
Personal / community use. Custom NSS patches and Qualcomm-specific components can introduce regressions not present in official OpenWrt releases.
Always keep a recovery image and a known-good build before upgrading.
textPo commitcie na dole README powinny być sekcje **Credits** i **Disclaimer**. Jak zapiszesz, napisz — sprawdzę.
