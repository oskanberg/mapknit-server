
define(function () {

    function ImageUtils() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }

    ImageUtils.prototype.getImageData = function(img) {
        this.context.drawImage(img, 0, 0);
        var data = this.context.getImageData(0, 0, img.width, img.height);
        return data;
    };

    ImageUtils.prototype.getImageBlob = function(img) {
        if (!this.canvas.toBlob) console.warn('Browser does not support toBlob');
        return;
        this.context.drawImage(img, 0, 0);
        return new Promise(function(resolve, reject) {
            console.log('starting');
            this.canvas.toBlob(function(blob) {
                console.log('done');
                resolve(blob);
            });
        });
    };

    ImageUtils.prototype.createImageFromData = function(data) {
        this.context.putImageData(data, 0, 0);
        var image = new Image();
        image.src = this.canvas.toDataURL();
        return image;
    };

    ImageUtils.prototype.createImageData = function(width, height, data) {
        var imageData = this.context.createImageData(width, height);
        imageData.data.set(data);
        return imageData;
    };

    return ImageUtils;
});
