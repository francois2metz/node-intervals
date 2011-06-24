var vows   = require('vows')
  , assert = require('assert')
;

var utils = require('../utils')
;

function batchHtmlEntities(htmlentities) {
    var batch = {};
    htmlentities.forEach(function(props) {
        var entity = props[0];
        var utf8 = props[1];
        batch['transform '+ entity + ' to '+ utf8] = function() {
            assert.equal(utils.deHtmlEntities(entity), utf8);
            assert.equal(utils.deHtmlEntities(entity+entity), utf8+utf8);
        }
    });
    return batch;
}

vows.describe('Intervals deHtmlEntities').addBatch({
    'can remove html entities': batchHtmlEntities(utils.htmlEntities)
}).export(module);
