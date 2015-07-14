var expect = require('chai').expect
  , config = {name: 'mxl'}
  , pkg = '../../package.json'
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should error on missing source file', function(done) {
    var args = ['run', '--no-color', '../missing.tmux.conf'];
    var def = program(require(pkg), config.name)
    def.program.on('error', function(err) {
      expect(err.code).to.eql(1);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/no such file or directory/i);
      done();
    })
    def.parse(args);
  });

});
