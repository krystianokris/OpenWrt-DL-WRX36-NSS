'use strict';

'require view';
'require rpc';

var callMesh = rpc.declare({
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

        if (v === 'Active' ||
            v === 'UP' ||
            v === 'Connected')
                return '#17803d';

        if (v === 'WARNING')
                return '#b7791f';

        if (v === 'Down' ||
            v === 'Inactive' ||
            v === 'Disabled' ||
            v === 'Disconnected' ||
            v === 'ERROR')
                return '#b33a3a';

        return '#222';
}

function card(label, val, state) {
        return E('div', {
                'style':
                        'flex:1 1 180px;' +
                        'min-width:160px;' +
                        'padding:14px;' +
                        'border:1px solid #e2e5e8;' +
                        'border-radius:8px;' +
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
                                'margin-bottom:6px'
                }, label),

                E('div', {
                        'style':
                                'font-size:18px;' +
                                'font-weight:600;' +
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

function grid(cards) {
        return E('div', {
                'style':
                        'display:flex;' +
                        'flex-wrap:wrap;' +
                        'gap:9px;' +
                        'margin-bottom:10px'
        }, cards);
}

function badge(text, state) {
        var c = color(state);

        var bg = '#f8f9fa';
        var fg = '#555';
        var border = '#e2e5e8';

        if (c === '#17803d') {
                bg = '#edf7f0';
                fg = '#176b35';
                border = '#cfe8d6';
        }

        if (c === '#b33a3a') {
                bg = '#fbeeee';
                fg = '#a12f2f';
                border = '#f0cccc';
        }

        return E('span', {
                'style':
                        'display:inline-block;' +
                        'padding:5px 10px;' +
                        'border-radius:6px;' +
                        'font-size:12px;' +
                        'font-weight:600;' +
                        'background:' + bg + ';' +
                        'color:' + fg + ';' +
                        'border:1px solid ' + border
        }, text);
}

return view.extend({

        load: function() {
                return callMesh();
        },

        render: function(data) {
                var d = data || {};

                var container = E('div', {
                        'class': 'cbi-map'
                });

                container.appendChild(
                        E('h2', {}, _('Mesh / BATMAN-adv'))
                );

                container.appendChild(
                        E('div', {
                                'style':
                                        'margin-bottom:14px;' +
                                        'color:#666'
                        }, _('Live BATMAN-adv mesh status'))
                );

                container.appendChild(
                        E('div', {
                                'style':
                                        'display:flex;' +
                                        'gap:8px;' +
                                        'flex-wrap:wrap;' +
                                        'margin-bottom:15px'
                        }, [
                                badge(
                                        'BATMAN: ' +
                                        value(d.mesh_status),
                                        d.mesh_status
                                ),
                                badge(
                                        'Interface: ' +
                                        value(d.mesh_iface),
                                        d.mesh_status
                                ),
                                badge(
                                        'uSteer: ' +
                                        value(d.usteer_status || 'Unknown'),
                                        d.usteer_status
                                )
                        ])
                );

                /*
                 * BATMAN interface
                 */
                container.appendChild(
                        section('BATMAN interface')
                );

                container.appendChild(
                        grid([
                                card(
                                        'Status',
                                        d.mesh_status,
                                        color(d.mesh_status)
                                ),
                                card(
                                        'Interface',
                                        d.mesh_iface
                                ),
                                card(
                                        'MAC',
                                        d.mesh_mac
                                ),
                                card(
                                        'Gateway',
                                        d.mesh_gateway
                                )
                        ])
                );

                /*
                 * Mesh topology
                 */
                container.appendChild(
                        section('Mesh topology')
                );

                container.appendChild(
                        grid([
                                card(
                                        'Originators',
                                        d.mesh_originators
                                ),
                                card(
                                        'Neighbors',
                                        d.mesh_neighbors
                                ),
                                card(
                                        'Gateway',
                                        d.mesh_gateway
                                )
                        ])
                );

                /*
                 * BATMAN features
                 */
                container.appendChild(
                        section('BATMAN-adv features')
                );

                container.appendChild(
                        grid([
                                card(
                                        'BATMAN V',
                                        d.batman_v || 'Enabled'
                                ),
                                card(
                                        'BLA',
                                        d.batman_bla || 'Enabled'
                                ),
                                card(
                                        'DAT',
                                        d.batman_dat || 'Enabled'
                                ),
                                card(
                                        'Multicast',
                                        d.batman_mcast || 'Enabled'
                                )
                        ])
                );

                /*
                 * uSteer
                 */
                container.appendChild(
                        section('uSteer roaming')
                );

                container.appendChild(
                        grid([
                                card(
                                        'uSteer',
                                        d.usteer_status || 'Unknown',
                                        color(d.usteer_status)
                                )
                        ])
                );

                /*
                 * Help
                 */
                container.appendChild(
                        E('div', {
                                'style':
                                        'margin-top:18px;' +
                                        'padding:12px 14px;' +
                                        'border:1px solid #e2e5e8;' +
                                        'border-radius:8px;' +
                                        'background:#f8f9fa;' +
                                        'color:#555;' +
                                        'font-size:12px'
                        }, _(
                                'BATMAN-adv provides the mesh layer. ' +
                                'Wireless 802.11s links must be configured ' +
                                'on the participating access points.'
                        ))
                );

                return container;
        },

        handleSaveApply: null,
        handleSave: null,
        handleReset: null
});
