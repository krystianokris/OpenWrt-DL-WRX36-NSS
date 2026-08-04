'use strict';

'require view';
'require rpc';

var callDash = rpc.declare({
 object:'luci.nss-dashboard',
 method:'read',
 expect:{}
});


return view.extend({

load:function(){
 return callDash();
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
 E('h2',{},'DL-WRX36 NSS Dashboard'),
 table
]);

}

});
