var intervals = require('./intervals')
  , dateFormat = require('dateformat')
  , Table = require('cli-table')
;

module.exports = function(conf, opts) {
    var end = opts.end || dateFormat(new Date(), 'yyyy-mm-dd');
    var start = opts.start || dateFormat(new Date(), 'yyyy-mm-dd');
    console.log("Show timesheet from %s to %s", start, end);
    var client = intervals.createClient(conf.token);
    client.time({datebegin: start,
                 dateend: end}, function(err, response) {
                     showTime(response.body);
                 });

}

function showTime(body) {
    // instantiate
    var table = new Table({
        head: ['Project', 'date', 'hours', 'billable']
      , colWidths: [40, 12, 7, 10]
    });

    body.time.forEach(function(time) {
        table.push([time.project, time.dateiso, time.time, (time.billable == 'f' ? 'no' : 'yes')])
    });
    console.log(table.toString());
}
