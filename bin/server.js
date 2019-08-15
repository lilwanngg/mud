var app = require('../app');
var debug = require('debug')
var http = require('http');

var port = process.env.PORT || '3000';
app.set('port', process.env.PORT || '3000');
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
