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

var socketconnection = socketio.listen(app);

/*TODO: wenn index.html aufgerufen werden soll lobby zeigen ...*/
app.get('/', function(req, res){
    /*TODO: fürs erste sollte es reichen das man ein spiel eröffnet und die spielen dort zuweist..*/
    res.sendfile(__dirname + '/Client/Client.html');
});

socketconnection.sockets.on('run_up',function(socket){
    console.log('running up...');
    /*TODO: prüfe ob nach oben gelaufen werden darf, wenn ja Spieler ein Feld nach oben setzen und den clients bescheid sagen...*/
});

/*TODO: auf client-anfragen reagieren ...*/