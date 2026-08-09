'use strict';

'require view';
'require rpc';

var callDashboard = rpc.declare({
        object: 'luci.nss-dashboard',
        method: 'read',
        expect: {}
});

function card(label, value, state) {
        return E('div', {
                'style':
                        'flex:1 1 210px;padding:14px;' +
                        'border:1px solid #ddd;border-radius:8px;' +
                        'background:#fff'
        }, [
                E('div', {
                        'style':
                                'color:#666;font-size:12px;' +
                                'text-transform:uppercase;margin-bottom:6px'
                }, label),

                E('div', {
                        'style':
                                'font-size:18px;font-weight:600;color:' +
                                (state || '#222')
                }, String(value || 'Unavailable'))
        ]);
}

function statusColor(value) {
        if (value === 'OK' ||
            value === 'Enabled' ||
            value === 'UP' ||
            value === 'Connected')
                return '#17803d';

        if (value === 'WARNING')
                return '#b7791f';

        if (value === 'ERROR' ||
            value === 'DOWN' ||
            value === 'Disabled' ||
            value === 'Disconnected')
                return '#b33a3a';

        return '#222';
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

                        var healthColor = statusColor(d.health);

                        container.innerHTML = '';

                        container.appendChild(
                                E('h2', {}, 'DL-WRX36 NSS Dashboard')
                        );

                        container.appendChild(
                                E('p', {
                                        'style':
                                                'margin-bottom:16px;color:#666'
                                }, 'Live NSS, ECM, WAN and system status')
                        );

                        container.appendChild(E('h3', {}, 'Overall health'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:18px'
                                }, [
                                        card('System health', d.health, healthColor),
                                        card('NSS driver', d.nss_drv, statusColor(d.nss_drv)),
                                        card('NSS datapath', d.nss_dp, statusColor(d.nss_dp)),
                                        card('ECM', d.ecm_health, statusColor(d.ecm_health)),
                                        card('ath11k NSS', d.ath11k_nss, statusColor(d.ath11k_nss)),
                                        card('NSS Qdisc', d.qdisc, statusColor(d.qdisc))
                                ])
                        );

                        container.appendChild(E('h3', {}, 'WAN / PPPoE'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:18px'
                                }, [
                                        card('WAN link', d.wan_link, statusColor(d.wan_link)),
                                        card('PPPoE', d.pppoe_status, statusColor(d.pppoe_status)),
                                        card('WAN IPv4', d.wan_ipv4),
                                        card('WAN IPv6', d.wan_ipv6),
                                        card('VLAN', d.wan_vlan)
                                ])
                        );

                        container.appendChild(E('h3', {}, 'System'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:18px'
                                }, [
                                        card('CPU load', d.cpu_load),
                                        card('Memory', d.memory),
                                        card('Uptime', d.uptime),
                                        card('Temperature', d.temperature),
                                        card('CPU frequency', d.cpu_freq),
                                        card('NSS modules', d.nss_modules)
                                ])
                        );

                        container.appendChild(E('h3', {}, 'ECM IPv4'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:18px'
                                }, [
                                        card('Accelerated', d.ecm_ipv4),
                                        card('TCP', d.ecm_tcp),
                                        card('UDP', d.ecm_udp),
                                        card('Pending', d.ecm_pending)
                                ])
                        );

                        container.appendChild(E('h3', {}, 'ECM IPv6'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:18px'
                                }, [
                                        card('Accelerated', d.ecm_ipv6),
                                        card('TCP', d.ecm_tcp6),
                                        card('UDP', d.ecm_udp6),
                                        card('Pending', d.ecm_pending6)
                                ])
                        );

                        container.appendChild(E('h3', {}, 'ECM database'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:18px'
                                }, [
                                        card('Connections', d.ecm_connections),
                                        card('Hosts', d.ecm_hosts),
                                        card('Interfaces', d.ecm_ifaces),
                                        card('Mappings', d.ecm_mappings),
                                        card('Nodes', d.ecm_nodes)
                                ])
                        );

                        container.appendChild(E('h3', {}, 'ECM pipeline'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:18px'
                                }, [
                                        card('IPv4 pending accel', d.ecm_pending),
                                        card('IPv4 pending decel', d.ecm_pending_decel),
                                        card('IPv6 pending accel', d.ecm_pending6),
                                        card('IPv6 pending decel', d.ecm_pending_decel6)
                                ])
                        );

                        /*
                         * Compact ECM diagnostics.
                         * The raw exception counters remain available
                         * inside a collapsed details section.
                         */
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

                        function diagnosticColor(value) {
                                return (parseInt(value, 10) || 0) === 0 ?
                                        '#17803d' : '#b7791f';
                        }

                        container.appendChild(
                                E('h3', {}, 'ECM Diagnostics')
                        );

                        var ipv4Active = activeExceptions(d.ecm_exceptions4);
                        var ipv6Active = activeExceptions(d.ecm_exceptions6);

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:12px'
                                }, [
                                        card(
                                                'IPv4 active exceptions',
                                                ipv4Active,
                                                diagnosticColor(ipv4Active)
                                        ),
                                        card(
                                                'IPv6 active exceptions',
                                                ipv6Active,
                                                diagnosticColor(ipv6Active)
                                        ),
                                        card(
                                                'Pending acceleration',
                                                (parseInt(d.ecm_pending, 10) || 0) +
                                                (parseInt(d.ecm_pending6, 10) || 0),
                                                diagnosticColor(
                                                        (parseInt(d.ecm_pending, 10) || 0) +
                                                        (parseInt(d.ecm_pending6, 10) || 0)
                                                )
                                        ),
                                        card(
                                                'Pending deceleration',
                                                (parseInt(d.ecm_pending_decel, 10) || 0) +
                                                (parseInt(d.ecm_pending_decel6, 10) || 0),
                                                diagnosticColor(
                                                        (parseInt(d.ecm_pending_decel, 10) || 0) +
                                                        (parseInt(d.ecm_pending_decel6, 10) || 0)
                                                )
                                        )
                                ])
                        );

                        var details = E('details', {
                                'style':
                                        'margin-bottom:18px;' +
                                        'border:1px solid #ddd;' +
                                        'border-radius:8px;' +
                                        'background:#fff;' +
                                        'overflow:hidden'
                        });

                        details.appendChild(
                                E('summary', {
                                        'style':
                                                'cursor:pointer;' +
                                                'padding:12px 14px;' +
                                                'font-weight:600;' +
                                                'color:#444;' +
                                                'background:#f7f7f7'
                                }, '▶ Show detailed ECM exceptions')
                        );

                        var exceptionBox = E('div', {
                                'style':
                                        'padding:14px;' +
                                        'background:#fafafa'
                        });

                        exceptionBox.appendChild(
                                E('h4', {
                                        'style':
                                                'margin:4px 0 8px'
                                }, 'IPv4 exceptions')
                        );

                        exceptionBox.appendChild(
                                E('pre', {
                                        'style':
                                                'white-space:pre-wrap;' +
                                                'word-break:break-word;' +
                                                'font-size:12px;' +
                                                'line-height:1.45;' +
                                                'max-height:500px;' +
                                                'overflow:auto;' +
                                                'padding:12px;' +
                                                'border:1px solid #ddd;' +
                                                'border-radius:6px;' +
                                                'background:#fff'
                                }, String(d.ecm_exceptions4 || 'Unavailable'))
                        );

                        exceptionBox.appendChild(
                                E('h4', {
                                        'style':
                                                'margin:18px 0 8px'
                                }, 'IPv6 exceptions')
                        );

                        exceptionBox.appendChild(
                                E('pre', {
                                        'style':
                                                'white-space:pre-wrap;' +
                                                'word-break:break-word;' +
                                                'font-size:12px;' +
                                                'line-height:1.45;' +
                                                'max-height:500px;' +
                                                'overflow:auto;' +
                                                'padding:12px;' +
                                                'border:1px solid #ddd;' +
                                                'border-radius:6px;' +
                                                'background:#fff'
                                }, String(d.ecm_exceptions6 || 'Unavailable'))
                        );

                        details.appendChild(exceptionBox);
                        container.appendChild(details);

                        container.appendChild(E('h3', {}, 'LAN / Interfaces'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px;margin-bottom:18px'
                                }, [
                                        card('LAN1', d.lan1, statusColor(d.lan1)),
                                        card('LAN2', d.lan2, statusColor(d.lan2)),
                                        card('LAN3', d.lan3, statusColor(d.lan3)),
                                        card('LAN4', d.lan4, statusColor(d.lan4)),
                                        card('Bridge', d.br_lan, statusColor(d.br_lan)),
                                        card('Wi-Fi 5 GHz', d.phy0, statusColor(d.phy0)),
                                        card('Wi-Fi 2.4 GHz', d.phy1, statusColor(d.phy1))
                                ])
                        );

                        container.appendChild(E('h3', {}, 'Wi-Fi'));

                        container.appendChild(
                                E('div', {
                                        'style':
                                                'display:flex;flex-wrap:wrap;' +
                                                'gap:12px'
                                }, [
                                        card('Channel', d.wifi_channel),
                                        card('Wi-Fi IRQs', d.wifi_irqs)
                                ])
                        );
                }

                renderDashboard(data);

                /* Auto-refresh every 10 seconds */
                var timer = setInterval(function() {
                        callDashboard().then(renderDashboard);
                }, 10000);

                container.addEventListener('remove', function() {
                        clearInterval(timer);
                });

                return container;
        }
});
