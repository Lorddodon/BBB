/**
 * Created with JetBrains WebStorm.
 * User: ralsicher
 * Date: 11.07.12
 * Time: 11:43
 */
//var io = require('socket.io').listen(8000);
var http = require('http');
var fs = require('fs');
var express = require('express');

var app = express.createServer();
app.use(express.static(__dirname));
app.listen(8000);

app.get('/', function(req, res){
    res.sendfile(__dirname + '/Client/Client.html');
});

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