define(function() {

    function Util(debug) {
        this.DEBUG = debug;
    }

    Util.prototype.debug = function(message, level) {
        if (this.DEBUG) {
            switch (level) {
                case 'log':
                    console.log(message);
                    break;
                case 'warn':
                    console.warn(message);
                    break;
                case 'error':
                    console.error(message);
                    break;
                case 'dir':
                    console.dir(message);
                    break;
                default:
                    console.log(message);
                    break;
            }
        }
    };

    return new Util(true);
});
