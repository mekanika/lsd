
var is = require('./is');

// Supports deep merging but ONLY of object (no deep array support)
var merge = function(o) {
  var i = 0, a = arguments, len = a.length;
  o = o || {};

  while (++i < len) {
    for (var prop in a[i]) {
      if (!a[i].hasOwnProperty(prop)) continue;
      if (is.object(a[i][prop])) o[prop] = merge( o[prop], a[i][prop] );
      else o[prop] = a[i][prop];
    }
  }
  return o;
};
