
module.exports = {
    start: startFileServer
};

function startFileServer(port) {
    console.log('Starting file server on port ' + port);
    var express = require('express');
    var fs = require('fs');
    var app = express();

    var enableCORS = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        if ('OPTIONS' === req.method) {
          res.send(200);
        } else {
          next();
        }
    };

    var debug = function(req, res, next) {
        console.log('Serving :: ' + req.url);
        next();
    };

    app.use(debug);
    app.use(enableCORS);
    app.use(express.static(__dirname + '/public'));

    app.listen(port);
}
