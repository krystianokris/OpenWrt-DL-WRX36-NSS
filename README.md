# OpenWrt DL-WRX36 NSS

Custom OpenWrt firmware build for **Dynalink DL-WRX36** with Qualcomm NSS acceleration and additional LuCI monitoring tools.

This project provides automated builds of OpenWrt based on the NSS-enabled branch from AgustinLorenzo with custom configuration and additional system monitoring components.

---

## Features

### Qualcomm NSS Support

This firmware includes Qualcomm NSS acceleration support designed to improve network performance on the DL-WRX36 platform.

Included components:

* NSS acceleration
* ECM (Engine Connection Manager) support
* NSS status monitoring
* Custom LuCI NSS dashboard

---

## Included LuCI Tools

This build contains custom LuCI integration:

### NSS Dashboard

Provides a quick overview of NSS-related system information.

### NSS Status

Displays NSS subsystem status and operation information.

### ECM Status

Shows ECM offload status and connection acceleration information.

---

## Target Device

Supported hardware:

**Dynalink DL-WRX36**

Hardware platform:

* Qualcomm IPQ807x
* WiFi 6
* NSS capable platform

---

## Build Source

OpenWrt source:

AgustinLorenzo OpenWrt NSS

Branch:

```text
main_nss
```

---

## Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── build.yml
│
├── configs/
│   └── dl-wrx36.config
│
├── files/
│   └── custom LuCI/NSS files
│
└── README.md
```

---

## Automated Build

Firmware is built using GitHub Actions.

Build process:

1. Clone NSS-enabled OpenWrt source
2. Apply custom configuration
3. Install feeds
4. Apply custom files overlay
5. Compile firmware
6. Create firmware release

---

## Firmware Files

Each release contains:

* `factory` image (when available)
* `sysupgrade` image
* build information
* checksums

---

## Installation

Before flashing:

* Make a backup of your current configuration.
* Verify that the image is intended for Dynalink DL-WRX36.

For upgrades from OpenWrt:

Use the generated:

```text
sysupgrade image
```

For initial installation:

Use the appropriate:

```text
factory image
```

---

## Performance

The goal of this project is to provide a DL-WRX36 firmware build focused on:

* high routing performance,
* hardware acceleration,
* NSS visibility,
* easier monitoring through LuCI.

---

## Credits

Based on:

* OpenWrt Project
* AgustinLorenzo NSS OpenWrt work

Additional custom integration:

* NSS Dashboard
* NSS Status
* ECM Status

---

## Disclaimer

This firmware is provided without warranty.

Use at your own risk. Always verify the firmware image before flashing your device.
