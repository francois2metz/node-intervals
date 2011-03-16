var fs = require('fs')
, yaml = require('yaml')
;

function path() {
    if (process.env.XDG_CONFIG_HOME)
        return process.env.XDG_CONFIG_HOME + '/intervals';
    return process.env.HOME + '/.config/intervals';

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
