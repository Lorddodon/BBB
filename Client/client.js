/**
 * Created with JetBrains WebStorm.
 * User: root
 * Date: 7/12/12
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */

var socket = io.connect();
var player = undefined;
var otherplayer = undefined;
var graph = undefined;

var bombs = [];

socket.on('graph', function(data){
    console.log('graph received..');
    graph = data['graph'];
    /*TODO: zeichne Feld nach graphen*/
    drawBackgroundGrid();
});

socket.on('identity', function(data){
    console.log('identity called')
    player = data['entity'];
    console.log(player);
})

socket.on('update',function(data){
    console.log(player);
    console.log(otherplayer);
    console.log("Player should be " + data.entity);

    if(player.id == data.entity.id){
        console.log('got current player id');
        var tmpx=player.x;
        var tmpy=player.y;
        player = data['entity'];
        drawPicture(0,player.x,player.y,tmpx,tmpy);
    }else{
        console.log('got other player id');
        if(otherplayer){
            var tmpx1=otherplayer.x;
            var tmpy1=otherplayer.y;
        }
        otherplayer = data['entity'];
        drawPicture(0,otherplayer.x,otherplayer.y,tmpx1,tmpy1);
    }




    console.log(player.x);

});

socket.on('show_flame',function(data){
    console.log(data);
    var id = data.id;
});

socket.on('bomb_placed',function(data){
    /*TODO: zeichne an position eine bombe*/
    var bomb = data['bomb'];
    bombs.push(bomb);
    drawBomb(bomb.x,bomb.y);
});

socket.on('bomb_explode',function(data){
    function remove (arr, index) {
        var arr2 = arr.splice(index).splice(1);
        return arr.concat(arr2);
    };
    var index = -1;
    for(var i = 0; i < bombs.length; i++) {
        if(bombs[i].id == data['id']) {
            index = i;
            break;
        }
    }
    var bomb = bombs[index];
    if(index > -1)
        remove(bombs,index);
    removeBomb(bomb.x,bomb.y);
});

socket.on('delete_entities',function(data){

});

socket.on('players_died',function(data){
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
    socket.emit("drop_bomb",{id:player.id})
    console.log("drop_bomb")
});

function drawBomb(xpos, ypos){
    var index = 51;
    var canvas, context, width, height, x = 0, y = 0, numFrames = 15, frameSize = 29;
    var mul = 30;image = new Image();
    image.src = "./spritesheet.png";
    image.onload = function() {
        width = image.width;
        height = image.height;
        canvas = document.getElementById("bombs");
        y = (index-(index%numFrames))/numFrames*frameSize;
        x = (index%numFrames)*frameSize;
        context = canvas.getContext("2d");
        context.drawImage(image, x, y, frameSize, frameSize, xpos*mul+4, ypos*mul+4, frameSize, frameSize);
    }
}

function removeBomb(xpos, ypos) {
    var canvas, context;
    var mul = 30;
    canvas = document.getElementById("bombs");
    context = canvas.getContext("2d");
    context.clearRect(xpos*mul+4, ypos*mul+4, 30, 30);
}

function drawBackgroundGrid() {
    var canvas, context;
    canvas = document.getElementById("background");
    context = canvas.getContext("2d");
    var fieldAspect = 30;
    var numberFields = graph.width;
    for(var i = 0; i <= graph.width*fieldAspect; i+=fieldAspect) {
            context.moveTo(i,0);
            context.lineTo(i,graph.width*fieldAspect);
    }
    for(var j = 0; j <= graph.height*fieldAspect;j+=fieldAspect) {
        context.moveTo(0,j);
        context.lineTo(graph.width*fieldAspect,j);
    }
    context.stroke();
    for(var i = 1; i < graph.width; i+=2) {
        for(var j = 1; j < graph.height; j+=2) {
            context.fillRect(i*fieldAspect,j*fieldAspect,fieldAspect,fieldAspect);
            context.stroke();
        }
    }
}

function drawPicture(index,xpos,ypos,xposold,yposold)
{
    var canvas, context, image, width, height, x = 0, y = 0, numFrames = 15, frameSize = 29;
    var mul = 30;
    image = new Image();
    image.src = "./spritesheet.png";
    image.onload = function() {
        width = image.width;
        height = image.height;
        canvas = document.getElementById("myCanvas");
        y = (index-(index%numFrames))/numFrames*frameSize;
        x = (index%numFrames)*frameSize;
        context = canvas.getContext("2d");
        context.clearRect(xposold*mul+4, yposold*mul+4, 30, 30);
        context.drawImage(image, x, y, frameSize, frameSize, xpos*mul+4, ypos*mul+4, frameSize, frameSize);
    }
}

