/**
 * Created with JetBrains WebStorm.
 * User: reini
 * Date: 13.07.12
 * Time: 08:44
 * To change this template use File | Settings | File Templates.
 */
var server = require('../server.js').startServer(9000);
var socketio = require('socket.io');
var dummyClient = socketio.io.connect('http://localhost:9000');

dummyClient.on('identity',function(data){
   console.log(data);
});