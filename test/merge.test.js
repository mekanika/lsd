
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

  describe('map onto .field', function () {
    it('applies object keys to field', function () {
      var user = {name:'Zim'};
      var props = {
        a: {value:'jack'},
        b: {value:true}
      };

      var o = merge.as({field:'extras'}, user, props);
      expect(o.extras).to.have.keys('a','b');
    });

    it('applies arrays to field', function () {
      var user = {name:'Zim'};
      var props = [
        {a: {value:'jack'}},
        {b: {value:true}}
      ];

      var o = merge.as({field:'extras'}, user, props);
      expect(o.extras).to.have.length(2);
    });

    it('honours merge strategy on objects', function () {
      var user = {name:'Zim', extras:{a:'woot!'}};
      var props = {
        a: {value:'jack'},
        b: {value:true}
      };

      var o = merge.as({preserve:true, field:'extras'}, user, props);
      expect(o.extras.a).to.equal('woot!');
    });

    it('honours merge strategy on arrays', function () {
      var user = {name:'Zim', extras:['swee!']};
      var props = [
        'cowa',
        'bunga'
      ];

      var o = merge.as({field:'extras', replaceArray:undefined}, user, props);
      expect(o.extras).to.have.length(3);

      user.extras = ['swee']; // reset user
      o = merge.as({field:'extras', replaceArray:true}, user, props);
      expect(o.extras).to.eql(['cowa','bunga']);

      user.extras = [1,2,3]; // reset user
      o = merge.as({field:'extras', replaceArray:false}, user, props);
      expect( o.extras ).to.eql(['cowa','bunga',3]);
    });
  });

  describe('mapCollection', function () {
    it('default behaviour replaces array', function () {
      var user = {name:'Zim'};
      var props = [
        {boom:[{value:'jack'},4]},
        {boom:[{value:true}]}
      ];

      var o = merge.as({field:'extras', from:'boom'}, user, props);

      expect(o.extras.boom).to.have.length(1);
      expect(o.extras.boom[0].value).to.equal(true);
    });
  });

});
