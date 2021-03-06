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
    var fieldSize = 11;

    var a = (fieldSize - 1) / 2
    var obstaclesToPlace = Math.floor((fieldSize * fieldSize - a * a - 12) / 2);

    var finalBombCount = 6;
    var finalBlastRadius = 4;
    var maxPlayers = 4;
    var bombId = 0;
    var bombs = [];


    var field = require('./graph/Field').Field(fieldSize, fieldSize);
    field.connect();
    generator.generate(field, obstaclesToPlace);

    var entityFactory = require('./entity/Entity');

    var app = express.createServer();
    app.use(express.static(__dirname));
    app.listen(port);

    var socketConnection = socketio.listen(app);
    socketConnection.configure(function () {
        socketConnection.set('log level', 0);
    });

    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/Client/index.html');
    });

    app.get('/start', function (req, res) {
        res.sendfile(__dirname + '/Client/Client.html');
    });

    var clients = [];
    var clientNumber = 0;
    var players = [];

    function broadcast(command, data) {
        for (var i = 0; i < clients.length; i++)
            clients[i].emit(command, data);
    }

    function placePlayer(x, y, socket) {
        var player = entityFactory.entity(x, y, clientNumber, "player");
        field.getNode(x, y).containedEntity = player;
        player.currentBombCount = 0;
        player.maxBombCount = 1;
        player.blastRadius = 1;
        player.isAlive = true;
        players[clientNumber] = player;
        socket.emit('identity', {entity:player});
        broadcast('players', {players:players});
    }

    socketConnection.sockets.on('connection', function (socket) {
        if (clientNumber < maxPlayers) {
            clients[clientNumber] = socket;
            switch (clientNumber) {
                case 0 :
                    placePlayer(0, 0, socket);
                    break;
                case 1 :
                    placePlayer(field.width - 1, field.height - 1, socket);
                    break;
                case 2 :
                    placePlayer(field.width - 1, 0, socket);
                    break;
                case 3 :
                    placePlayer(0, field.height - 1, socket);
                    break;
                default :
                    return;
            }
            clientNumber++;
            socket.emit('graph', {graph:field});

            function runTo(xDir, yDir, data) {
                var player = players[data['id']];
                if (player.isAlive) {
                    function movePlayer(xDir, yDir) {
                        if (field.getNode(player.x, player.y).containedEntity && field.getNode(player.x, player.y).containedEntity.type != 'bomb')
                            field.getNode(player.x, player.y).containedEntity = null;
                        player.x += xDir;
                        player.y += yDir;
                        field.getNode(player.x, player.y).containedEntity = player;
                        broadcast('update', {entity:player});
                    }

                    var currentField = field.getNode(player.x + xDir, player.y + yDir);
                    if (currentField)
                        if (!currentField.containedEntity) {
                            movePlayer(xDir, yDir);
                        }
                        else if (currentField.containedEntity.type.indexOf('power') == 0) {
                            if (currentField.containedEntity.type === 'powerup_bomb' && player.maxBombCount < finalBombCount)
                                player.maxBombCount++;
                            else if (currentField.containedEntity.type === 'powerup_fire' && player.blastRadius < finalBlastRadius)
                                player.blastRadius++;

                            broadcast('delete_entities', {delete_array:[currentField.containedEntity]});
                            movePlayer(xDir, yDir);
                        }
                }
            }

            socket.on('run_up', function (data) {
                runTo(0, -1, data);
            });
            socket.on('run_down', function (data) {
                runTo(0, 1, data);
            });
            socket.on('run_left', function (data) {
                runTo(-1, 0, data);
            });
            socket.on('run_right', function (data) {
                runTo(1, 0, data);
            });

            socket.on('drop_bomb', function (data) {
                var player = players[data['id']];
                if (!player.isAlive) {
                    return;
                }
                if (player.currentBombCount < player.maxBombCount) {
                    player.currentBombCount++;
                    var bomb = entityFactory.entity(player.x, player.y, bombId++, 'bomb');
                    field.getNode(player.x, player.y).containedEntity = bomb;
                    bombs.push(bomb.id);
                    broadcast('bomb_placed', {bomb:bomb});

                    setTimeout(function () {
                        broadcast('show_flame', {bomb:bomb});
                    }, 2000);

                    setTimeout(function () {
                        var bombIndex = -1;
                        for (var searchIndex = 0; i < bombs.length; searchIndex++) {
                            if (bombs[searchIndex].id == bomb.id) {
                                bombIndex = searchIndex;
                                break;
                            }
                        }
                        if (bombIndex > -1)
                            utils.remove(bombs, bombIndex);

                        var objects = [];
                        var died_players = [];
                        var powerups = [];
                        var dropRate = 0.4;

                        function blastTo(xDir, yDir) {
                            var currField = field.getNode(xDir, yDir);
                            if (currField) {
                                if (currField.containedEntity) {
                                    if (currField.containedEntity.type == 'player') {
                                        currField.containedEntity.isAlive = false;
                                        broadcast('update', {entity:player});
                                        died_players.push(currField.containedEntity);
                                        currField.containedEntity = null;
                                    }
                                    else {
                                        var currEntity = currField.containedEntity;
                                        currField.containedEntity = null;
                                        if (currEntity.type === 'obstacle' && Math.random() <= dropRate) {
                                            var powerup;
                                            if (Math.random() <= 0.5)
                                                powerup = entityFactory.entity(xDir, yDir, -1, 'powerup_bomb');
                                            else
                                                powerup = entityFactory.entity(xDir, yDir, -1, 'powerup_fire');
                                            powerups.push(powerup);
                                            currField.containedEntity = powerup;
                                        }
                                        objects.push(currEntity);
                                    }
                                    return false;
                                }
                                else
                                    return true;
                            } else
                                return false;
                        }

                        //delete bomb at location
                        field.getNode(bomb.x, bomb.y).containedEntity = null;
                        for (var i = bomb.x; i >= bomb.x - player.blastRadius; i--) {
                            if (!blastTo(i, bomb.y))
                                break;
                        }
                        for (var i = bomb.x; i <= bomb.x + player.blastRadius; i++) {
                            if (!blastTo(i, bomb.y))
                                break;
                        }
                        for (var j = bomb.y; j >= bomb.y - player.blastRadius; j--) {
                            if (!blastTo(bomb.x, j))
                                break;
                        }
                        for (var j = bomb.y; j <= bomb.y + player.blastRadius; j++) {
                            if (!blastTo(bomb.x, j))
                                break;
                        }

                        player.currentBombCount--;
                        broadcast('bomb_explode', {bomb:bomb});
                        if (died_players.length > 0)
                            broadcast('players_died', {players:died_players});


                        broadcast('delete_entities', {delete_array:objects});
                        broadcast('powerups', {powerups:powerups});

                        /*Test if there are alive Player*/
                        var deadPlayerCount = 0;
                        for (var i = 0; i < players.length; i++) {
                            if (!players[i].isAlive) {
                                deadPlayerCount++;
                            }
                        }
                        if (deadPlayerCount + 1 == players.length || deadPlayerCount == players.length) {


                            /*Game over restart new one*/
                            broadcast('game_over');
                            field = require('./graph/Field').Field(fieldSize, fieldSize);
                            field.connect();
                            generator.generate(field, obstaclesToPlace);

                            function resetPlayerStateAndPosition(id, xpos, ypos) {
                                players[id].x = xpos;
                                players[id].y = ypos;
                                players[id].isAlive = true;
                                players[id].maxBombCount = 1;
                                players[id].blastRadius = 1;
                                field.getNode(xpos, ypos).containedEntity = players[id];
                                clients[id].emit('identity', {entity:players[id]});
                                clients[id].emit('graph', {graph:field});
                            }

                            for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
                                switch (playerIndex) {
                                    case 0:
                                        resetPlayerStateAndPosition(players[playerIndex].id, 0, 0);
                                        break;
                                    case 1:
                                        resetPlayerStateAndPosition(players[playerIndex].id, field.width - 1, field.height - 1);
                                        break;
                                    case 2:
                                        resetPlayerStateAndPosition(players[playerIndex].id, field.width - 1, 0);
                                        break;
                                    case 3:
                                        resetPlayerStateAndPosition(players[playerIndex].id, 0, field.height - 1);
                                        break;
                                    default:
                                        break;
                                }
                            }

                            broadcast('players', {players:players});
                        }
                    }, 2500);
                }
            });
        } else {
            console.log('Game full..');
        }
    });

}

module.exports.startServer = startServer;

