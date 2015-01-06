
var expect = require('chai').expect;
var filter = require('../filter');


describe('filter', function () {

  var col = [
    {name:'Zim', skill:1, home:'Space'},
    {name:'Gir', skill:4, home:'Space'},
    {name:'Dib', skill:5, home:'Earth'},
    {name:'Gaz', skill:20, home:'Earth'}
  ];

  it('filters on object selector', function () {
    expect( filter(col, {home:'Earth'}) ).to.have.length(2);
    expect( filter(col, {home:'Earth'})[0].name ).to.equal('Dib');
  });

  it('object selector keys act as AND conditions', function () {
    expect( filter(col, {home:'Space', skill:4}) ).to.have.length(1);
    expect( filter(col, {home:'Space', skill:4})[0].name ).to.equal('Gir');
  });

  it('filters on function selector', function () {
    var sel = function(el){ return el.skill > 4; };
    expect( filter(col, sel) ).to.have.length(2);
    expect( filter(col, sel)[1].name ).to.equal('Gaz');
  });

  it('returns index values when `onlyIndex` param is true', function () {
    var sel = function(el){ return el.skill > 4; };
    var byFn = filter(col,sel,true);
    expect( byFn ).to.have.length(2);
    expect( byFn[1] ).to.equal(3);

    var bySel = filter(col,{home:'Space'}, true);
    expect( bySel ).to.have.length(2);
    expect( bySel[1] ).to.equal(1);
  });

});
