# DL-WRX36 NSS 

Custom OpenWrt NSS firmware for the **Dynalink DL-WRX36**, built around the Qualcomm IPQ807x platform and an NSS-enabled OpenWrt tree.

> **Project status:** personal/community performance build. NSS components are outside the normal upstream OpenWrt feature set and can be less stable than a stock OpenWrt release.

## Hardware

- **Router:** Dynalink DL-WRX36
- **Platform:** Qualcomm IPQ807x / IPQ8072A
- **CPU:** 4-core ARM Cortex-A53, up to 2.2 GHz
- **RAM:** 1 GB
- **Ethernet:** 4 × 1 GbE + 1 × 2.5 GbE
- **Wireless:** Qualcomm Wi-Fi 6 / ath11k
- **USB:** USB 3.0
- **Storage:** NAND

The official OpenWrt hardware page identifies the DL-WRX36 as a qualcommax/ipq807x device with 1 GB RAM, 2.5 GbE and ath11k Wi-Fi 6 support.

## Build

**Firmware:** AgustinLorenzo OpenWrt NSS

**Target:** `qualcommax/ipq807x`

**Device:** `dynalink_dl-wrx36`

**Build profile:** DL-WRX36 NSS Performance Edition

**Current build release:** 19

**Build date:** 2026-08-06

## Main features

- Qualcomm NSS acceleration
- NSS DP / wired datapath support
- ECM hardware acceleration
- ath11k NSS Wi-Fi offload
- NSS Qdisc support
- PPPoE WAN support
- Native LuCI NSS dashboard
- DL-WRX36 status information
- ECM/NSS counters and diagnostics
- System temperature, memory, uptime and CPU frequency monitoring
- Compact status badges for System / NSS / ECM / WAN / PPPoE
- Reduced dashboard spacing for a cleaner LuCI layout

## NSS Dashboard

The custom dashboard is designed to answer one question quickly:

> **Is the router healthy and is the NSS acceleration actually doing work?**

### Health overview

The dashboard exposes:

- System state
- NSS driver state
- ECM state
- WAN link state
- PPPoE state

### WAN / PPPoE

- WAN link state
- PPPoE connection state
- IPv4 address
- IPv6 availability
- WAN VLAN/interface

### NSS

- NSS driver
- Datapath
- ECM health
- ath11k NSS
- NSS Qdisc

The duplicate `Modules` card was intentionally removed from the main dashboard because module count is already available elsewhere and was adding noise.

### ECM

The dashboard reports:

- IPv4 accelerated flows
- IPv4 TCP
- IPv4 UDP
- IPv6 accelerated flows
- IPv6 TCP
- IPv6 UDP
- ECM database connections
- Hosts
- Interfaces
- Mappings
- Nodes
- Pending acceleration
- Pending deceleration
- IPv4 acceleration/deceleration counters
- IPv6 acceleration/deceleration counters
- Active IPv4 exceptions
- Active IPv6 exceptions

Exception counters are displayed as warnings when non-zero, while ordinary zero/non-zero counters remain visually neutral. This prevents normal traffic counters from looking like faults.

### System

- CPU load
- Memory usage
- Uptime
- Temperature
- CPU frequency

### LAN / Wi-Fi

- LAN1–LAN4 state
- Bridge state
- 5 GHz Wi-Fi state
- 2.4 GHz Wi-Fi state
- Wi-Fi channel/frequency
- Wi-Fi mode
- Wi-Fi IRQ information

## Why NSS?

The DL-WRX36 has a powerful IPQ807x platform, but standard Linux packet processing can still consume significant CPU time at high WAN throughput, especially with PPPoE and large numbers of concurrent flows.

NSS offload moves selected networking work onto Qualcomm's Network Subsystem. ECM manages accelerated flows and can significantly reduce CPU involvement for supported traffic paths.

The goal of this build is therefore not simply to obtain the highest synthetic benchmark number. The goal is to combine:

1. high routing throughput,
2. low CPU usage,
3. stable PPPoE operation,
4. stable Wi-Fi,
5. useful QoS support,
6. and clear diagnostics.

## Important limitation

NSS acceleration is not equivalent to “everything is hardware accelerated”. Certain features can force traffic back through the normal Linux path or prevent acceleration entirely.

