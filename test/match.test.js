
var expect = require('chai').expect;
var match = require('../match');


describe('match', function () {

  it('any', function () {
    var col = [
      {id:1, bits:['apple','banana','carrot','hotdog']},
      {id:2, bits:['banana']},
      {id:3, bits:['carrot','hamburger']},
      {id:4, bits:['apple','hamburger']},
      {id:5}
    ];

    var res = match(col, {and:[{bits:{any:['apple','hamburger']}}]});
    expect( res ).to.have.length(3);
  });

});
