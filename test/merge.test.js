
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

  it('default overwrites object properties', function () {
    var a = {k:1};
    var b = {k:2};
    var m = merge( a, b );
    expect( m.k ).to.equal(2);
  });

  it('default appends arrays', function () {
    var a = [1,2];
    var b = [3,4];
    var m = merge( a, b );
    expect( m ).to.eql([1,2,3,4]);
  });

  describe('.as()', function () {

    it('overrides `preserve` to keep existing values', function () {
      var a = {k:1};
      var b = {k:2};
      var m = merge.as({preserve:true}, a, b);
      expect( m.k ).to.equal( 1 );
    });

    it('`replaceArray:true` to replace arrays', function () {
      var a = [1,2];
      var b = [3,4];
      var m = merge.as( {replaceArray:true}, a, b );
      expect( m ).to.eql([3,4]);
    });

    it('`replaceArray:false` to overwrite arrays', function () {
      var a = [1,2,5,6];
      var b = [3,4];
      var m = merge.as( {replaceArray:false}, a, b );
      expect( m ).to.eql([3,4,5,6]);
    });

    it('resets config post run', function () {
      var a = [1,2,5,6];
      var b = [3,4];
      var m = merge.as( {preserve:true, replaceArray:false}, a, b );

      expect(merge.preserve).to.equal(false);
      expect(merge.replaceArray).to.equal(undefined);
    });

  });

});
