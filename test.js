
sys = require('util');
var http;
http = require('http');

sys.puts('server Starting');

http.createServer(function (req, res) {
    setTimeout(function () {
        sys.puts('Hello called');
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end("startServer");
    }, 2000);
}).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');

/*TEST*/

