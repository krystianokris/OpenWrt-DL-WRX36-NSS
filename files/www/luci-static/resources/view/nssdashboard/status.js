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
			'flex:1 1 200px;' +
			'padding:14px;' +
			'border:1px solid #ddd;' +
			'border-radius:8px;' +
			'background:#fff;' +
			'box-shadow:0 1px 3px rgba(0,0,0,.08)'
	}, [
		E('div', {
			'style':
				'color:#666;' +
				'font-size:12px;' +
				'text-transform:uppercase;' +
				'margin-bottom:6px'
		}, label),

		E('div', {
			'style':
				'font-size:20px;' +
				'font-weight:600;' +
				'color:' + (state || '#222')
		}, String(value ?? 'Unavailable'))
	]);
}

function section(title, cards) {
	return E('div', {
		'style':'margin-bottom:24px'
	}, [
		E('h3', {
			'style':'margin-bottom:12px'
		}, title),

		E('div', {
			'style':
				'display:flex;' +
				'flex-wrap:wrap;' +
				'gap:12px'
		}, cards)
	]);
}

return view.extend({

	load: function() {
		return callDashboard();
	},

	render: function(data) {

		data = data || {};

		var nssState =
			data.ath11k_nss == 'Enabled'
				? '#17803d'
				: '#b33a3a';

		var qdiscState =
			data.qdisc == 'Enabled'
				? '#17803d'
				: '#b33a3a';

		var pendingState =
			Number(data.ecm_pending || 0) === 0
				? '#17803d'
				: '#b36b00';

		return E('div', {}, [

			E('h2', {}, 'DL-WRX36 NSS Dashboard'),

			E('p', {
				'style':
					'margin-bottom:20px;color:#666'
			}, 'Live NSS, ECM and Wi-Fi acceleration status'),

			section('System', [
				card('CPU Load', data.cpu_load),
				card('Memory', data.memory),
				card('Uptime', data.uptime),
				card('Temperature', data.temperature),
				card('CPU Frequency', data.cpu_freq),
				card('NSS Modules', data.nss_modules)
			]),

			section('NSS acceleration', [
				card(
					'ath11k NSS',
					data.ath11k_nss,
					nssState
				),

				card(
					'NSS Qdisc',
					data.qdisc,
					qdiscState
				)
			]),

			section('ECM IPv4 acceleration', [
				card('IPv4 accelerated', data.ecm_ipv4),
				card('TCP accelerated', data.ecm_tcp),
				card('UDP accelerated', data.ecm_udp),
				card(
					'Pending acceleration',
					data.ecm_pending,
					pendingState
				)
			]),

			section('ECM IPv6 acceleration', [
				card('IPv6 accelerated', data.ecm_ipv6),
				card('TCP6 accelerated', data.ecm_tcp6),
				card('UDP6 accelerated', data.ecm_udp6),
				card(
					'Pending IPv6',
					data.ecm_pending6
				)
			]),

			section('ECM database', [
				card('Connections', data.ecm_connections),
				card('Hosts', data.ecm_hosts),
				card('Interfaces', data.ecm_ifaces),
				card('Mappings', data.ecm_mappings),
				card('Nodes', data.ecm_nodes)
			]),

			section('Wi-Fi', [
				card('Channel', data.wifi_channel),
				card('Wi-Fi IRQs', data.wifi_irqs)
			])
		]);
	}
});
