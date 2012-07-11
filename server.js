/**
 * Created with JetBrains WebStorm.
 * User: ralsicher
 * Date: 11.07.12
 * Time: 11:43
 */
var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});