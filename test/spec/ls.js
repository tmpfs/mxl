var expect = require('chai').expect
  , config = {name: 'mxl'}
  , pkg = '../../package.json'
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should list files', function(done) {
    var args = ['ls'];
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

  it('should list all files (-a)', function(done) {
    var args = ['ls', '-a'];
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

});
