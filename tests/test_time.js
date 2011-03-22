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
                               date: '2011-03-22',
                               billable: true}, client);
        },
        'with good payload': function(payload, callback) {
            assert.equal(payload, JSON.stringify({time: 4,
                                                  date: '2011-03-22',
                                                  billable: 't',
                                                  projectid: 'projectid',
                                                  moduleid: 'moduleid',
                                                  worktypeid: 'worktypeid',
                                                  personid: 'me'}));

        }
    },
    'return futures': {
        topic: function() {
            var client = createFakeClient();
            return intervals.addTime({time: 5,
                                      date: '2011-03-22',
                                      billable: false}, client, function() {});
        },
        'then ...': function(future) {
            future.then(function(next, err, res, time) {
                assert.isFunction(next);
                assert.isNull(err);
                assert.deepEqual(time, {time: 5,
                                        date: '2011-03-22',
                                        description: undefined,
                                        billable: 'f',
                                        projectid: 'projectid',
                                        moduleid: 'moduleid',
                                        worktypeid: 'worktypeid',
                                        personid: 'me'});
            });
        }
    }
}).export(module);
