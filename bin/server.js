var app = require('../app');
var debug = require('debug')
var http = require('http');

var port = process.env.PORT || '8080';
app.set('port', port);
var server = http.createServer(app);

server.listen(port);
server.on('listening', onListening);


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
