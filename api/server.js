const path = require('path');
const serverPath = path.join(__dirname, '..', 'server', 'index.js');
module.exports = require(serverPath);