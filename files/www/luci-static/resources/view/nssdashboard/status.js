'use strict';

'require view';
'require rpc';

var callDashboard = rpc.declare({
	object: 'luci.nss-dashboard',
	method: 'read',
	expect: {}
});

function card(label, value, state) {
	return E('div', { 'style': 'flex:1 1 210px;padding:14px;border:1px solid #ddd;border-radius:6px;background:#fff' }, [
		E('div', { 'style': 'color:#666;font-size:12px;text-transform:uppercase;margin-bottom:6px' }, label),
		E('div', { 'style': 'font-size:18px;font-weight:600;color:' + (state || '#222') }, String(value || 'Unavailable'))
	]);
}

return view.extend({
	load: function() {
		return callDashboard();
	},

	render: function(data) {
		var nssState = data.ath11k_nss == 'Enabled' ? '#17803d' : '#b33a3a';
		return E('div', {}, [
			E('h2', {}, 'DL-WRX36 NSS Dashboard'),
			E('p', { 'style': 'margin-bottom:16px;color:#666' }, 'Live NSS, ECM and Wi-Fi acceleration status'),
			E('h3', {}, 'System'),
			E('div', { 'style': 'display:flex;flex-wrap:wrap;gap:12px;margin-bottom:18px' }, [
				card('CPU load', data.cpu_load),
				card('Memory', data.memory),
				card('Uptime', data.uptime),
				card('ath11k NSS', data.ath11k_nss, nssState),
				card('NSS modules', data.nss_modules)
			]),
			E('h3', {}, 'ECM acceleration'),
			E('div', { 'style': 'display:flex;flex-wrap:wrap;gap:12px;margin-bottom:18px' }, [
				card('IPv4 accelerated', data.ecm_ipv4),
				card('TCP accelerated', data.ecm_tcp),
				card('UDP accelerated', data.ecm_udp),
				card('Total accelerated', data.ecm_total),
				card('Pending acceleration', data.ecm_pending)
			]),
			E('h3', {}, 'Wi-Fi'),
			E('div', { 'style': 'display:flex;flex-wrap:wrap;gap:12px' }, [
				card('Channel', data.wifi_channel),
				card('Wi-Fi IRQs', data.wifi_irqs)
			])
		]);
	}
});
