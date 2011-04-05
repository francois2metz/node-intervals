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
    sequence = intervals.addTime(options, intervals.createClient(token));
    sequence.then(function(next, err, res, time, client) {
        if (err) throw err;
        if (res.status != 201) throw res.body;
        console.log('Success! Time added.');

        // Let's do the other dates too.
        for (; dates.length != 0; ) {
          time.date = dates.shift();
          console.log('Add '+ time.hours + ' ' +
                      (time.billable ? 'billable' : 'non billable') +
                      ' hours for '+ time.date);
          client.add_time(JSON.stringify(time), function (err, res) {
            if (err) throw err;
            if (res.status != 201) throw res.body;
            console.log('Success! Time added.');
          });
        }
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
