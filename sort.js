
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
