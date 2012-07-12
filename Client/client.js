/**
 * Created with JetBrains WebStorm.
 * User: root
 * Date: 7/12/12
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */

var socket = io.connect('http://localhost:8000');
var player = undefined;
var graph = undefined;

socket.on('graph', function(data){
    console.log('graph received..');
    graph = data['graph'];
    /*TODO: zeichne Feld nach graphen*/
});

socket.on('identity', function(data){
    console.log('identity called')
    player = data['entity'];
    console.log(player);
})

socket.on('update',function(data){
    console.log(data);
    player = data['player'];
    console.log(player.xpos);

});

socket.on('show_flame',function(data){
   console.log('show the animation..');
    /*TODO: implement this*/
});

socket.on('bomb_placed',function(data){
    /*TODO: zeichne an position eine bombe*/
    var bomb = data['bomb'];
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

function drawPicture(index,xpos,ypos,xposold,yposold)
{
    var canvas, context, image, width, height, x = 0, y = 0, numFrames = 15, frameSize = 29;
    var mul = 30;
    image = new Image();
    image.src = "./spritesheet.png";
    image.onload = function() {
        width = image.width;
        height = image.height;
        canvas = document.getElementById("canvas");
        y = (index-(index%numFrames))/numFrames*frameSize;
        x = (index%numFrames)*frameSize;
        context = canvas.getContext("2d");
        context.clearRect(xposold*mul, yposold*mul, canvas.width, canvas.height);
        context.drawImage(image, x, y, frameSize, frameSize, xpos*mul, xpos*mul, frameSize, frameSize);
    }
}

