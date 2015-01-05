
var expect = require('chai').expect;
var toObj = require('../toobj');


describe('toObj', function () {

  it('converts (k,v) to {k:v}', function () {
    expect( toObj('yes',false) ).to.eql({yes:false});
    expect( toObj('one','two') ).to.eql({one:'two'});
  });

});
