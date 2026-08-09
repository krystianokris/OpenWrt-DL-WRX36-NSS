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
