
var expect = require('chai').expect;
var _ = require('../index');

describe('Index', function () {

  it('exports an Object', function () {
    expect( _ ).to.be.an.instanceof( Object );
  });

  it('exposes API', function () {
    expect( _.is ).to.be.ok;
    expect( _.clone ).to.be.ok;
    expect( _.filter ).to.be.ok;
    expect( _.match ).to.be.ok;
    expect( _.merge ).to.be.ok;
    expect( _.sortBy ).to.be.ok;
    expect( _.toObj ).to.be.ok;
  });

});
