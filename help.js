var spawn = require('child_process').spawn
;
/**
 * Some of this code was stolen from npm.
 * https://github.com/isaacs/npm/blob/master/lib/utils/exec.js
 */
function exec (cmd, args, env, cb) {
  var stdio = process.binding("stdio")
    , fds = [ stdio.stdinFD || 0
            , stdio.stdoutFD || 1
            , stdio.stderrFD || 2 ]
    spawn(cmd, args, {
        env: env,
        customFds: fds,
        cwd: __dirname}).on("exit", cb);
}

module.exports = function() {
    var manpath = '.'
      , env = {};
    Object.keys(process.env).forEach(function (i) { env[i] = process.env[i] });
    env.MANPATH = manpath;
    exec("man", ['intervals'], env, function(code) {
        if (code) throw code;
    });
};
