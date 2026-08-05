'use strict';

'require view';
'require rpc';

var callEcm = rpc.declare({ object: 'luci.ecm-status', method: 'read', expect: {} });

return view.extend({
	load: function() { return callEcm(); },
	render: function(data) {
		var rows = [
			[ 'IPv4 accelerated', data.ipv4_accelerated ],
			[ 'TCP accelerated', data.ipv4_tcp ],
			[ 'UDP accelerated', data.ipv4_udp ],
			[ 'Total accelerated', data.total_accelerated ],
			[ 'Pending acceleration', data.pending_accel ]
		];
		return E('div', {}, [
			E('h2', {}, 'ECM Status'),
			E('table', { 'class': 'table' }, rows.map(function(row) {
				return E('tr', {}, [ E('td', {}, row[0]), E('td', {}, String(row[1] || '0')) ]);
			}))
		]);
	}
});
