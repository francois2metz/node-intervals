#!/usr/bin/env node
var dateFormat = require('dateformat')
  , argv = require('optimist').boolean('billable')
                              .default('date', dateFormat(new Date(), 'yyyy-mm-dd'))
                              .default('hours', 8)
                              .default('description', '')
                              .argv
  , config = require('../config')
  , intervals = require('../intervals')
;

function processTime(token) {
    console.log('add '+ argv.hours  +' hours '+ (argv.billable ? 'billable' : 'non billable') +' for '+ argv.date);
    intervals.addTime({
        time: argv.hours,
        date: argv.date,
        billable: argv.billable,
        description: argv.description
    }, intervals.createClient(token), function(err, res) {
        if (err) throw err;
        if (res.status != 201) throw res.body;
        console.log('Success ! time added');
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
