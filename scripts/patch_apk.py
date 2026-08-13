#!/usr/bin/env python3
from pathlib import Path
import sys

def patch_apk_feeds():
    p = Path("include/feeds.mk")
    if not p.exists():
        print("WARNING: feeds.mk not found")
        return False
    
    content = p.read_text()
    marker = "define FeedSourcesAppendAPK"
    
    if marker not in content:
        print("INFO: APK feed definition not found")
        return False
    
    start = content.index(marker)
    end = content.index("endef", start) + len("endef")
    
    new_block = '''define FeedSourcesAppendAPK
( \\
  echo '# This file is auto-generated and build-specific, any changes will be intentionally lost in sysupgrade.'; \\
  echo '# Add your custom feeds to /etc/apk/repositories.d/customfeeds.list'; \\
  echo '%U/packages/%A/base/packages.adb'; \\
  $(if $(CONFIG_BUILDBOT), \\
    echo '%U/targets/%S/kmods/$(LINUX_VERSION)-$(LINUX_RELEASE)-$(LINUX_VERMAGIC)/packages.adb'; \\
  ) \\
  $(foreach feed,$(FEEDS_AVAILABLE), \\
    $(if $(CONFIG_FEED_$(feed)), \\
      echo '%U/packages/%A/$(feed)/packages.adb'; \\
    ) \\
  ) \\
) >> $(1)
endef'''
    
    p.write_text(content[:start] + new_block + content[end:])
    print("✅ APK feed patched")
    return True

if __name__ == "__main__":
    sys.exit(0 if patch_apk_feeds() else 1)
