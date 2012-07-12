/**
 * Created with JetBrains WebStorm.
 * User: ralsicher
 * Date: 11.07.12
 * Time: 11:43
 */
var http = require('http');
var socketio = require('socket.io');
var express = require('express');

maxBombCount = 2;
bombRadius = 3;
bombId = 0;
bombs = [];


var field = require('./graph/Field').Field(9,9);
field.connect();

var entityFactory = require('./entity/Entity');

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

function broadCast(command, data) {
    if(clients[0])
    clients[0].emit(command,data);
    if(clients[1])
    clients[1].emit(command,data);
}

socketconnection.sockets.on('connection', function (socket) {
    if(clientNumber < 2) {
        if(clientNumber){
            var player = entityFactory.entity(8,8,clientNumber, "player");
            field.getNode(8,8).containedEntity = player; /*new player*/;
            socket.emit('identity',{entity:player});
            player.currentBombCount = 0;
            players[clientNumber] = player;
        } else {
            var player = entityFactory.entity(0,0,clientNumber, "player");
            field.getNode(0,0).containedEntity = player; /*new player*/;
            socket.emit('identity',{entity:player});
            player.currentBombCount = 0;
            players[clientNumber] = player;
        }
        clients[clientNumber++] = socket;


        socket.on('run_up',function(data){
            var player = players[data['id']];
            var currentField = field.getNode(player.x,player.y-1);
            if(currentField && !currentField.containedEntity){
                field.getNode(player.x,player.y).containedEntity = null;
                player.y -= 1;
                field.getNode(player.x,player.y).containedEntity = player;
                broadCast('update',{entity:player});
            }
        });
        socket.on('run_down',function(data){
            var player = players[data['id']];
            var currentField = field.getNode(player.x,player.y+1);
            if(currentField && !currentField.containedEntity){
                field.getNode(player.x,player.y).containedEntity = null;
                player.y += 1;
                field.getNode(player.x,player.y).containedEntity = player;
                broadCast('update',{entity:player});
            }
        });
        socket.on('run_left',function(data){
            var player = players[data['id']];
            var currentField = field.getNode(player.x-1,player.y);
            if(currentField && !currentField.containedEntity){
                field.getNode(player.x,player.y).containedEntity = null;
                player.x -= 1;
                field.getNode(player.x,player.y).containedEntity = player;
                broadCast('update',{entity:player});
            }
        });
        socket.on('run_right',function(data){
            var player = players[data['id']];
            var currentField = field.getNode(player.x+1,player.y);
            if(currentField && !currentField.containedEntity){
                field.getNode(player.x,player.y).containedEntity = null;
                player.x += 1;
                field.getNode(player.x,player.y).containedEntity = player;
                broadCast('update',{entity:player});
            }
        });
        socket.on('drop_bomb',function(data){
            var player = players[data['id']];
            if(player.currentBombCount < maxBombCount) {
                player.currentBombCount++;
                var bomb = entityFactory.entity(player.x, player.y, bombId++, 'bomb');
                bombs.push(bomb.id);
                broadCast('bomb_placed',bomb);
                setTimeout(function(){
                    broadCast('show_flame',{id:bomb.id});
                },2500);
                setTimeout(function(){
                    /*TODO: prüfe wenn explosion bombe trifft dann erneute explosion ausführen*/
                    var objects = [];
                    var died_players = [];
                    for(var i = bomb.x-bombRadius; i < bombRadius+bomb.x; i++) {
                        var currField = field.getNode(i,bomb.y);
                        if(currField && currField.containedEntity) {
                            if(currField.containedEntity.type === 'player'){
                                died_players.push(objects);
                            } else {
                                objects.push(currField.containedEntity);
                            }
                            currField.containedEntity = null;
                        }
                    }
                    for(var j = bomb.y-bombRadius; j < bombRadius+bomb.y; i++) {
                        var currField = field.getNode(bomb.x,j);
                        if(currField && currField.containedEntity) {
                            if(currField.containedEntity.type === 'player'){
                                died_players.push(objects);
                            } else {
                                objects.push(currField.containedEntity);
                            }
                            currField.containedEntity = null;
                        }
                    }

                    player.currentBombCount--;
                    broadCast('bomb_explode',{id:bomb.id});
                    broadCast('player_died',{players:died_players});
                    broadCast('delete_entities',{delete_array:objects});
                },3000);
            }
        });
    } else {
        console.log('Game full..');
    }
});

