
require('./peer-server').start(9000);
require('./file-server').start(8080);
require('./reverse-proxy.js').start(1123);