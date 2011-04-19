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

function toYamlArray(data) {
    var result = "";
    data.forEach(function(d) {
        result += "  -\n";
        result += toYaml(d, '    ');
    });
    return result;
}

function toYamlPrimitive(v) {
    if (!isNaN(v)) {
        return v;
    }
    return "'"+ v +"'";
}

var toYaml = exports.toYaml = function(data, indent) {
    var result = "";
    var before = indent || '';
    for (var key in data) {
        result += before + key + ":";
        if (Array.isArray(data[key])) {
            result += "\n";
            result += toYamlArray(data[key]);
        } else if (!data[key].substr && !data[key].toFixed) {
            result += "\n";
            result += toYaml(data[key], '      ');
        } else {
            result += " "+ toYamlPrimitive(data[key]) +"\n";
        }
    }
    return result;
}

exports.write = function(data, callback) {
    var content = toYaml(data);
    fs.writeFile(path(), content, callback);
}
