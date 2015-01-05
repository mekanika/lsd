
var is = require('./is');


/**
  Helper method: intended to return the key of a single-key object

  @param {Object} block The single key object to inspect

  @returns {String} The key of the object
*/

var _lastkey = function(block) {
  var ret;
  for (var key in block) if (block.hasOwnProperty(key)) ret = key;
  return ret;
};


/**
  MongoDB style matching on a Collection

  @param {Array} col The collection to search
  @param {MatchCondition} mc A MongoDB style MatchCondition

  @return {Array} Matches
*/

function _match (col, mc) {

  // Test a record `rec` against a MatchObject `mo`
  var match = function (rec, mo) {
    var field = _lastkey(mo);
    var op = _lastkey( mo[field] );
    var val = mo[field][op];

    // Evaluate values provided as functions
    if (is.function(val)) val = val();

    // Does the record pass the match object? Initialise this as false.
    var hit = false;

    switch (op) {
      case 'eq': if (rec[field] === val) hit = true; break;
      case 'neq': if (rec[field] !== val) hit = true; break;
      case 'in': if (val.indexOf(rec[field]) > -1) hit = true; break;
      case 'nin': if (val.indexOf(rec[field]) < 0) hit = true; break;
      case 'gt': if (rec[field] > val) hit = true; break;
      case 'gte': if (rec[field] >= val) hit = true; break;
      case 'lt': if (rec[field] < val) hit = true; break;
      case 'lte': if (rec[field] <= val) hit = true; break;
      case 'all':
        var _all = true, i = -1;
        while (++i < val.length) {
          if (!rec[field]) _all = false;
          else if (rec[field].indexOf(val[i]) === -1) _all = false;
        }
        if (_all) hit = true;
      break;
    }

    return hit;
  };

  function _mc (el, mos, boolop) {
    var hits = [];

    var i = -1;
    while (++i < mos.length) {
      var mo = mos[i];
      var key = _lastkey( mo );
      // Nested match condition
      if (mo[key] instanceof Array) {
        hits[i] = _mc( el, mo[key], key);
      }
      else hits[i] = match(el, mo);
    }

    // Collapse hits to a TRUE or FALSE based on boolops
    return boolop === 'or'
      ? hits.indexOf(true) > -1 // OR check
      : hits.indexOf(false) < 0;
  }

  var boolop = _lastkey(mc);
  var matches = [];

  var ci = -1;
  while (++ci < col.length) {
    var el = col[ci];
    // Support "indexed" results returned from _find()
    var r = el.record && Object.keys(el).length === 2
      ? el.record
      : el;

    if (_mc(r, mc[boolop], boolop)) matches.push(el);
  }

  return matches;
}

module.exports = _match;
