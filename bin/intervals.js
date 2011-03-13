#!/usr/bin/env node
var argv = require('optimist').boolean('billable')
                              .default('hours', 8)
                              .argv
  , config = require('../config')
  , intervals = require('../intervals')
;

function processTime(token) {
    if (!argv.date) {
        console.log('Usage: intervals --date 2011-03-13 --hours 8 [--billable]');
    } else {
        console.log('add '+ argv.hours  +' hours '+ (argv.billable ? 'billable' : 'non billable') +' for '+ argv.date);
        intervals.addTime({
            time: argv.hours,
            date: argv.date,
            billable: argv.billable
        }, intervals.createClient(token), function(err, res) {
            if (err) throw err;
            if (res.status != 201) throw res.body;
            console.log('Success ! time added');
        });
    }
}

config.read(function(err, value) {
    if (err) {
        if (err.code == 'ENOENT') {
            process.stdout.write('Please enter your token: ');
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
