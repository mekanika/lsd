

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