Examples include some:

- firewall/NAT paths,
- QoS/SQM configurations,
- VPN configurations,
- packet inspection features,
- unusual tunnelling,
- unsupported protocols,
- and traffic that triggers ECM exceptions.

For this reason, acceleration counters should be checked together with CPU usage and real throughput.

## Recommended performance philosophy

### 1. Do not blindly add every optimisation

The DL-WRX36 already has strong hardware. Extra daemons, monitoring services and aggressive kernel tweaks can increase RAM use and interrupt activity without improving real-world throughput.

### 2. Measure before changing

Recommended baseline tests:

- wired LAN → WAN
- 2.5 GbE → LAN
- PPPoE throughput
- concurrent connections
- upload and download simultaneously
- Wi-Fi → WAN
- WireGuard throughput
- latency under load
- CPU load during each test
- NSS/ECM counters before and after each test

### 3. Protect NSS acceleration

When maximum routing throughput is the priority, avoid configurations that unnecessarily pull traffic back into the CPU path.

SQM/QoS should be tested separately because the best bufferbloat result is not necessarily the highest throughput result.

## Potential next improvements

These are candidates for future releases and should be tested one at a time.

### High priority

#### A. Driver / firmware refresh

Keep the NSS tree, ath11k patches and Qualcomm firmware aligned with the exact AgustinLorenzo NSS branch being used.

Do **not** copy a random newer ath11k firmware or kernel patch into the build just because it is newer. NSS branches can depend on specific Qualcomm/QSDK behaviour.

A current upstream OpenWrt qualcommax tree is using the 6.12 kernel line, while community NSS trees may carry additional Qualcomm-specific patches. The two should not be mixed blindly.

#### B. NSS/ECM diagnostics

Add a small diagnostic area showing:

- NSS exceptions by reason
- acceleration percentage where available
- current ECM connection count
- NSS CPU/thread activity if exposed by the driver
- acceleration changes over time

This would make the dashboard much more useful than simply showing raw counters.

#### C. Per-core CPU load

The current dashboard has aggregate load. Adding four individual CPU/core utilisation values would make it much easier to spot IRQ imbalance or a single overloaded CPU core.

#### D. WAN throughput monitor

A lightweight current RX/TX rate display would be useful. It should be read directly from interface statistics rather than running a permanent bandwidth-monitoring daemon.

### Medium priority

#### E. IRQ / CPU affinity visibility

The IPQ807x platform is sensitive to interrupt distribution. A dashboard diagnostic showing important IRQs and their CPU affinity could help identify performance problems without changing anything automatically.

Automatic IRQ pinning should only be added after measurement.

#### F. Thermal monitoring improvements

The current 59°C reading is useful, but a dashboard history/min/max view would make thermal testing easier.

The router should be tested under sustained 1–2.5 GbE traffic plus Wi-Fi load before adding any aggressive CPU frequency changes.

#### G. WireGuard benchmark profile

WireGuard is one of the most interesting real-world tests because encrypted traffic can shift work back toward the CPU. A dedicated benchmark section would show the difference between:

- normal NAT/NSS path,
- WireGuard,
- WireGuard + PPPoE,
- and QoS/SQM configurations.

### Experimental / lower priority

- BBR/fq tuning
- additional TCP tuning
- aggressive CPU frequency policies
- custom IRQ affinity
- additional conntrack tuning
- more aggressive Wi-Fi parameters
- automatic channel selection

These should not be included by default until a measurable benefit is demonstrated on the DL-WRX36.

## Wi-Fi considerations

The DL-WRX36 uses ath11k for Wi-Fi 6. Community experience continues to point to ath11k as an important area to watch for memory usage, stability and feature compatibility on Qualcomm Wi-Fi 6 hardware.

The router has 1 GB RAM, which gives considerably more headroom than 512 MB Qualcomm platforms, but memory behaviour should still be monitored during long uptime and heavy Wi-Fi load.

Avoid assuming that a newer driver is automatically better. Test:

- 5 GHz stability
- HE160 stability
- multiple clients
- roaming
- sustained high throughput
- idle memory after 24–72 hours
- reconnect behaviour

