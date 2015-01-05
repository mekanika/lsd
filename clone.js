
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
