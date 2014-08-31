module.exports = {
    start: startCCServer
};

function startCCServer(port) {
    console.log('Starting CC server on port ' + port);
    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({
        port: 1123
    });

    var rd = new ResourceDict();
    var connections = [];
    wss.on('connection', function(ws) {
        console.log('peer connected');
        connections.push(new ConnectionHandler(ws, rd));
    });
}


function ConnectionHandler(ws, rd) {
    this.ws = ws;
    this.resourceDict = rd;
    this.peerId;
    ws.on('message', this.handleMessage.bind(this));
    ws.on('close', this.handleClose.bind(this));
}

ConnectionHandler.prototype.handleMessage = function(message) {
    var self = this;
    message = JSON.parse(message);
    // should always have peerId in meta
    if (!this.peerId) this.peerId = message.meta.peerId;
    var reply = {
        requestId: message.requestId
    };
    switch (message.type) {
        case 'peerrequest':
            console.log('got a peerrequest');
            reply.type = 'peerresponse';
            reply.peers = self.resourceDict.getPeers(message.resourceId);
            self.ws.send(JSON.stringify(reply));
            break;
        case 'resourceregister':
            self.registerResource(this.peerId, message.resourceId);
            console.log('registered resource');
            break;
        default:
            break;
    }
};

ConnectionHandler.prototype.registerResource = function(peerId, resourceId) {
    this.resourceDict.add(peerId, resourceId);
};

ConnectionHandler.prototype.handleClose = function(reasonCode, description) {
    if (this.peerId) {
        this.resourceDict.removePeer(this.peerId);
    }
    // otherwise (hopefully) nothing is registered
};

function ResourceDict() {
    this.byPeer = {};
    this.byResource = {};
}

ResourceDict.prototype.add = function(peer, resource) {
    this.byResource[resource] = this.byResource[resource] || {};
    this.byResource[resource][peer] = true;

    this.byPeer[peer] = this.byPeer[peer] || {};
    this.byPeer[peer][resource] = true;
};

ResourceDict.prototype.getPeers = function(resource) {
    return Object.keys(this.byResource[resource] || {});
};

ResourceDict.prototype.getResources = function(peer) {
    return Object.keys(this.byPeer[peer] || {});
};

ResourceDict.prototype.removePeer = function(peer) {
    var resources = Object.keys(this.byPeer[peer] || {});
    for (var i = 0; i < resources.length; i++) {
        delete this.byResource[resources[i]][peer];
    }
    delete this.byPeer[peer];
};
