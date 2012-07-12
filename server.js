/**
 * Created with JetBrains WebStorm.
 * User: ralsicher
 * Date: 11.07.12
 * Time: 11:43
 */
var http = require('http');
var socketio = require('socket.io');
var express = require('express');

var field = require('./graph/Field').Field(9,9);
field.connect();

var playerFactory = require('./entity/Player');

var game = [];
var playerCount = 0;

var app = express.createServer();
app.use(express.static(__dirname));
app.listen(8000);

var socketconnection = socketio.listen(app);

/*TODO: wenn index.html aufgerufen werden soll lobby zeigen ...*/
app.get('/', function(req, res){
    /*TODO: fürs erste sollte es reichen das man ein spiel eröffnet und die spielen dort zuweist..*/
    res.sendfile(__dirname + '/Client/Client.html');
});

var clients=[undefined,undefined];
var clientNumber=0;

var players = [];

socketconnection.sockets.on('connection', function (socket) {
    if(clientNumber < 2) {
        if(clientNumber){
            var player = playerFactory.player(8,8,clientNumber);
            players[clientNumber] = player;
            field.getNode(8,8).containedEntity = player; /*new player*/;
            socket.emit('identity',{player:player});
        } else {
            var player = playerFactory.player(0,0,clientNumber);
            players[clientNumber] = player;
            field.getNode(0,0).containedEntity = player; /*new player*/;
            socket.emit('identity',{player:player});
        }
        clients[clientNumber++] = socket;


        socket.on('run_up',function(data){
            var player = players[data['id']];
            if(field.getNode(player.x,player.y-1)){
                player.y -= 1;
                clients[0].emit('update',{player_x:player.x,player_y:player.y});
                clients[1].emit('update',{player_x:player.x,player_y:player.y});
            }
        });
        socket.on('run_down',function(data){
            var player = players[data['id']];
            if(field.getNode(player.x,player.y+1)){
                player.y += 1;
                clients[0].emit('update',{player_x:player.x,player_y:player.y});
                clients[1].emit('update',{player_x:player.x,player_y:player.y});
            }
        });
        socket.on('run_left',function(data){
            var player = players[data['id']];
            if(field.getNode(player.x-1,player.y)){
                player.x -= 1;
                clients[0].emit('update',{player_x:player.x,player_y:player.y});
                clients[1].emit('update',{player_x:player.x,player_y:player.y});
            }
        });
        socket.on('run_right',function(data){
            var player = players[data['id']];
            if(field.getNode(player.x+1,player.y)){
                player.x += 1;
                clients[0].emit('update',{player_x:player.x,player_y:player.y});
                clients[1].emit('update',{player_x:player.x,player_y:player.y});
            }
        });
        socket.on('drop_bomb',function(data){

        });
    } else {
        console.log('Game full..');
    }
});


