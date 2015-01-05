
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
