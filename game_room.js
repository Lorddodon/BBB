/**
 * Created with JetBrains WebStorm.
 * User: reini
 * Date: 11.07.12
 * Time: 17:21
 */

var io = require('socket.io').listen(8889);

io.sockets.on('connect',function(socket){
    socket.emit('ping',{data:'hello world'});
    socket.on('pong',function(data){
       console.log(data);
    });
});