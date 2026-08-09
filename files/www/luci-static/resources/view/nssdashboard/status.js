'use strict';

'require view';
'require rpc';

var callDashboard = rpc.declare({
        object: 'luci.nss-dashboard',
        method: 'read',
        expect: {}
});

function value(v) {
        return (v === undefined || v === null || v === '') ?
                'Unavailable' : String(v);
}

function color(v) {
        v = String(v || '');

        if (v === 'OK' ||
            v === 'Enabled' ||
            v === 'UP' ||
            v === 'Connected' ||
            v === 'Accelerated')
                return '#17803d';

        if (v === 'WARNING')
                return '#b7791f';

        if (v === 'ERROR' ||
            v === 'DOWN' ||
            v === 'Disabled' ||
            v === 'Disconnected')
                return '#b33a3a';

        return '#222';
}

function numberColor(v) {
        return (parseInt(v, 10) || 0) === 0 ?
                '#17803d' : '#b7791f';
}

function card(label, val, state) {
        return E('div', {
                'style':
                        'flex:1 1 150px;' +
                        'min-width:140px;' +
                        'padding:12px 14px;' +
                        'border:1px solid #e2e5e8;' +
                        'border-radius:7px;' +
                        'background:#fff;' +
                        'box-shadow:0 1px 2px rgba(0,0,0,.04)'
        }, [
                E('div', {
                        'style':
                                'font-size:11px;' +
                                'font-weight:600;' +
                                'color:#73777c;' +
                                'text-transform:uppercase;' +
                                'letter-spacing:.35px;' +
                                'margin-bottom:5px'
                }, label),

                E('div', {
                        'style':
                                'font-size:17px;' +
                                'font-weight:600;' +
                                'line-height:1.25;' +
                                'color:' + (state || '#222') +
                                ';word-break:break-word'
                }, value(val))
        ]);
}

function section(title) {
        return E('div', {
                'style':
                        'font-size:14px;' +
                        'font-weight:700;' +
                        'color:#30343a;' +
                        'margin:18px 0 8px'
        }, title);
}

function grid(cards, margin) {
        return E('div', {
                'style':
                        'display:flex;' +
                        'flex-wrap:wrap;' +
                        'gap:8px;' +
                        'margin-bottom:' + (margin || 10) + 'px'
        }, cards);
}

function activeExceptions(text) {
        if (!text)
                return 0;

        var matches = String(text).match(/:\s*([0-9]+)\s*$/gm);
        var count = 0;

        if (!matches)
                return 0;

        matches.forEach(function(line) {
                var m = line.match(/:\s*([0-9]+)\s*$/);

                if (m && parseInt(m[1], 10) > 0)
                        count++;
        });

        return count;
}

