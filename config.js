var fs = require('fs')
, yaml = require('yaml')
;

function path() {
    return process.env.HOME + '/.intervals';
}
exports.__defineGetter__('path', path);

exports.read = function(callback) {
    fs.readFile(path(), function(err, result) {
        if (err) callback(err);
        else callback(null, yaml.eval(result.toString()));
    });
}

var toYaml = exports.toYaml = function(data) {
    var result = "";
    for (var key in data) {
        result += key + ": '"+ data[key] + "'" +"\n";
    }
    return result;
}

exports.write = function(data, callback) {
    var content = toYaml(data);
    fs.writeFile(path(), content, callback);
}
