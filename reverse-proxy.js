
module.exports = {
    start: startReverseProxy
}

function startReverseProxy(port) {
    console.log('Starting reverse proxy on port ' + port);
    var express = require('express');
    var request = require('request');
    var app = express();
    app.get('*', function(req, res) {
        var newURL = req.url.substring(1, req.url.length);
        try {
            request(newURL).pipe(res);
        } catch(err) {
            console.log(err);
        }
    });
    app.listen(port);
}