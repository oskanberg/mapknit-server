
define([], function() {
    if(typeof Uint8ClampedArray !== 'undefined'){
        //Firefox and Chrome
        Uint8ClampedArray.prototype.slice = Array.prototype.slice;
    } else if(typeof CanvasPixelArray!== 'undefined') {
        //IE10 and IE9
        CanvasPixelArray.prototype.slice = Array.prototype.slice;
    } else {
        // Deprecated browser
        console.warn('You are running a deprecated browser');
    }
});