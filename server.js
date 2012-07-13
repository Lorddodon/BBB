/**
 * Created with JetBrains WebStorm.
 * User: ralsicher
 * Date: 11.07.12
 * Time: 11:43
 */

startServer(8000);

function startServer(port) {
var http = require('http');
var socketio = require('socket.io');
var express = require('express');
var utils = require('util');
var generator = require('./graph/Generator');

maxBombCount = 2;
bombRadius = 3;
bombId = 0;
bombs = [];


var field = require('./graph/Field').Field(9,9);
field.connect();
generator.generate(field, 25);

var entityFactory = require('./entity/Entity');

var playerCount = 0;

var app = express.createServer();
app.use(express.static(__dirname));
app.listen(port);

var socketconnection = socketio.listen(app);


app.get('/', function(req, res){
    /*TODO: fürs erste sollte es reichen das man ein spiel eröffnet und die spielen dort zuweist..*/
    res.sendfile(__dirname + '/Client/index.html');
});

app.get('/start', function(req, res){
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
        socket.emit('graph',{graph:field});
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
                broadCast('bomb_placed',{bomb:bomb});
                setTimeout(function(){
                    broadCast('show_flame',{bomb:bomb});
                },2000);
                setTimeout(function(){
                    /*TODO: prüfe welche objekte gelöscht werden müssen*/
                    var bombIndex = -1;
                    for (var searchIndex = 0; i < bombs.length; searchIndex++) {
                        if(bombs[searchIndex].id == bomb.id){
                            bombIndex = searchIndex;
                            break;
                        }
                    }
                    if(bombIndex > -1)
                        utils.remove(bombs,bombIndex);

                    var objects = [];
                    var died_players = [];
                    var powerups = [];
                    var droprate = 0.2;

                    for(var i = bomb.x; i >= bomb.x-bombRadius; i--) {
                        var currField = field.getNode(i,bomb.y);
                        if(currField ) {
                            if (currField.containedEntity) {
                                if(currField.containedEntity.type == 'player') {
                                    died_players.push(currField.containedEntity);
                                    currField.containedEntity = null;
                                }
                                else {
                                    var currEntity = currField.containedEntity;
                                    currField.containedEntity = null;
                                    if(currField.containedEntity.type == 'obstacle' && Math.random() <= droprate) {
                                        var powerup;
                                        if(Math.random() <= 0.5)
                                            powerup = entityFactory.entity(i, bomb.y, -1, 'powerup_bomb');
                                        else
                                            powerup = entityFactory.entity(i, bomb.y, -1, 'powerup_fire');
                                        powerups.push(powerup);
                                        currField.containedEntity = powerup;
                                    }
                                    objects.push(currEntity);

                                }
                                break;
                            }
                        } else
                            break;
                    }
                    for(var i = bomb.x; i <= bomb.x+bombRadius; i++) {
                        var currField = field.getNode(i,bomb.y);
                        if(currField ) {
                            if (currField.containedEntity) {
                                if(currField.containedEntity.type == 'player') {
                                    died_players.push(currField.containedEntity);
                                    currField.containedEntity = null;
                                }
                                else {
                                    var currEntity = currField.containedEntity;
                                    currField.containedEntity = null;
                                    if(currField.containedEntity.type == 'obstacle' && Math.random() <= droprate) {
                                        var powerup;
                                        if(Math.random() <= 0.5)
                                            powerup = entityFactory.entity(i, bomb.y, -1, 'powerup_bomb');
                                        else
                                            powerup = entityFactory.entity(i, bomb.y, -1, 'powerup_fire');
                                        powerups.push(powerup);
                                        currField.containedEntity = powerup;
                                    }
                                    objects.push(currEntity);

                                }
                                break;
                            }
                        } else
                            break;
                    }
                    for(var j = bomb.y; j >= bomb.y-bombRadius; j--) {
                        var currField = field.getNode(bomb.x,j);
                        if(currField) {
                            if (currField.containedEntity) {
                                if(currField.containedEntity.type == 'player') {
                                    died_players.push(currField.containedEntity);
                                    currField.containedEntity = null;
                                }
                                else {
                                    var currEntity = currField.containedEntity;
                                    currField.containedEntity = null;
                                    if(currField.containedEntity.type == 'obstacle' && Math.random() <= droprate) {
                                        var powerup;
                                        if(Math.random() <= 0.5)
                                            powerup = entityFactory.entity(bomb.x, j, -1, 'powerup_bomb');
                                        else
                                            powerup = entityFactory.entity(bomb.x, j, -1, 'powerup_fire');
                                        powerups.push(powerup);
                                        currField.containedEntity = powerup;
                                    }
                                    objects.push(currEntity);

                                }
                                break;
                            }
                        } else
                            break;
                    }
                    for(var j = bomb.y; j <= bomb.y+bombRadius; j++) {
                        var currField = field.getNode(bomb.x,j);
                        if(currField) {
                            if (currField.containedEntity) {
                                if(currField.containedEntity.type == 'player') {
                                    died_players.push(currField.containedEntity);
                                    currField.containedEntity = null;
                                }
                                else {
                                    var currEntity = currField.containedEntity;
                                    currField.containedEntity = null;
                                    if(currField.containedEntity.type == 'obstacle' && Math.random() <= droprate) {
                                        var powerup;
                                        if(Math.random() <= 0.5)
                                            powerup = entityFactory.entity(bomb.x, j, -1, 'powerup_bomb');
                                        else
                                            powerup = entityFactory.entity(bomb.x, j, -1, 'powerup_fire');
                                        powerups.push(powerup);
                                        currField.containedEntity = powerup;
                                    }
                                    objects.push(currEntity);

                                }
                                break;
                            }
                        } else
                            break;
                    }

                    player.currentBombCount--;
                    broadCast('bomb_explode',{bomb:bomb});
                    if(died_players.length > 0)
                        broadCast('players_died',{players:died_players});
                    broadCast('delete_entities',{delete_array:objects});
                },2500);
            }
        });
    } else {
        console.log('Game full..');
    }
});

}

module.exports.startServer = startServer;

