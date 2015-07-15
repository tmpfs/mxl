var expect = require('chai').expect
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should prune stale aliases', function(done) {
    var args = ['prune', '--no-color', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      console.dir('prune complete')
      done();
    })
    def.parse(args);
  });

});
