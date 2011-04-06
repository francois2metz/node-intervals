#!/usr/bin/env node
var dateFormat = require('dateformat')
  , argv = require('optimist').boolean(['billable', 'b'])
                              .default('date', dateFormat(new Date(), 'yyyy-mm-dd'))
                              .default('hours', 8)
                              .default('description', '')
                              .argv
  , config = require('../config')
  , intervals = require('../intervals')
;

function processTime(token) {
    var date     = argv.date,
        dates    = (Array.isArray(date)) ? date : [date],
        options  = { time: argv.hours,
                     date: dates.shift(),
                     billable: argv.billable || argv.b,
                     description: argv.description },
        sequence = null;

    console.log('Add '+ options.time + ' ' +
                (options.billable ? 'billable' : 'non billable') +
                ' hours for '+ options.date);
    var client = intervals.createClient(token);
    sequence = intervals.askForProject(client);
    sequence.then(function(next, project) {
        intervals.addTime(project, options, client, function(err, res) {
            if (err) throw err;
            if (res.status != 201) throw res.body;
            console.log('Success! Time added.');
        });
        // Let's do the other dates too.
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
        next();
    });
}

config.read(function(err, value) {
    if (err) {
        if (err.code == 'ENOENT') {
            process.stdout.write('Please enter your token (go to https://xx.timetask.com/account/api/ and generate a new one): ');
            intervals.readInput(function(input) {
                config.write({token: input}, function(err) {
                    if (err) throw err;
                    console.log('token saved in '+ config.path);
                    processTime(input);
                });
            });
        }
    } else {
        processTime(value.token);
    }
});
