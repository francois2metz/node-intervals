var spawn = require('child_process').spawn
  , stdio = process.binding("stdio")
;

require('./date');

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
    return spawn(cmd, args, {customFds: [-1,
                                         stdio.stdoutFD,
                                         stdio.stderrFD]});
}

/**
 * Read stdin
 */
exports.readInput = function(callback) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (chunk) {
        process.stdin.pause(); // pause stdin after input
        process.stdin.removeAllListeners('data');
        process.stdin.removeAllListeners('end');
        callback(chunk.trim());
    });
    process.stdin.on('end', function () {});
}

/**
 * Parse date from user command line
 * Can be an array of date, a range, yesterday ...
 */
exports.parseDate = function(range) {
    if (range.indexOf('..') !== -1) {
        var dates = range.split('..');
        var date1 = Date.parseExact(dates[0], 'yyyy-MM-dd');
        var date2 = Date.parseExact(dates[1], 'yyyy-MM-dd');
        if (Date.compare(date1, date2) == 1) {
            var tmp = date2;
            date2 = date1;
            date1 = tmp;
        }
        var range = [];
        do {
            range.push(date1.toString('yyyy-MM-dd'));
        } while(Date.compare(date1.add({ days: 1}), date2) < 1);
    } else if (Array.isArray(range)) {
        range = range.map(function(d) {
            return Date.parse(d).toString('yyyy-MM-dd');
        });
    } else {
        range = [Date.parse(range).toString('yyyy-MM-dd')];
    }
    return range;
}
