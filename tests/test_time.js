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
                        name: 'hello'
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
                        modulename: 'hello'
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
                        worktype: 'hello'
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
            intervals.askForProject(client).then(this.callback);
        },
        'return good project': function(callback, project) {
            assert.isFunction(callback);
            assert.deepEqual(project, {projectid: 'projectid',
                                       moduleid: 'moduleid',
                                       worktypeid: 'worktypeid',
                                       personid: 'me'});

        }
    }
}).export(module, {error: false});
