'use strict';

'require view';
'require rpc';

var callECM = rpc.declare({
 object:'luci.ecm-status',
 method:'read',
 expect:{}
});

return view.extend({

load:function(){
 return callECM();
},

render:function(data){

var table=E('table',{
'class':'table'
});

for(var k in data){

table.appendChild(
 E('tr',{},[
  E('td',{},k),
  E('td',{},data[k])
 ])
);

}

return E('div',{},[
 E('h2',{},'ECM Status'),
 table
]);

}

});
