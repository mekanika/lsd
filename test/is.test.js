
var expect = require('chai').expect;
var is = require('../is');

describe('.is', function () {

  it('array', function () {
    expect( is.array([1,2]) ).to.be.true;
    expect( is.array( new Array() ) ).to.be.true;
    expect( is.array( {0:1, 1:2, 2:3} ) ).to.be.false;
  });

  it('boolean');

  it('date');

  it('equal');

  it('function');

  it('integer');

  it('number');

  it('string');

  it('undefined');

});
