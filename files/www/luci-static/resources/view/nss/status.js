'use strict';

'require view';
'require rpc';

var callNss = rpc.declare({ object: 'luci.nss-status', method: 'read', expect: {} });

return view.extend({
	load: function() { return callNss(); },
	render: function(data) {
		var rows = [
			[ 'ath11k NSS offload', data.ath11k_nss ],
			[ 'ECM module', data.ecm_module ],
			[ 'NSS module count', data.nss_module_count ],
			[ 'Loaded NSS modules', data.loaded_modules ]
		];
		return E('div', {}, [
			E('h2', {}, 'NSS Status'),
			E('table', { 'class': 'table' }, rows.map(function(row) {
				return E('tr', {}, [ E('td', {}, row[0]), E('td', {}, String(row[1] || 'Unavailable')) ]);
			}))
		]);
	}
});
