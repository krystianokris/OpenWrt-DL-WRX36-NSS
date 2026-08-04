'use strict';

'require view';
'require rpc';

var callNss = rpc.declare({
 object: 'luci.nss-status',
 method: 'read',
 expect: {}
});

return view.extend({

 load: function() {
  return callNss();
 },

 render: function(data) {

  var table = E('table',{
   'class':'table'
  });

  for (var k in data) {
   table.appendChild(
    E('tr',{},[
     E('td',{},k),
     E('td',{},data[k])
    ])
   );
  }

  return E('div',{},[
   E('h2',{},'NSS Status'),
   table
  ]);
 }

});
