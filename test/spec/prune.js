var expect = require('chai').expect
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should prune stale aliases w/ --noop', function(done) {
    var args = ['alias', '@missing=non-existent.tmux.conf'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.missing.file).to.be.a('string');
      args = ['prune', '--noop'];
      def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(req.rc.alias.missing).to.eql(undefined);
        done();
      })
      def.parse(args);
    })
    def.parse(args);
  });

  it('should prune stale aliases', function(done) {
    var args = ['alias', '@missing=non-existent.tmux.conf'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.missing.file).to.be.a('string');
      args = ['prune'];
      def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(req.rc.alias.missing).to.eql(undefined);
        done();
      })
      def.parse(args);
    })
    def.parse(args);
  });

});
