
module.exports = {
    start: startPeerServer
}

function startPeerServer(port) {
    console.log('Starting peer server on port ' + port);
    var PeerServer = require('peer').PeerServer;
    var server = new PeerServer({
        port: port,
        path: '/peer'
    });

    server.on('connection', function(id) {
        console.log('new id ' + id);
    });
}