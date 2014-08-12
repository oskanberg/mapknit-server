define(['Util'], function(Util) {

    function CCServer() {

        // function async(fn) {
        //     setTimeout(function() {
        //         fn();
        //     }, 0);
        // }

        var self = this;
        self.ws = new WebSocket('ws://localhost:1123');
        self.ws.onerror = function() {
            Util.debug('aw shite, error', 'error');
        };
        self.ws.onclose = function() {
            Util.debug('close :(', 'error');
        };
        self.connected = new Promise(function(resolve, reject) {
            self.ws.onopen = function() {
                Util.debug('connected to server', 'log');
                resolve();
            };
        });

        self.messageRegister = {};
        self.ws.onmessage = function(event) {
            Util.debug('got message from server', 'log');
            var msg = JSON.parse(event.data);
            var subs = self.messageRegister[msg.type];
            console.log(typeof subs[0]);
            for (var i = 0; i < subs.length; i++) {
                // async(function() {
                    subs[i](msg);
                // });
            }
        };
    }


    CCServer.prototype.getResourcePeersXMLHTTP = function(url) {
        var self = this;
        // TODO
        Util.debug('not yet implemented', 'log');
        return;
        self.connected.then(function() {
            var promise = new Promise(function(resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
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
        });
    };

    CCServer.prototype.getResourcePeers = function(url) {
        var self = this;
        var promise = new Promise(function(resolve, reject) {
            self.connected.then(function() {
                var uuid = self._uuid();
                var msg = {
                    type: 'peerrequest',
                    requestId: uuid,
                    resourceId: btoa(url)
                };

                // register for response
                self._oneTimeSubscribe('peerresponse', function(message) {
                    if (message.requestId == uuid) {
                        Util.debug('got peers', 'log');
                        resolve(message.peers);
                    } else {
                        Util.debug(':o(', 'log');
                    }
                });
                self.ws.send(JSON.stringify(msg));
            });
        });
        return promise;
    };

    CCServer.prototype._uuid = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16);
    };

    CCServer.prototype._oneTimeSubscribe = function(type, fn) {
        var self = this;
        self.messageRegister[type] = self.messageRegister[type] || [];
        self.messageRegister[type].push(fn);
    };

    return CCServer;
});
