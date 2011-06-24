var intervals = require('./intervals')
  , Table = require('cli-table')
  , utils = require('./utils')
;

module.exports = function(conf, opts) {
    var dates = utils.parseDate(opts.date);
    var start = dates[0];
    var end = dates[dates.length - 1];
    console.log("Show timesheet from %s to %s", start, end);
    var client = intervals.createClient(conf.token);
    client.me(function(err, res) {
        if (err) throw err;
        client.time({personid: res.body.personid,
                     datebegin: start,
                     dateend: end}, function(err, response) {
                         showTime(response.body);
                     });
    });

}

function showTime(body) {
    // instantiate
    var table = new Table({
        head: ['Project', 'date', 'hours', 'billable']
      , colWidths: [42, 12, 7, 10]
    });

    body.time.forEach(function(time) {
        table.push([time.project, time.dateiso, time.time, (time.billable == 'f' ? 'no' : 'yes')])
    });
    console.log(table.toString());
}
