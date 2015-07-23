var expect = require('chai').expect
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should index directory', function(done) {
    var args = [
      'index', '../conf', '../index', '../empty', '../'];

    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.index.file).to.be.a('string');
      expect(req.rc.alias.conf.file).to.be.a('string');
      expect(req.rc.alias['conf/alt'].file).to.be.a('string');
      expect(req.rc.alias['conf/empty'].file).to.be.a('string');
      expect(req.rc.alias['conf/mock'].file).to.be.a('string');
      expect(req.rc.alias['fixtures/error'].file).to.be.a('string');
      done();
    })
    def.parse(args);
  });

  it('should index directory w/ noop', function(done) {
    var args = [
      'index', '--noop',
      '../conf', '../index', '../empty'];

    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.index.file).to.be.a('string');
      expect(req.rc.alias.conf.file).to.be.a('string');
      expect(req.rc.alias['conf/alt'].file).to.be.a('string');
      expect(req.rc.alias['conf/empty'].file).to.be.a('string');
      expect(req.rc.alias['conf/mock'].file).to.be.a('string');
      expect(req.rc.alias['fixtures/error'].file).to.be.a('string');
      done();
    })
    def.parse(args);
  });

});
