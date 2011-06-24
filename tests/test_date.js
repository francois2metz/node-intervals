var vows   = require('vows')
  , assert = require('assert')
;

var utils = require('../utils')
;

require('../date');

var today = utils.today;

vows.describe('Intervals config').addBatch({
    'can specify a range': {
        '2011-06-13..2011-06-15': function() {
            assert.deepEqual(utils.parseDate('2011-06-13..2011-06-15'), ['2011-06-13',
                                                                         '2011-06-14',
                                                                         '2011-06-15']);
        },
        '2011-06-16..2011-06-14': function() {
            assert.deepEqual(utils.parseDate('2011-06-16..2011-06-14'), ['2011-06-14',
                                                                         '2011-06-15',
                                                                         '2011-06-16']);
        },
        'yesterday..': function() {
            var yesterday = Date.today().add({days: -1}).toString('yyyy-MM-dd');
            assert.deepEqual(utils.parseDate(yesterday + '..'), [yesterday, today()]);
        },
        '..tomorrow': function() {
            var tomorrow = Date.today().add({days: 1}).toString('yyyy-MM-dd');
            assert.deepEqual(utils.parseDate('..'+tomorrow), [today(), tomorrow]);
        },
        'yesterday': function() {
            assert.deepEqual(utils.parseDate('yesterday'), [Date.today().add({days: -1}).toString('yyyy-MM-dd')]);
        },

        'today': function() {
            assert.deepEqual(utils.parseDate('today'), [today()]);
        },

        '2011-06-16': function() {
            assert.deepEqual(utils.parseDate('2011-06-16'), ['2011-06-16']);
        },

        "['2011-06-16', '2011-06-18']": function() {
            assert.deepEqual(utils.parseDate(['2011-06-16', '2011-06-18']), ['2011-06-16', '2011-06-18']);
        },

        "['2011-06-16', 'today']": function() {
            assert.deepEqual(utils.parseDate(['2011-06-16', 'today']), ['2011-06-16', today()]);
        }
    }
}).export(module);
