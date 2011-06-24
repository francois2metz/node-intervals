var intervals = require('./intervals')
;

function listTimers(client) {
    console.log("List timers");
    client.me(function(err, res) {
        if (err) throw err;
        client.get_timers({personid: res.body.personid,
                           generaltimers: 't'}, function(err, res) {
            if (err) throw err;
            res.body.timer.forEach(function(timer) {
                if (timer.isrunning == 'f')
                    console.log('Timer %d not running', timer.id);
                else
                    console.log('Timer %d, Time elapsed: %s', timer.id, formatTime(timer.totaltime));
            })
        });
    });
}

function startTimer(client) {
    console.log("Start timer");
    client.me(function(err, res) {
        if (err) throw err;
        client.start_timer(JSON.stringify({personid: res.body.personid}), function(err, res) {
            if (err) throw err;
            console.log("Timer %d created", res.body.timer.id);
        });
    });
}

function formatTime(time) {
    return (parseFloat(time) / 60).toFixed(2) + " minutes";
}

function getTimer(client, opts) {
    var id = opts._[1];
    console.log("Get timer %d", id);
    client.get_timer({id: id}, function(err, res) {
        if (err) throw err;
        console.log('Time elapsed: %s', formatTime(res.body.timer.totaltime));
    });
}

function deleteTimer(client, opts) {
    var id = opts._[1];
    console.log("Deleting timer %d", id);
    client.delete_timer({id: id}, function(err, res) {
        if (err) throw err;
        console.log("Timer deleted");
    });
}

module.exports = function(conf, opts) {
    var client = intervals.createClient(conf.token);

    switch (opts._[0]) {
    case "list-timers":
        listTimers(client);
        break;
    case "start-timer":
        startTimer(client);
        break;
    case "get-timer":
        getTimer(client, opts);
        break;
    case "delete-timer":
        deleteTimer(client, opts)
        break;
    }
}
