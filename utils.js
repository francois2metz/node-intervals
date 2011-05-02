var spawn = require('child_process').spawn
  , stdio = process.binding("stdio")
;

/**
 * Some of this code was stolen from npm.
 * https://github.com/isaacs/npm/blob/master/lib/utils/exec.js
 */
exports.exec = function exec (cmd, args, env, cb) {
    var fds = [ stdio.stdinFD || 0
              , stdio.stdoutFD || 1
              , stdio.stderrFD || 2 ]
    ;
    spawn(cmd, args, {
        env: env,
        customFds: fds,
        cwd: __dirname}).on("exit", cb);
}

exports.pipe = function(cmd, args) {
    return  spawn(cmd, args, {customFds: [-1,
                                          stdio.stdoutFD,
                                          stdio.stderrFD]});
}
