#!/usr/bin/env node
var dateFormat = require('dateformat')
  , argv = require('optimist').boolean(['billable', 'b'])
                              .default('date', dateFormat(new Date(), 'yyyy-mm-dd'))
                              .default('hours', 8)
                              .default('description', '')
                              .argv
  , fs = require('fs')
  , futures = require('futures')
  , config = require('../config')
  , intervals = require('../intervals')
;

function addTime(options, client) {
    return function(next, project) {
        var dates = options.dates;
        delete options.dates;
        dates.forEach(function(date) {
            options.date = date;
            console.log('Add '+ options.time + ' ' +
                        (options.billable ? 'billable' : 'non billable') +
                        ' hours for '+ options.date);
            intervals.addTime(project, options, client, function (err, res) {
                if (err) throw err;
                if (res.status != 201) throw res.body;
                console.log('Success! Time added.');
            });
        });
        next(project);
    };
}

function askForToken(callback) {
    config.read(function(err, value) {
        if (err) {
            if (err.code == 'ENOENT') {
                process.stdout.write('Please enter your token (go to https://xx.timetask.com/account/api/ and generate a new one): ');
                intervals.readInput(function(input) {
                    config.write({token: input}, function(err) {
                        if (err) throw err;
                        console.log('token saved in '+ config.path);
                        callback({token: input});
                    });
                });
            } else {
                throw err;
            }
        } else {
            callback(value);
        }
    });
}

/**
 * Ask user to save the project
 */
function askForSave(conf) {
    return function(next, project) {
        process.stdout.write('Do you yant to save this project combinaison: (y/N)');
        intervals.readInput(function(input) {
            if (input == 'y') {
                process.stdout.write('Name of this combinaison: ');
                intervals.readInput(function(input) {
                    conf.projects ? '': conf.projects = [];
                    project.name = input;
                    conf.projects.push(project);
                    config.write(conf, function(err) {
                        if (err) throw err;
                        console.log('ok. You can add time to this combinaison with intervals --project '+ input);
                        next();
                    })
                });
            } else {
                next();
            }
        });
    }
}

/**
 * Extract options from argv
 */
function optionsFrom(argv) {
    var date     = argv.date,
        dates    = (Array.isArray(date)) ? date : [date],
        options  = { time: argv.hours,
                     dates: dates,
                     billable: argv.billable || argv.b,
                     description: argv.description };
    return options;
}

function loadProject(conf, argv) {
    return function(next) {
        for (var i in conf.projects) {
            if (conf.projects[i].name == argv.project) {
                var project = conf.projects[i];
                delete project.name;
                next(project);
            }
        }
    }
}

if (argv.version) {
    console.log("intervals v"+ JSON.parse(fs.readFileSync(__dirname +'/../package.json')).version);
} else if (argv.help) {
    console.log('intervals [--date 2011-03-14] [--date 2011-03-13] [--hours 4] [--billable] [--description "Hello World"]');
    console.log('intervals --version');
    console.log('intervals --help');
} else {
    askForToken(function(conf) {
        var options  = optionsFrom(argv),
            sequence = null;

        console.log('Add '+ options.time + ' ' +
                    (options.billable ? 'billable' : 'non billable') +
                    ' hours for '+ options.dates.join(' and '));
        var client = intervals.createClient(conf.token);
        var sequence = futures.sequence();
        if (argv.project) {
            sequence.then(loadProject(conf, argv))
                    .then(addTime(options, client));
        } else {
            sequence.then(intervals.askForProject(client))
                    .then(addTime(options, client))
                    .then(askForSave(conf));
        }
    });
}