return view.extend({

        load: function() {
                return callDashboard();
        },

        render: function(data) {

                var d = data || {};
                var container = E('div');

                function renderDashboard(data) {

                        d = data || {};
                        container.innerHTML = '';

                        /*
                         * Compact status strip
                         */
                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;' +
                                                'flex-wrap:wrap;' +
                                                'gap:7px;' +
                                                'margin-bottom:12px'
                                }, [
                                        E('span', {
                                                'style':
                                                        'padding:5px 9px;' +
                                                        'border-radius:5px;' +
                                                        'font-size:12px;' +
                                                        'font-weight:600;' +
                                                        'background:#f1f3f5;' +
                                                        'color:' + color(d.health)
                                        }, 'System: ' + value(d.health)),

                                        E('span', {
                                                'style':
                                                        'padding:5px 9px;' +
                                                        'border-radius:5px;' +
                                                        'font-size:12px;' +
                                                        'font-weight:600;' +
                                                        'background:#f1f3f5;' +
                                                        'color:' + color(d.nss_drv)
                                        }, 'NSS: ' + value(d.nss_drv)),

                                        E('span', {
                                                'style':
                                                        'padding:5px 9px;' +
                                                        'border-radius:5px;' +
                                                        'font-size:12px;' +
                                                        'font-weight:600;' +
                                                        'background:#f1f3f5;' +
                                                        'color:' + color(d.ecm_health)
                                        }, 'ECM: ' + value(d.ecm_health)),

                                        E('span', {
                                                'style':
                                                        'padding:5px 9px;' +
                                                        'border-radius:5px;' +
                                                        'font-size:12px;' +
                                                        'font-weight:600;' +
                                                        'background:#f1f3f5;' +
                                                        'color:' + color(d.wan_link)
                                        }, 'WAN: ' + value(d.wan_link)),

                                        E('span', {
                                                'style':
                                                        'padding:5px 9px;' +
                                                        'border-radius:5px;' +
                                                        'font-size:12px;' +
                                                        'font-weight:600;' +
                                                        'background:#f1f3f5;' +
                                                        'color:' + color(d.pppoe_status)
                                        }, 'PPPoE: ' + value(d.pppoe_status))
                                ])
                        );

                        /*
                         * WAN
                         */
                        container.appendChild(section('WAN / PPPoE'));

                        container.appendChild(
                                grid([
                                        card('WAN link', d.wan_link, color(d.wan_link)),
                                        card('PPPoE', d.pppoe_status, color(d.pppoe_status)),
                                        card('IPv4', d.wan_ipv4),
                                        card('IPv6', d.wan_ipv6),
                                        card('VLAN', d.wan_vlan)
                                ])
                        );

                        /*
                         * NSS
                         */
                        container.appendChild(section('NSS'));

                        container.appendChild(
                                grid([
                                        card('Driver', d.nss_drv, color(d.nss_drv)),
                                        card('Datapath', d.nss_dp, color(d.nss_dp)),
                                        card('ECM', d.ecm_health, color(d.ecm_health)),
                                        card('ath11k NSS', d.ath11k_nss, color(d.ath11k_nss)),
                                        card('NSS Qdisc', d.qdisc, color(d.qdisc)),
                                        card('Modules', d.nss_modules)
                                ])
                        );

                        /*
                         * ECM
                         */
                        container.appendChild(section('ECM'));

                        container.appendChild(
                                grid([
                                        card('IPv4 accelerated', d.ecm_ipv4),
                                        card('IPv4 TCP', d.ecm_tcp),
                                        card('IPv4 UDP', d.ecm_udp),
                                        card('IPv6 accelerated', d.ecm_ipv6),
                                        card('IPv6 TCP', d.ecm_tcp6),
                                        card('IPv6 UDP', d.ecm_udp6)
                                ])
                        );

                        /*
                         * ECM database
                         */
                        container.appendChild(section('ECM database'));

                        container.appendChild(
                                grid([
                                        card('Connections', d.ecm_connections),
                                        card('Hosts', d.ecm_hosts),
                                        card('Interfaces', d.ecm_ifaces),
                                        card('Mappings', d.ecm_mappings),
                                        card('Nodes', d.ecm_nodes)
                                ])
                        );

                        /*
                         * Pipeline
                         */
                        container.appendChild(section('ECM pipeline'));

                        var pendingAccel =
                                (parseInt(d.ecm_pending, 10) || 0) +
                                (parseInt(d.ecm_pending6, 10) || 0);

                        var pendingDecel =
                                (parseInt(d.ecm_pending_decel, 10) || 0) +
                                (parseInt(d.ecm_pending_decel6, 10) || 0);

                        container.appendChild(
                                grid([
                                        card(
                                                'Pending acceleration',
                                                pendingAccel,
                                                numberColor(pendingAccel)
                                        ),
                                        card(
                                                'Pending deceleration',
                                                pendingDecel,
                                                numberColor(pendingDecel)
                                        ),
                                        card(
                                                'IPv4 accel',
                                                d.ecm_pending,
                                                numberColor(d.ecm_pending)
                                        ),
                                        card(
                                                'IPv4 decel',
                                                d.ecm_pending_decel,
                                                numberColor(d.ecm_pending_decel)
                                        ),
                                        card(
                                                'IPv6 accel',
                                                d.ecm_pending6,
                                                numberColor(d.ecm_pending6)
                                        ),
                                        card(
                                                'IPv6 decel',
                                                d.ecm_pending_decel6,
                                                numberColor(d.ecm_pending_decel6)
                                        )
                                ])
                        );

                        /*
                         * Diagnostics
                         */
                        container.appendChild(section('ECM diagnostics'));

                        var ipv4Active =
                                activeExceptions(d.ecm_exceptions4);

                        var ipv6Active =
                                activeExceptions(d.ecm_exceptions6);

                        container.appendChild(
                                grid([
                                        card(
                                                'IPv4 active exceptions',
                                                ipv4Active,
                                                numberColor(ipv4Active)
                                        ),
                                        card(
                                                'IPv6 active exceptions',
                                                ipv6Active,
                                                numberColor(ipv6Active)
                                        )
                                ], 6)
                        );

                        var details = E('details', {
                                'style':
                                        'margin-bottom:12px;' +
                                        'border:1px solid #e1e4e8;' +
                                        'border-radius:7px;' +
                                        'background:#fff'
                        });

                        details.appendChild(
                                E('summary', {
                                        'style':
                                                'cursor:pointer;' +
                                                'padding:9px 12px;' +
                                                'font-size:12px;' +
                                                'font-weight:600;' +
                                                'color:#555'
                                }, 'Show detailed ECM exceptions')
                        );

                        var exceptionBox = E('div', {
                                'style':
                                        'padding:10px;' +
                                        'border-top:1px solid #e5e5e5'
                        });

                        exceptionBox.appendChild(
                                E('div', {
                                        'style':
                                                'font-size:12px;' +
                                                'font-weight:600;' +
                                                'margin-bottom:5px'
                                }, 'IPv4')
                        );

                        exceptionBox.appendChild(
                                E('pre', {
                                        'style':
                                                'white-space:pre-wrap;' +
                                                'word-break:break-word;' +
                                                'font-size:11px;' +
                                                'line-height:1.4;' +
                                                'max-height:350px;' +
                                                'overflow:auto;' +
                                                'padding:10px;' +
                                                'margin:0 0 12px;' +
                                                'border:1px solid #e2e2e2;' +
                                                'border-radius:5px;' +
                                                'background:#fafafa'
                                }, value(d.ecm_exceptions4))
                        );

                        exceptionBox.appendChild(
                                E('div', {
                                        'style':
                                                'font-size:12px;' +
                                                'font-weight:600;' +
                                                'margin-bottom:5px'
                                }, 'IPv6')
                        );

                        exceptionBox.appendChild(
                                E('pre', {
                                        'style':
                                                'white-space:pre-wrap;' +
                                                'word-break:break-word;' +
                                                'font-size:11px;' +
                                                'line-height:1.4;' +
                                                'max-height:350px;' +
                                                'overflow:auto;' +
                                                'padding:10px;' +
                                                'margin:0;' +
                                                'border:1px solid #e2e2e2;' +
                                                'border-radius:5px;' +
                                                'background:#fafafa'
                                }, value(d.ecm_exceptions6))
                        );

                        details.appendChild(exceptionBox);
                        container.appendChild(details);

                        /*
                         * System
                         */
                        container.appendChild(section('System'));

                        container.appendChild(
                                grid([
                                        card('CPU load', d.cpu_load),
                                        card('Memory', d.memory),
                                        card('Uptime', d.uptime),
                                        card('Temperature', d.temperature),
                                        card('CPU frequency', d.cpu_freq),
                                        card('NSS modules', d.nss_modules)
                                ])
                        );

                        /*
                         * Interfaces
                         */
                        container.appendChild(section('LAN / Interfaces'));

                        container.appendChild(
                                grid([
                                        card('LAN1', d.lan1, color(d.lan1)),
                                        card('LAN2', d.lan2, color(d.lan2)),
                                        card('LAN3', d.lan3, color(d.lan3)),
                                        card('LAN4', d.lan4, color(d.lan4)),
                                        card('Bridge', d.br_lan, color(d.br_lan)),
                                        card('Wi-Fi 5 GHz', d.phy0, color(d.phy0)),
                                        card('Wi-Fi 2.4 GHz', d.phy1, color(d.phy1))
                                ])
                        );

                        /*
                         * Wi-Fi
                         */
                        container.appendChild(section('Wi-Fi'));

                        container.appendChild(
                                grid([
                                        card('Channel', d.wifi_channel),
                                        card('Wi-Fi IRQs', d.wifi_irqs)
                                ])
                        );
                }

                renderDashboard(data);

                var timer = setInterval(function() {
                        callDashboard().then(renderDashboard);
                }, 10000);

                container.addEventListener('remove', function() {
                        clearInterval(timer);
                });

                return container;
        }
});
