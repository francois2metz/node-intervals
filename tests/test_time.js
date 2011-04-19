var vows   = require('vows')
  , assert = require('assert')
;

var intervals = require('../intervals')
;

function createFakeClient() {
    return {
        me: function(callback) {
            callback(null, {
                body: {
                    personid: 'me'
                }
            });
        },
        client: function(params, callback) {
            callback(null, {
                body: {
                    client: [{
                        id: 'clientid',
                        name: 'hello'
                    }]
                }
            });
            process.stdin.emit('data', '0');
        },
        project: function(params, callback) {
            callback(null, {
                body: {
                    project: [{
                        id: 'projectid',
                        name: 'project'
                    }]
                }
            });
            process.stdin.emit('data', '0');
        },
        project_module: function(params, callback) {
            callback(null, {
                body: {
                    projectmodule: [{
                        moduleid: 'moduleid',
                        modulename: 'module'
                    }]
                }
            });
            process.stdin.emit('data', '0');
        },
        project_worktype: function(options, callback) {
            callback(null, {
                body: {
                    projectworktype: [{
                        worktypeid: 'worktypeid',
                        worktype: 'worktype'
                    }]
                }
            });
            process.stdin.emit('data', '0');
        }
    };
}

vows.describe('Intervals').addBatch({
    'ask for project': {
        topic: function() {
            var client = createFakeClient();
            intervals.askForProject(client)(this.callback);
        },
        'return good project': function(project) {
            assert.deepEqual(project, {personid: 'me',
                                       projectid: 'projectid',
                                       moduleid: 'moduleid',
                                       worktypeid: 'worktypeid',
                                       human: {
                                           project: 'project',
                                           module: 'module',
                                           worktype: 'worktype'
                                       }});

        }
    }
}).export(module, {error: false});
