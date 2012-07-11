/**
 * Created with JetBrains WebStorm.
 * User: ralsicher
 * Date: 11.07.12
 * Time: 11:43
 */
var http = require('http');
var socketio = require('socket.io');
var express = require('express');

var app = express.createServer();
app.use(express.static(__dirname));
app.listen(8000);

var temp = socketio.listen(app);

/*TODO: wenn index.html aufgerufen werden soll lobby zeigen ...*/
app.get('/', function(req, res){
    res.sendfile(__dirname + '/Client/Client.html');
});

process.on('uncaughtException', function(err){console.log(err)});
