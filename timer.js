var intervals = require('./intervals')
;

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
        console.log(res);
        console.log("Timer deleted");
    });
}

module.exports = function(conf, opts) {
    var client = intervals.createClient(conf.token);

    switch (opts._[0]) {
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
