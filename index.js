module.exports = require('./lib/express-handlebars');
exports.version = JSON.parse(require('fs').readFileSync(__dirname + '/package.json')).version;
