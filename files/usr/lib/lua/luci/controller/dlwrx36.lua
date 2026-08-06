module("luci.controller.dlwrx36", package.seeall)

function index()

    entry(
        {"admin","services","dlwrx36"},
        firstchild(),
        _("DL-WRX36 NSS"),
        60
    )

    entry(
        {"admin","services","dlwrx36","status"},
        template("dlwrx36/status"),
        _("NSS Status"),
        1
    )

end
