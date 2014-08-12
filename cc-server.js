module.exports = {
    start: startCCServer
}

function startCCServer(port) {
    console.log('Starting CC server on port ' + port);
    var WebSocketServer = require('ws').Server
    var wss = new WebSocketServer({
        port: 1123
    });

    wss.on('connection', function(ws) {
        console.log('connected');
        ws.on('message', function(message) {
            message = JSON.parse(message);
            var reply = {
                requestId : message.requestId
            };
            switch (message.type) {
                case 'peerrequest':
                    console.log('got a peerrequest');
                    reply.type = 'peerresponse';
                    reply.peers = [];
                    break;
                default:
                    break;
            }
            console.log(JSON.stringify(reply));
            ws.send(JSON.stringify(reply));
        });
    });
}
