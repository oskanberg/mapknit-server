require.config({
    paths: {
        'peerjs': 'bower_components/peerjs/peer'
    }
});

require(['ImageUtils', 'CCServer', 'Util', 'peerjs', 'shims'], function(ImageUtils, CCServ, Util) {

    var ATTRIBUTE_NAME = 'data-src';

    var iu = new ImageUtils();
    var cc = new CCServ();

    function getLoadCandidates(tag) {
        var imageElements = document.getElementsByTagName(tag);
        var loadCandidates = [];
        for (var i = 0; i < imageElements.length; i++) {
            if (imageElements[i].getAttribute(ATTRIBUTE_NAME) !== null) {
                loadCandidates.push({
                    el: imageElements[i],
                    src: imageElements[i].getAttribute(ATTRIBUTE_NAME)
                });
            }
        }
        return loadCandidates;
    }

    var imageCandidates = getLoadCandidates('img');

    for (var i = 0; i < imageCandidates.length; i++) {
        var ic = imageCandidates[i];
        cc.getResourcePeers(ic.src)
            .then(function(candidates) {
                // console.log(candidates);
                if (candidates.length == 0) {
                    // fall back to regular loading
                    console.log(ic);
                    ic.el.src = ic.src;
                }
            });
    }

});
