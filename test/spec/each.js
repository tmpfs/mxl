var expect = require('chai').expect
  , path = require('path')
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should run index file on directory child folders (--each)',
    function(done) {
      var args = ['run', '--noop', '-c', 'project', '--each'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        var files = req.launch.find.files;
        expect(Boolean(
          ~files.indexOf(process.cwd() + '/project/client'))).to.eql(true);
        expect(Boolean(
          ~files.indexOf(process.cwd() + '/project/db'))).to.eql(true);
        expect(Boolean(
          ~files.indexOf(process.cwd() + '/project/server'))).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run index file on directory child folders w/ cwd (--each)',
    function(done) {
      var args = ['run', '--noop', '--each'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        var files = req.launch.find.files;
        expect(
          Boolean(~files.indexOf(process.cwd() + '/deep'))).to.eql(true);
        expect(
          Boolean(~files.indexOf(process.cwd() + '/project'))).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run index file on directory child folders w/ pattern (--each)',
    function(done) {
      var args = ['run', '--noop', '-c', 'project', '--each', '-p', 'db'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        var files = req.launch.find.files;
        expect(Boolean(
          ~files.indexOf(process.cwd() + '/project/client'))).to.eql(false);
        expect(Boolean(
          ~files.indexOf(process.cwd() + '/project/db'))).to.eql(true);
        expect(Boolean(
          ~files.indexOf(process.cwd() + '/project/server'))).to.eql(false);
        done();
      })
      def.parse(args);
    }
  );

});
