
var expect = require('chai').expect;
var is = require('../is');

describe('.is', function () {

  it('string', function () {
    expect( is.string('') ).to.eql(true);
    expect( is.string('true') ).to.eql(true);
    expect( is.string(true) ).to.eql(false);
    expect( is.string(new Date()) ).to.eql(false);
  });

  it('integer', function () {
    expect( is.integer(0) ).to.eql(true);
    expect( is.integer(-15) ).to.eql(true);
    expect( is.integer(100) ).to.eql(true);
    expect( is.integer(1.0) ).to.eql(true);
    expect( is.integer(1.2) ).to.eql(false);
    expect( is.integer(NaN) ).to.eql(false);
  });

  it('number', function () {
    expect( is.number(0) ).to.eql(true);
    expect( is.number(-15) ).to.eql(true);
    expect( is.number(100) ).to.eql(true);
    expect( is.number(1.0) ).to.eql(true);
    expect( is.number(1.2) ).to.eql(true);
    expect( is.number(NaN) ).to.eql(false);
  });

  it('array', function () {
    expect( is.array(0) ).to.eql(false);
    expect( is.array('1,2,3') ).to.eql(false);
    /*jshint -W009 */
    expect( is.array(new Array()) ).to.eql(true);
    expect( is.array([]) ).to.eql(true);
  });

  it('boolean', function () {
    expect( is.boolean(0) ).to.eql(false);
    expect( is.boolean(1) ).to.eql(false);
    expect( is.boolean(-1) ).to.eql(false);
    expect( is.boolean(true) ).to.eql(true);
    expect( is.boolean(false) ).to.eql(true);
    expect( is.boolean('true') ).to.eql(false);
  });

  it('object', function () {
    expect( is.object(function(){}) ).to.eql(false);
    expect( is.object('object') ).to.eql(false);
    expect( is.object(new Date()) ).to.eql(false);
    expect( is.object([]) ).to.eql(false);
    expect( is.object({}) ).to.eql(true);
  });

  it('date', function () {
    expect( is.date(0) ).to.eql(false);
    expect( is.date('28 July 1914') ).to.eql(false);
    expect( is.date(new Date()) ).to.eql(true);
  });

  it('function', function () {
    expect( is.function({}) ).to.eql(false);
    expect( is.function(function () {}) ).to.eql(true);
    expect( is.function('function() {}') ).to.eql(false);
    /* jshint evil: true */
    expect( is.function(new Function())).to.eql(true);
  });

  it('undefined', function () {
    expect( is.undefined(0) ).to.eql(false);
    expect( is.undefined(null) ).to.eql(false);
    expect( is.undefined('undefined') ).to.eql(false);
    expect( is.undefined() ).to.eql(true);
    expect( is.undefined(undefined) ).to.eql(true);
  });

  it('equal', function () {
    expect( is.equal(1,1) ).to.eql(true);
    expect( is.equal(false, false) ).to.eql(true);
    expect( is.equal([1,2,3], [1,2,3]) ).to.eql(true);
    expect( is.equal({a:{b:1}}, {a:{b:1}}) ).to.eql(true);
    expect( is.equal([{a:1}],[{a:1}]) ).to.eql(true);
    expect( is.equal([{a:1}],[{a:2}]) ).to.eql(false);
    expect( is.equal({a:{b:1}},{a:{b:2}}) ).to.eql(false);
  });

});
