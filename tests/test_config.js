var vows   = require('vows')
  , assert = require('assert')
  , fs = require('fs')
;

var config = require('../config')
 , intervals = require('../intervals')
;

process.env.HOME = process.cwd();
process.env.XDG_CONFIG_HOME = process.cwd();

vows.describe('Intervals config').addBatch({
    'config path follow freedesktop specification': {
        'with $XDG_CONFIG_HOME not set': function() {
            delete process.env.XDG_CONFIG_HOME;
            assert.equal(config.path, process.cwd() + '/.config/intervals');
        },
        'with $XDG_CONFIG_HOME set': function() {
            process.env.XDG_CONFIG_HOME = '/tmp';
            assert.equal(config.path, '/tmp/intervals');
        }
    }
}).addBatch({
    'if a config file doen\'t exist ': {
        topic: function() {
            config.read(this.callback);
        },
        'err is not null': function(err, value) {
            assert.isNotNull(err);
        }
    }
}).addBatch({
    'if file exist' : {
        topic: function() {
            process.env.XDG_CONFIG_HOME = process.cwd();
            fs.writeFile(process.cwd() + '/intervals', "token: 'mytoken'\n", this.callback);
        },
        'config can be': {
            topic: function() {
                config.read(this.callback);
            },
            'read in yaml format' : function(err, c) {
                assert.isNull(err);
                assert.equal(c.token, 'mytoken');
            },
            'and destroyed': {
                topic: function() {
                    fs.unlink(process.cwd() + '/intervals', this.callback);
                },
                'err is null' : function(err, v) {
                    assert.isNull(err);
                }
            }
        }
    }
}).addBatch({
    'Can be writen': {
        topic: function() {
            process.env.XDG_CONFIG_HOME = process.cwd();
            config.write({token: 'my_token2'}, this.callback);
        },
        'and err is null' : function(err, result) {
            assert.isNull(err);
        },
        'in yaml': {
            topic: function() {
                config.read(this.callback);
            },
            'err is null': function(err, c) {
                assert.isNull(err);
            },
            'and read in yaml format' : function(err, c) {
                assert.equal(c.token, 'my_token2');
            },
            'and destroyed': {
                topic: function() {
                    fs.unlink(process.cwd() + '/intervals', this.callback);
                },
                'err is null' : function(err, v) {
                    assert.isNull(err);
                }
            }
        }
    }
}).export(module);
