/**
 * Created with JetBrains WebStorm.
 * User: ralsicher
 * Date: 11.07.12
 * Time: 11:43
 */
//var io = require('socket.io').listen(8000);
var http = require('http');
var socketio = require('socket.io');
var express = require('express');
var program = require('commander');

var app = express.createServer();
app.use(express.static(__dirname));
app.listen(8000);

var temp = socketio.listen(app);

app.get('/', function(req, res){
    res.sendfile(__dirname + '/Client/Client.html');
});

process.on('uncaughtException', function(err){console.log(err)});

/*fs.readFile('./Client/Client.html', function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(8080);
});
*/

/*io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});*/
/*
var socketio = require('socket.io'),
    express = require('express'),
    program = require('commander'),
    fs = require('fs');

program
    .version('0.0.1')
    .option('-R, --no-rand', 'disable random selection of tiles')
    .option('-p, --port <port>', 'specify the port [8888]', Number, 8888)
    .parse(process.argv);

var app = express.createServer(express.logger(), express.bodyParser());
app.use(express.static(__dirname));
app.listen(program.port);

var websocket = socketio.listen(app);
websocket.set('log level', 0);
console.log("Express/socket.io Server running at " + program.port);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/Client/Client.html');
    console.log("Request answered with index.html");
});
*/