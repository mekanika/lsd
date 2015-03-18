!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.LSD=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var is = require('./is');

/**
  Deep clone objects and arrays recursively, returning a new copy
*/

var clone = function (o) {
  var ret;
  if (o instanceof Array) {
    var i=-1;
    ret = [];
    while( ++i < o.length) {
      if (is.array(o[i]) || is.object(o[i])) ret[i] = clone( o[i] );
      else ret[i] = o[i];
    }
  }
  else if (is.object(o)) {
    ret = {};
    for (var k in o) {
      if (!o.hasOwnProperty(k)) continue;
      if (is.array(o[k]) || is.object(o[k])) ret[k] = clone( o[k] );
      else ret[k] = o[k];
    }
  }
  else ret = o;

  return ret;
};

module.exports = clone;

},{"./is":4}],2:[function(require,module,exports){


var is = require('./is');

/**
  Filter a collection for matching selectors, with an option `onlyIndex` flag
  to return array of indexes instead of full elements in collection.

  When using an object selector:
  (Note: multiple key:value selectors are treated as AND conditions)

  ```
  var res = filter( mycollection, {home:'Space'} );
  // -> [{name:'Zim',skill:1,home:'Space'}, {name:'Gir',skill:6,home:'Space'}]
  ```

  When using a function selector:

  ```
  var res = filter( mycollection, function(el){ return el.skill > 5 } );
  // -> [{name:'Gir',skill:6,home:'Space'}, {name:'Dib',skill:7,home:'Earth'}]
  ```

  Function selectors are passed each element of the array to return truthy

  @param {Array} col The collection to search through
  @param {Object|Function} sel The selector to apply
  @param {Boolean} onlyIndex Forces returning only the index number of matches

  @return {Array|-1} Array of matches (or `-1` if onlyIndex and no matches)
*/

var filter = function (col, sel, onlyIndex) {
  var i = -1, matches = [], match, index;

  while (++i < col.length) {
    match = true;
    // Object selector {k:v,..}
    if (is.object(sel)) {
      // Matches default to AND (ie. ALL k:v matches must match)
      for (var key in sel) {
        if (!sel.hasOwnProperty(key)) continue;
        if (col[i][key] !== sel[key]) match = false;
      }
      if (match) {
        matches.push( onlyIndex ? i : col[i] );
      }
    }
    // Function selector
    else if (is.function(sel)) {
      if (sel(col[i])) {
        matches.push( onlyIndex ? i : col[i] );
      }
    }
  }
  return matches;
};

module.exports = filter;

},{"./is":4}],3:[function(require,module,exports){

var utils = {
  is: require('./is'),
  clone: require('./clone'),
  filter: require('./filter'),
  match: require('./match'),
  merge: require('./merge'),
  sortBy: require('./sort'),
  toObj: require('./toObj')
};

module.exports = utils;

},{"./clone":1,"./filter":2,"./is":4,"./match":5,"./merge":6,"./sort":7,"./toObj":8}],4:[function(require,module,exports){

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

var is = {
  string: function (v) { return typeof v === 'string'; },
  integer: function (v) { return typeof v === 'number' && v%1 === 0 && !isNaN(v);},
  number: function (v) { return toType(v) === 'number' && !isNaN(v); },
  array: function (v) { return toType(v) === 'array'; },
  boolean: function (v) { return toType(v) === 'boolean'; },
  object: function (v) { return toType(v) === 'object'; },
  date: function (v) { return toType(v) === 'date'; },
  function: function (v) { return toType(v) === 'function'; },
  undefined: function (v) { return typeof v === 'undefined'; },
  error: function (v) { return toType(v) === 'error'; },
  equal: function(a, b) {
    if (a === b) return true;
    var i = -1;

    if (is.array(a)) {
      if (!is.array(b)) return false;
      if (a.length !== b.length) return false;
      while (++i < a.length)
        if (!is.equal(a[i], b[i])) return false;

      return true;
    }

    if (is.object(a) && is.object(b)) {
      var aKeys = Object.keys(a), bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) return false;
      while (++i < aKeys.length)
        if (!is.equal(a[aKeys[i]], b[aKeys[i]])) return false;

      return true;
    }
    return false;
  }
};


/**
  Returns the raw type of the element

  @param {Mixed} el The element to return the type from
*/

is.type = function (el) {
  return toType(el);
};

module.exports = is;

},{}],5:[function(require,module,exports){

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
    var i; // counter
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
        var _all = true;
        i = -1;
        while (++i < val.length) {
          if (!rec[field]) _all = false;
          else if (rec[field].indexOf(val[i]) === -1) _all = false;
        }
        if (_all) hit = true;
        break;
      case 'any':
        for (i=0; i < val.length; i++) {
          if ( rec[field] && rec[field].indexOf(val[i]) > -1 ) {
            hit = true; i = val.length;
          }
        }
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

},{"./is":4}],6:[function(require,module,exports){

/**
  Import the type checker
  @ignore
*/

var is = require('./is');


/**
  Maps a collection plucked by a value `from` onto `into[ field ]`

  @this {Object} Contains `{field, from}`
*/

var mapCollection = function (into, col) {
   // Setup default strategies
  var def = this;

  var target = {};
  if (into[def.field]) target = JSON.parse(JSON.stringify(into[def.field]));

  // Step through collection
  for (var h=0; h < col.length; h++) {

    var key = def.from;

    // `{from:$0}` enables setting key dynamically based on the FIRST key
    // to be returned from each collection item.
    if (def.from === '$0') {
      for (var ix in col[h]) {
        if (!col[h].hasOwnProperty(ix)) continue;
        key = ix; break;
      }
    }

    // Bail out if keys are already set
    if (target[key] && def.preserve) continue;

    // Ensure defaults are set for target
    if (!target[key])
      target[key] = col[h][key] instanceof Array ? [] : {};

    // Ensure default behaviour is to Replace the array
    var ra = def.replaceArray === false ? false : true;
    var out = merge.call({replaceArray:ra}, target[key], col[h][key] );

    // Ensure assignment of arrays that have length
    // (These don't replace `target[def]` by default, so force them here)
    if (out instanceof Array && out.length !== 0)
      target[key] = out;
  }
  into[def.field] = target;
  return into;
};


/**
  Merges multiple arguments of objects and arrays together, right to left, ie.
  last argument collapses onto second last, onto third last, etc.

  By default the merge strategy is:

  - **preserve**: `false`: Object values are overwritten
    - `true`: Existing values are not overwritten
  - **replaceArray**: `undefined`: Arrays are appended
    - `true`: Arrays are completely replaced with new array/value
    - `false`: Existing array index _values_ are overwritten/merged

  - If a field defined on both `from` and `to`, changes overwrite `to`.
  - Arrays are appended, not overwriteen

  @param {Object|Array}
  @this {Object} Defaults for `{preserve, replaceArray}`

  @return Merged arguments
*/

var merge = function(into, col) {
  // Setup default strategies
  var def = this;
  if (typeof def.preserve === 'undefined') def.preserve = merge.preserve;
  if (typeof def.replaceArray === 'undefined') def.replaceArray = merge.replaceArray;
  if (typeof def.maxArgs === 'undefined') def.maxArgs = merge.maxArgs;

  var i = 0, a = arguments, len = def.maxArgs || a.length;
  var o;

  // Map the collection if directed so
  if (def.field && def.from) {
    return mapCollection.call(def, into, col);
  }

  // Step through each argument
  while (++i < len) {
    if (is.object(a[i])) {
      if (def.field) o = into[def.field] || {};
      else o = into || {};

      for (var prop in a[i]) {
        if (!a[i].hasOwnProperty(prop)) continue;

        // Do not overwrite an existing property if `preserve` is true
        if (typeof o[prop] !== 'undefined' && def.preserve) continue;

        if (is.object(a[i][prop])) o[prop] = merge( o[prop], a[i][prop] );
        if (is.array(a[i][prop])) o[prop] = merge( o[prop], a[i][prop] );
        else o[prop] = a[i][prop];
      }
    }
    else if (is.array(a[i])) {
      // Do not overwrite an existing property if `preserve` is true
      // if (typeof o !== 'undefined' && def.preserve) continue;
      if (def.field) o = into[def.field] || [];
      else o = into || [];

      // undefined: Append
      if (def.replaceArray === undefined) o.push.apply(o, a[i]);
      // true: Replace
      else if (def.replaceArray) {
        o = a[i];
        if (!def.field) into = a[i];
      }
      // false: Overwrite positions
      else {
        for (var k=0; k<a[i].length; k++) o[k] = a[i][k];
      }
    }
  }

  // Replace the `into` object field with our mapped values
  if (def.field) into[def.field] = o;

  return into;
};


/**
  Configuration settings for how merges will occur
*/

merge.preserve = false;
merge.replaceArray = undefined;
merge.maxArgs = undefined;


/**
  Enables setting configuration for merge strategy on merge per run
*/

merge.as = function (opts) {
  var args = Array.prototype.slice.call( arguments );

  // Remove the `opts` object from the parameters passed to this function
  args.shift();

  // Apply the merge
  var ret = merge.apply( opts, args );

  return ret;
};


/**
  Export the module
  @exports merge
*/

module.exports = merge;

},{"./is":4}],7:[function(require,module,exports){

var is = require('./is');

var sortBy = function (ar, field, rev, fn) {
  if (!field) return ar;
  if (is.undefined(rev) || !rev) rev = 1;

  // Copy the array to sort (don't change host data)
  var xr = [], i = -1;
  while (++i < ar.length) xr[i] = ar[i];

  // Applies a transform to the value if `fn` is passed
  var prep = function (el) {
    return fn ? fn(el[field]) : el[field];
  };

  // The basic comparator
  var compare = function (a, b) {
    a = prep(a), b = prep(b);
    return rev * ((a > b) - (b > a));
  };

  return xr.sort( compare );
};

module.exports = sortBy;

},{"./is":4}],8:[function(require,module,exports){

/**
  Returns a single keyed object set to `{key:value}`

  @param {String} k The key for your object
  @param {Mixed} v The value to assign to `key`

  @return {Object}
*/

var toObj = function (k,v) {
  var o = {}; o[k] = v;
  return o;
};

module.exports = toObj;

},{}]},{},[3])(3)
});