## QoS / SQM

NSS Qdisc support is one of the interesting parts of this build.

However, QoS and maximum throughput are competing goals in many configurations. SQM can deliberately move packet processing into the CPU path to control queueing and bufferbloat.

Recommended approach:

- **Maximum throughput:** keep the NSS path as clean as possible.
- **Low latency/bufferbloat:** test NSS Qdisc/SQM separately and measure the throughput cost.
- **Gaming:** compare latency under load rather than only Mbps.

## Security / package strategy

Because this is a performance-focused image, packages should be selected carefully.

Good candidates for pre-installation:

- LuCI SSL
- WireGuard
- useful network diagnostic tools
- basic monitoring tools
- HTTPS certificates

Avoid installing large packages merely because 1 GB RAM is available. Flash space and background CPU activity still matter.

## Recovery / safety

The DL-WRX36 has OEM dual-image/fail-safe characteristics, but advanced-reboot support is not available for this device according to the OpenWrt wiki.

Keep a known-good recovery image and USB recovery method available before experimenting with kernel, NAND or bootloader changes.

Never test an experimental kernel/NSS build on the only copy of the router without a recovery path.

## Suggested future release plan

### Release 20

- Keep current NSS/ECM stack
- Add per-core CPU load
- Add lightweight WAN RX/TX rate
- Improve ECM exception diagnostics
- Keep dashboard lightweight

### Release 21

- Review current ath11k firmware/patch level
- Compare kernel/NSS branch changes
- Add thermal min/max information
- Add optional IRQ diagnostic page

### Release 22

Only after testing:

- WireGuard benchmark improvements
- IRQ affinity tuning
- TCP/BBR tuning
- QoS/SQM tuning

Every change should be benchmarked against the previous release.

## Benchmark checklist

Before declaring a release stable:

- [ ] Cold boot
- [ ] 24 h uptime
- [ ] 72 h uptime
- [ ] PPPoE reconnect
- [ ] IPv4 routing
- [ ] IPv6 routing
- [ ] 1 GbE throughput
- [ ] 2.5 GbE throughput
- [ ] Wi-Fi 5 GHz throughput
- [ ] Wi-Fi 2.4 GHz throughput
- [ ] HE160 stability
- [ ] WireGuard throughput
- [ ] QoS/SQM test
- [ ] CPU load test
- [ ] memory test
- [ ] temperature test
- [ ] ECM acceleration counters
- [ ] ECM exception counters
- [ ] reboot test
- [ ] LuCI dashboard refresh test

## Current dashboard design goals

The dashboard intentionally uses a clean, compact LuCI-native style rather than a large JavaScript framework.

Design principles:

- no external JavaScript dependencies
- no images or branding assets required
- minimal CPU/RAM overhead
- information grouped by function
- important states visible immediately
- counters readable without excessive colour
- warnings visually separated from normal metrics
- no long raw logs in the main dashboard

## Project structure

The custom dashboard is implemented in:

`files/www/luci-static/resources/view/nssdashboard/status.js`

Other NSS-related LuCI views may exist in the image, but the `nssdashboard` view is the primary custom status dashboard for this project.

## Build validation

Before committing dashboard changes:

```sh
node --check files/www/luci-static/resources/view/nssdashboard/status.js
git diff --check
```

After committing:

```sh
git status
git log -1 --oneline
```

The working tree should be clean before starting a long firmware build.

## Current dashboard commits

Recent dashboard work includes:

- `47c79c2` — Refine NSS dashboard layout and styling
- `9a973b4` — Polish NSS dashboard spacing and layout
- `38bd94c` — Polish NSS dashboard status styling

## Credits / upstream inspiration

This build is based on the work of the OpenWrt community and Qualcomm NSS community developers, including the AgustinLorenzo NSS tree and earlier NSS work associated with qosmio.

The DL-WRX36 remains officially supported by OpenWrt, while NSS hardware acceleration is provided by community/custom builds rather than being a standard feature of the normal OpenWrt target.

## Disclaimer

This firmware is provided for personal/community use. Custom NSS patches and Qualcomm-specific components can introduce regressions that are not present in official OpenWrt releases.

Always keep a recovery image and a known-good build before upgrading.
