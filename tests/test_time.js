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
        },
        add_time: function(payload, callback) {
            callback(null, {});
        }
    };
}

vows.describe('Intervals').addBatch({
    'add time': {
        topic: function() {
            var client = createFakeClient();
            client.add_time = this.callback;
            intervals.addTime({time: 4,
                               billable: true}, client);
        },
        'with good payload': function(payload, callback) {
            assert.equal(payload, JSON.stringify({time: 4, billable: 't',
                                                  projectid: 'projectid',
                                                  moduleid: 'moduleid',
                                                  worktypeid: 'worktypeid',
                                                  personid: 'me'}));
        }
    }
}).export(module);
