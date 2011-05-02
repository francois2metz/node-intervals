var spore = require('spore')
  , futures = require('futures')
  , utils = require('./utils')
  , tty = require('tty')
  , Stream = require('stream').Stream
  , pump = require('util').pump
;

/**
 * Set Accept header
 */
function accept(accept) {
    return function(method, request, next) {
        request.headers['Accept'] = accept;
        next();
    }
}
/**
 * Set Content-type header
 */
function contentType(contentType) {
    return function(method, request, next) {
        request.headers['Content-type'] = contentType;
        next();
    };
}

var sporeDesc = exports.description = require('./description');

/**
 * Create Spore client
 */
var createClient = exports.createClient = function(token) {
    var client = spore.createClient(sporeDesc);
    client.enable(spore.middlewares.basic(token, 'X'));
    client.enable(spore.middlewares.json());
    client.enable(accept('application/json'));
    client.enable(contentType('application/json'));
    return client;
}

function formatListIn(stream, array, propertyName) {
    for (var i = 0; i < array.length; i++) {
        stream.emit('data', ' '+ i + '. '+ array[i][propertyName] + "\n");
    }
}

function usePager(length) {
    var stdoutFD = process.binding("stdio").stdoutFD;
    return (tty.isatty(stdoutFD) && tty.getWindowSize(stdoutFD)[0] < length);
}

function chooseIn(list, propertyName, callback) {
    var next = function() {
        process.stdout.write('enter your choice: ');
        utils.readInput(function(v) {
            var index = parseInt(v, 10);
            if (list.length > index) callback(index, list[index]);
            else chooseIn(list, propertyName, callback);
        });
    }
    var stream = new Stream();
    pump(stream, process.stdout);
    if (usePager(list.length)) {
        var pager = utils.pipe(process.env.PAGER || "less", []);
        pump(stream, pager.stdin);
        pager.on('exit', next);
    } else {
        stream.on('close', next);
    }
    formatListIn(stream, list, propertyName);
    stream.emit('close');
}

/**
 * Ask user in interactive mode
 * client: spore client
 * Return function
 */
exports.askForProject = function(client) {
    return function(nextGlobal) {
        var project = {
            personid: null,
            projectid: null,
            moduleid: null,
            worktypeid: null,
            human: {
                project: null,
                module: null,
                worktype: null
            }
        };
        var sequence = futures.sequence();
        sequence.then(function(next) {
            client.me(function(err, res) {
                if (err) throw err;
                project.personid = res.body.personid;
                next();
            });
        }).then(function(next) {
            client.client({active: 't',
                           // projectsonly parameter seems buggy,
                           // but hopefully doesn't throw 500 error in API
                           limit: 42,
                           projectsonly: 't'},
                          function(err, res) {
                              console.log('Choose client:');
                              if (err) throw err;
                              chooseIn(res.body.client, 'name', function(index, aClient) {
                                  var clientId = aClient.id;
                                  next(clientId);
                              });
                          });
        }).then(function(next, clientId) {
            client.project({active: 't',
                            personid: project.personid,
                            clientid: clientId},
                           function(err, res) {
                               console.log('Choose a project:');
                               if (err) throw err;
                               chooseIn(res.body.project, 'name', function(index, aProject) {
                                   project.projectid = aProject.id;
                                   project.human.project = aProject.name;
                                   next();
                               });
                           });
        }).then(function(next) {
            client.project_module({projectid: project.projectid,
                                   limit: 42,
                                   active: 't',
                                   personid: project.personid}, function(err, res) {
                console.log('Choose a module:');
                if (err) throw err;
                chooseIn(res.body.projectmodule, 'modulename', function(index, aModule) {
                    project.moduleid = aModule.moduleid;
                    project.human.module = aModule.modulename;
                    next();
                });
            });
        }).then(function(next) {
            client.project_worktype({projectid: project.projectid,
                                     limit: 42,
                                     active: 't',
                                     personid: project.personid}, function(err, res) {
                console.log('Choose a worktype:');
                if (err) throw err;
                chooseIn(res.body.projectworktype, 'worktype', function(index, aWorktype) {
                    project.worktypeid = aWorktype.worktypeid;
                    project.human.worktype = aWorktype.worktype;
                    nextGlobal(project);
                });
            });
        });
    };
};
/**
 * Add time
 * project:
 *  - personid
 *  - projectid
 *  - moduleid
 *  - worktypeid
 * options with keys:
 *  - time
 *  - date
 *  - billable
 *  - description
 * client: spore client
 * callback
 */
exports.addTime = function(project, options, client, callback) {
    var time = {
        time: options.time,
        date: options.date,
        billable : options.billable ? 't': 'f',
        description: options.description,
        personid: project.personid,
        projectid: project.projectid,
        moduleid: project.moduleid,
        worktypeid: project.worktypeid
    };
    client.add_time(JSON.stringify(time), function(err, res) {
        callback(err, res);
    });
}
