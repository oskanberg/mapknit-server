
define(function () {

    function CCServer() {

        function async(fn) {
            setTimeout(function() {
                fn();
            }, 0);
        }

        var self = this;
        self.ws = new WebSocket('ws://localhost:1123', 'rp0');
        self.ws.onopen = function () {
            self.isOpen = true;
        };
        self.messageRegister = {};
        self.onmessage = function (event) {
            var msg = JSON.parse(event.data);
            var subs = messageRegister[msg.type];
            for (var i = 0; i < subs; i++) {
                async(function() {
                    subs[i](msg);
                });
            }
        }
    }

    CCServer.prototype._uuid() = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
        + '-' +(((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    CCServer.prototype.getResourcePeers = function(url) {
        var self = this;
        var uuid = self._uuid();
        var msg = {
            type : 'peerrequest',
            requestId : uuid,
            resourceId : atob(url)
        };
        var promise = new Promise(function (resolve, reject) {
            this.messageRegister['peerresponse'].push(function (message) {
                if (message.requestId == uuid) {
                    resolve(message.peers);
                }
            });
        });
        this.ws.send(JSON.stringify(msg));
    }

    CCServer.prototype.getResourcePeersXMLHTTP = function(url) {
        var self = this;
        // TODO
        if (!self.isOpen) return;
        var promise = new Promise(function(resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readystate == 4) {
                    if (xmlhttp.status == 200) {
                        response = JSON.parse(xmlhttp.responseText);
                        resolve(response.peers);
                    } else {
                        // TODO : fail gracefully
                        reject(Error(':( could not get resource peers'));
                    }
                }
            };
            var url = self.CC_SERV + '/rp/' + btoa(url);
            xmlhttp.open('GET', url, true);
        });
        return promise;
    };

    CCServer.prototype.getResourcePeers = function(url) {
        var self = this;
        var uuid = self._uuid();
        var msg = {
            type : 'peerrequest',
            requestId : uuid,
            resourceId : atob(url)
        };
        var promise = new Promise(function (resolve, reject) {
            this.messageRegister['peerresponse'].push(function (message) {
                if (message.requestId == uuid) {
                    resolve(message.peers);
                }
            });
        });
        this.ws.send(JSON.stringify(msg));
    }

    return CCServer;
});
