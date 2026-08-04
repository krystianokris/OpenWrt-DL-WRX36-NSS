#!/bin/sh

NSS=$(lsmod | grep qca_nss)

if [ -n "$NSS" ]; then
	echo "NSS detected"
else
	echo "NSS not detected"
fi
