var fs = require('fs')

module.exports = function() {
    console.log("intervals v"+ JSON.parse(fs.readFileSync(__dirname +'/package.json')).version);
};
