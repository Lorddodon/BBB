/**
 * Created with JetBrains WebStorm.
 * User: ralsicher
 * Date: 11.07.12
 * Time: 11:43
 */
var io = require('socket.io').listen(8000);
var utils = require('utils');

io.sockets.on('connection', function (socket) {
    utils.puts('Hello called');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});