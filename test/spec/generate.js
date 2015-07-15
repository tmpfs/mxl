var expect = require('chai').expect
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should index directory', function(done) {
    var args = [
      'index', '--no-color', '../conf', '../index', '../empty', '../'];

    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.index).to.be.a('string');
      expect(req.rc.alias.conf).to.be.a('string');
      expect(req.rc.alias['conf-alt']).to.be.a('string');
      expect(req.rc.alias['conf-empty']).to.be.a('string');
      expect(req.rc.alias['conf-mock']).to.be.a('string');
      expect(req.rc.alias['fixtures-error']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

  it('should index directory w/ noop', function(done) {
    var args = [
      'index', '--no-color', '--noop',
      '../conf', '../index', '../empty', '../'];

    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.index).to.be.a('string');
      expect(req.rc.alias.conf).to.be.a('string');
      expect(req.rc.alias['conf-alt']).to.be.a('string');
      expect(req.rc.alias['conf-empty']).to.be.a('string');
      expect(req.rc.alias['conf-mock']).to.be.a('string');
      expect(req.rc.alias['fixtures-error']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

});
