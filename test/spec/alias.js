var expect = require('chai').expect
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should list aliases', function(done) {
    var args = ['alias', '--no-color'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

  it('should add alias', function(done) {
    var args = ['alias', '--no-color', '--noop', '@foo=bar'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.foo).to.eql('bar');
      done();
    })
    def.parse(args);
  });

  it('should update alias', function(done) {
    var args = ['alias', '--no-color', '--noop', '@foo=baz'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.foo).to.eql('baz');
      done();
    })
    def.parse(args);
  });

  it('should get alias', function(done) {
    var args = ['alias', '--no-color', '--noop', '@foo'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

  it('should delete alias', function(done) {
    var args = ['alias', '--no-color', '--noop', '@foo=', '../'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.foo).to.eql(undefined);
      done();
    })
    def.parse(args);
  });

});
