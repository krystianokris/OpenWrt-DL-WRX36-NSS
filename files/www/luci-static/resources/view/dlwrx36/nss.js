'use strict';
'require view';
'require rpc';

var call_status = rpc.declare({
	object: 'luci',
	method: 'nss-dashboard',
	params: ['read'],
	expect: { }
});

return view.extend({

	load: function() {
		return call_status('read');
	},

	render: function(data) {

		var d = data || {};

		return E('div', {}, [

			E('h2', {}, _('DL-WRX36 NSS Dashboard')),

			E('table', {
				'class':'table'
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
					E('td', {}, _('Temperature')),
					E('td', {}, d.temperature || '-')
				]),

				E('tr', {}, [
					E('td', {}, _('NSS Qdisc')),
					E('td', {}, d.qdisc || '-')
				]),

				E('tr', {}, [
					E('td', {}, _('CPU Frequency')),
					E('td', {}, d.cpu_freq || '-')
				]),

				E('tr', {}, [
					E('td', {}, _('ECM IPv4 Accelerated')),
					E('td', {}, d.ecm_ipv4 || '-')
				]),

				E('tr', {}, [
					E('td', {}, _('ath11k NSS')),
					E('td', {}, d.ath11k_nss || '-')
				])

			])

		]);
	}

});
