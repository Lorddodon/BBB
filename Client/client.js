/**
 * Created with JetBrains WebStorm.
 * User: root
 * Date: 7/12/12
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */

var socket = io.connect('http://localhost:8000');
var player = undefined;

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

socket.on('identity', function(data){
    console.log('identity called')
    player = data['entity'];
    console.log(player);
})

socket.on('update',function(data){
   console.log(data);
});

Mousetrap.bind('right', function() {
    socket.emit("run_right",{id:player.id})
    console.log("run_right")

});

Mousetrap.bind('left', function() {
    socket.emit("run_left",{id:player.id})
    console.log("run_left")

});
Mousetrap.bind('up', function() {
    socket.emit("run_up",{id:player.id})
    console.log("run_up")
});
Mousetrap.bind('down', function() {
    socket.emit("run_down",{id:player.id})
    console.log("run_down")
});
Mousetrap.bind('space', function() {
    socket.emit("drop_bomb")
    console.log("drop_bomb")
});