module("luci.controller.dlwrx36", package.seeall)

function index()

    entry(
        {"admin","status","dlwrx36"},
        firstchild(),
        _("DL-WRX36 NSS"),
        50
    )

    entry(
        {"admin","status","dlwrx36","status"},
        template("dlwrx36/status"),
        _("NSS Dashboard"),
        1
    )

end
