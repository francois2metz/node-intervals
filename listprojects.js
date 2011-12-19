var intervals = require('./intervals')
  , Table = require('cli-table')
  , utils = require('./utils')
;

function get_params(optional_params, opts) {
    var params = {};
    for (var opt in opts) {
        if (optional_params.indexOf(opt) != -1) {
            var value = opts[opt];
            if (value === true || value == 'true') value = true;
            if (value === false || value == 'false') value = false;
            params[opt] = value;
        }
    }
    return params;
}

module.exports = function(conf, opts) {
    console.log("Show projects");
    var client = intervals.createClient(conf.token);
    var params = get_params(client.spec.methods.project.optional_params, opts);
    client.project(params, function(err, response) {
        if (err) throw err;
        showProjects(response.body);
    });
}

function showProjects(body) {
    // instantiate
    var table = new Table({
        head: ['id', 'name', 'client', 'date', 'billable']
      , colWidths: [10, 42, 20, 12, 10]
    });
    var content = [];
    content.push("id,name,client,date,billable");
    body.project.forEach(function(project) {
        table.push([project.localidunpadded || "", project.name || "", project.client || "", project.datestart || "", (project.billable == 'f' ? 'no' : 'yes')])
        content.push([project.localidunpadded || "", project.name || "", project.client || "", project.datestart || "", (project.billable == 'f' ? 'no' : 'yes')].join(","))
    });
    console.log(table.toString());
    var fs = require('fs');
    fs.writeFile('projects.csv', content.join("\n"), function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });
    console.log(body.project.length, "projects");
}
