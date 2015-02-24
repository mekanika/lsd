
/**
  Import the type checker
  @ignore
*/

var is = require('./is');


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

  @return Merged arguments
*/

var merge = function(o) {
  var i = 0, a = arguments, len = a.length;

  // Step through each argument
  while (++i < len) {
    if (is.object(a[i])) {
      o = o || {};

      for (var prop in a[i]) {
        if (!a[i].hasOwnProperty(prop)) continue;

        // Do not overwrite an existing property if `preserve` is true
        if (typeof o[prop] !== 'undefined' && merge.preserve) continue;

        if (is.object(a[i][prop])) o[prop] = merge( o[prop], a[i][prop] );
        if (is.array(a[i][prop])) o[prop] = merge( o[prop], a[i][prop] );
        else o[prop] = a[i][prop];
      }
    }
    else if (is.array(a[i])) {
      // Do not overwrite an existing property if `preserve` is true
      if (typeof o !== 'undefined' && merge.preserve) continue;
      o = o || [];

      // undefined: Append
      if (merge.replaceArray === undefined) o.push.apply(o, a[i]);
      // true: Replace
      else if (merge.replaceArray) o = a[i];
      // false: Overwrite positions
      else {
        for (var k=0; k<a[i].length; k++) o[k] = a[i][k];
      }

    }
  }
  return o;
};


/**
  Configuration settings for how merges will occur
*/

merge.preserve = false;
merge.replaceArray = undefined;


/**
  Enables setting configuration for merge strategy on merge per run
*/

merge.as = function (opts) {
  var args = Array.prototype.slice.call( arguments );

  // Remove the `opts` object from the parameters passed to this function
  args.shift();

  if (opts.preserve) merge.preserve = true;
  if (typeof opts.replaceArray !== undefined)
    merge.replaceArray = opts.replaceArray;

  // Apply the merge
  var ret = merge.apply( this, args );

  // Reset the defaults
  merge.preserve = false;
  merge.replaceArray = undefined;

  return ret;
};


/**
  Export the module
  @exports merge
*/

module.exports = merge;
