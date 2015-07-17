var expect = require('chai').expect
  , path = require('path')
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should run index file on directory child folders (--each)',
    function(done) {
      var args = ['--no-color', '--noop', '-c', 'project', '--each'];
      var def = program(require(config.pkg), config.name)
      def.program.on('run:complete', function(req) {
        var files = req.launch.find.files;
        expect(Boolean(~files.indexOf('project/comp1'))).to.eql(true);
        expect(Boolean(~files.indexOf('project/comp2'))).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run index file on directory child folders w/ cwd (--each)',
    function(done) {
      var args = ['--no-color', '--noop', '--each'];
      var def = program(require(config.pkg), config.name)
      def.program.on('run:complete', function(req) {
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

});
