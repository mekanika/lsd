
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
