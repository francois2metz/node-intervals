var exec = require('./utils').exec
;

module.exports = function() {
    var manpath = __dirname
      , env = {};
    Object.keys(process.env).forEach(function (i) { env[i] = process.env[i] });
    env.MANPATH = manpath;
    exec("man", ['intervals'], env, function(code) {
        if (code) throw code;
    });
};
