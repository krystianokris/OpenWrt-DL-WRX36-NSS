# OpenWrt DL-WRX36 NSS

Custom OpenWrt build for the **Dynalink DL-WRX36** based on **AgustinLorenzo OpenWrt NSS**.

This repository provides an automated GitHub Actions workflow to build firmware with custom configuration and files for the Dynalink DL-WRX36 router.

---

## Features

* Qualcomm NSS acceleration
* Based on AgustinLorenzo `main_nss`
* Automated GitHub Actions builds
* Custom OpenWrt configuration
* Custom files overlay
* Ready-to-flash firmware images

---

## Source

OpenWrt source:

https://github.com/AgustinLorenzo/openwrt

Branch:

```
main_nss
```

---

## Repository Structure

```
.
├── .github/workflows/    GitHub Actions workflow
├── configs/              OpenWrt build configuration
├── files/                Custom files overlay
└── README.md
```

---

## Build

The firmware is built automatically using GitHub Actions.

Workflow:

* Clone OpenWrt source
* Copy build configuration
* Apply custom files
* Update feeds
* Compile firmware
* Upload firmware artifacts

---

## Firmware

Generated firmware includes:

* Sysupgrade image
* Factory image (when available)

The firmware is intended for:

**Dynalink DL-WRX36**

---

## Flashing

Upgrade from an existing OpenWrt installation:

1. Backup your configuration.
2. Upload the **sysupgrade** image.
3. Keep settings only if compatible with your previous build.
4. Reboot the router.

---

## Disclaimer

This project is provided without warranty.

Always verify that you are flashing firmware intended for your exact hardware model.

Flashing custom firmware is done at your own risk.

---

## Credits

* OpenWrt Project
* AgustinLorenzo
* GitHub Actions
