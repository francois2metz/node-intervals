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

/**
 * New request if 'limit' increase if the result list is not complete
 */
function acceptMore() {
    return function(method, request, next) {
        next(function(response, next) {
            if (method.method == 'GET'
                && request.params.limit
                && !request.params.offset
                && response.body.listcount > request.params.limit) {
                request.params.limit = response.body.listcount;
                request.finalize(function onFinalize(err, resp2) {
                    if (err) throw err;
                    response.status = resp2.status;
                    response.headers = resp2.headers;
                    response.body = JSON.parse(utils.deHtmlEntities(resp2.body));
                    next();
                });
            } else {
                next();
            }
        });
    };
}

/**
 * Replace all html entities from api response to real utf8 characters
 */
function transformHtmlEntities() {
    return function(method, request, next) {
        next(function(response, next) {
            response.body = utils.deHtmlEntities(response.body);
            next();
        })
    };
}

var sporeDesc = exports.description = JSON.parse(require('fs').readFileSync(__dirname +'/intervals.json', 'utf8'));

/**
 * Create Spore client
 */
var createClient = exports.createClient = function(token) {
    var client = spore.createClient(sporeDesc);
    client.enable(spore.middlewares.basic(token, 'X'));
    client.enable(acceptMore());
    client.enable(spore.middlewares.json());
    client.enable(transformHtmlEntities());
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
        stream.pipe(pager.stdin);
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
                           limit: 42,
                           // projectsonly parameter seems buggy,
                           // but hopefully doesn't throw 500 error in API
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
