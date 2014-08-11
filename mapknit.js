
require.config({
    paths: {
        'peerjs' : 'bower_components/peerjs/peer'
    }
});

require(['ImageUtils', 'CCServ', 'peerjs', 'shims'], function(ImageUtils, CCServ) {

    var ATTRIBUTE_NAME = 'data-src';

    function getLoadCandidates(tag) {
        var imageElements = document.getElementsByTagName(tag);
        var loadCandidates = [];
        for (var i = 0; i < imageElements.length; i++) {
            if (imageElements[i].getAttribute(ATTRIBUTE_NAME) !== null) {
                loadCandidates.push({
                    el : imageElements[i],
                    src : imageElements[i].getAttribute(ATTRIBUTE_NAME);
                });
            }
        }
        return loadCandidates;
    }

    var iu = new ImageUtils();
    var cc = new CCServ();

    var imageCandidates = getImageCandidates('img');

    for (var i = 0; i < imageCandidates.length; i++) {
        cc.getResourcePeers(imageCandidates[i].src)
            .then(function(candidates) {
                console.log(candidates);
                if (candidates.length == 0) {
                    // fall back to regular loading
                    imageCandidates[i].el.src = imageCandidates[i].src;
                }
            });
    }

});