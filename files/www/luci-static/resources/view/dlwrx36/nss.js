'use strict';

'require view';
'require rpc';

var call_status = rpc.declare({
        object: 'luci.nss-dashboard',
        method: 'read',
        expect: {}
});

return view.extend({

        load: function() {
                return call_status();
        },

        render: function(data) {

                var d = data || {};

                return E('div', {}, [

                        E('h2', {}, _('DL-WRX36 NSS')),

                        E('p', {
                                'style': 'margin-bottom:16px;color:#666'
                        }, _('Live NSS, ECM and system status')),

                        E('table', {
                                'class': 'table'
                        }, [

                                E('tr', {}, [
                                        E('td', {}, _('Build')),
                                        E('td', {}, d.build || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('CPU Load')),
                                        E('td', {}, d.cpu_load || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('Memory')),
                                        E('td', {}, d.memory || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('Uptime')),
                                        E('td', {}, d.uptime || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('Temperature')),
                                        E('td', {}, d.temperature || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('CPU Frequency')),
                                        E('td', {}, d.cpu_freq || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('NSS Qdisc')),
                                        E('td', {}, d.qdisc || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('ath11k NSS')),
                                        E('td', {}, d.ath11k_nss || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('NSS Modules')),
                                        E('td', {}, d.nss_modules || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('ECM IPv4 Accelerated')),
                                        E('td', {}, d.ecm_ipv4 || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('ECM TCP Accelerated')),
                                        E('td', {}, d.ecm_tcp || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('ECM UDP Accelerated')),
                                        E('td', {}, d.ecm_udp || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('ECM Pending')),
                                        E('td', {}, d.ecm_pending || '-')
                                ]),

                                E('tr', {}, [
                                        E('td', {}, _('Wi-Fi Channel')),
                                        E('td', {}, d.wifi_channel || '-')
                                ])

                        ])

                ]);
        }

});
