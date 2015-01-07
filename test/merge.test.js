
var expect = require('chai').expect;
var merge = require('../merge');


describe('merge', function () {

  it('merges shallow object properties', function () {
    var m = merge( {a:1,b:2,c:3}, {b:4,d:5} );
    expect(m).to.eql( {a:1,b:4,c:3,d:5} );
  });

  it('merges deep object properties', function () {
    var a = {a:{b:1,c:{d:2}}};
    var b = {a:{b:2,c:{d:3, e:4}}};
    var m = merge( a, b );
    expect( m ).to.eql( {a:{b:2,c:{d:3,e:4}}} );
  });

  it('supports merge on unknown props', function () {
    var a = {k:1};
    var b = {deep:{a:2}};
    var m = merge( a, b );
    expect( m ).to.eql( {k:1,deep:{a:2}} );
  });

});
