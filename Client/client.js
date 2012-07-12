/**
 * Created with JetBrains WebStorm.
 * User: root
 * Date: 7/12/12
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */

var socket = io.connect('http://localhost:8000');
var utils = require('utils');


socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

socket.on('identity', function(){
    console.log('identity called')

})

Mousetrap.bind('right', function() {
    socket.emit("run_right")
    console.log("run_right")

});

Mousetrap.bind('left', function() {
    socket.emit("run_left")
    console.log("run_left")

});
Mousetrap.bind('up', function() {
    socket.emit("run_up")
    console.log("run_up")
});
Mousetrap.bind('down', function() {
    socket.emit("run_down")
    console.log("run_down")
});
Mousetrap.bind('space', function() {
    socket.emit("drop_bomb")
    console.log("drop_bomb")
});