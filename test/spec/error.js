var expect = require('chai').expect
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should error on missing source file', function(done) {
    var args = ['--no-color', '../missing.tmux.conf'];
    var def = program(require(config.pkg), config.name)
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

  it('should error on missing source file w/ run command', function(done) {
    var args = ['run', '--no-color', '../missing.tmux.conf'];
    var def = program(require(config.pkg), config.name)
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

  it('should error on no files found', function(done) {
    var args = ['run', '--no-color', '../empty'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/no files found/i);
      done();
    })
    def.parse(args);
  });

  it('should error on bad profile regexp', function(done) {
    var args = ['run', '--no-color', ':+'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/nothing to repeat/i);
      done();
    })
    def.parse(args);
  });


});
