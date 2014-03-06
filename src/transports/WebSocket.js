var _ = require( 'lodash' ), EE,
WS = module.exports = {
app: null,
port: 9080, // TODO: this should be read in from defaults
clients: {},

server: null,
servers:{},

init: function( app ) {
this.app = app

EE = require( 'events' ).EventEmitter
this.__proto__ = new EE()

this.server = this.createServer( 9080 )

this.on( 'WebSocket server created', function( server, port ) {
WS.servers[ port ] = server
})
},
createServer : function( port ) {
if( this.servers[ port ] ) return this.servers[ port ]

var server = new (require( 'ws' ).Server)({ 'port': port })

server.clients = []

server.on( 'connection', function( client ) {
client.ip = client._socket.remoteAddress;
server.clients[ client.ip ] = WS.clients[ client.ip ] = client

client.on( 'message', function( msg ) {
console.log( 'WS MSG:', msg )
client.send( JSON.stringify( { handshake: true } ) )
})

client.on( 'close', function() {
delete WS.clients[ client.ip ]
WS.emit( 'WebSocket client closed', client.ip )
})

WS.emit( 'WebSocket client opened', client.ip )
})

server.output = function( path, typetags, values ) {
_.forIn( server.clients, function( client ) {
client.send( JSON.stringify({ 'path': path, 'value':values }) )
})
}

WS.servers[ port ] = server

this.emit( 'WebSocket server created', server, port )

return server
},


close: function( name ) {
if( name ) {
this.receivers[ name ].close()
delete this.receivers[ name ]
}else{
_.forIn( this.receivers, function( recv ) {
recv.close()
})
this.receivers = {}
}
},
}