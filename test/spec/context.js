var expect = require('chai').expect
  , path = require('path')
  , config = require('../config')
  , constants = require('../../lib/constants')
  , FILENAME = constants.FILENAME
  , PROJECT = 'project'
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  // file: test/fixtures/conf/tmux.conf
  // cwd: test/fixtures/conf
  it('should run with cwd (zero args)', function(done) {
    var args = ['run', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);

      var file = req.launch.list[0];
      expect(file).to.be.an('object');
      expect(file.cwd).to.be.a('string');
      expect(file.file).to.eql(
        path.join(process.env.MXL_TEST_BASE, FILENAME));
      expect(file.cwd).to.eql(process.env.MXL_TEST_BASE);
      done();
    })
    def.parse(args);
  });

  // file: test/fixtures/conf/tmux.conf
  // cwd: test/fixtures/conf
  it('should run with explicit index file by dir  (zero args)', function(done) {
    var args = ['run', '--noop', '.'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);

      var file = req.launch.list[0];
      expect(file).to.be.an('object');
      expect(file.cwd).to.be.a('string');
      expect(file.file).to.eql(
        path.join(process.env.MXL_TEST_BASE, FILENAME));
      expect(file.cwd).to.eql(process.env.MXL_TEST_BASE);
      done();
    })
    def.parse(args);
  });

  // all arguments resolve to ./tmux.conf and should be de-duplicated
  // file: test/fixtures/conf/tmux.conf
  // cwd: test/fixtures/conf
  it('should not duplicate exact path matches', function(done) {
    var args = ['run', '--noop', '.', './', './tmux.conf'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      var file = req.launch.list[0];
      expect(file).to.be.an('object');
      expect(file.cwd).to.be.a('string');
      expect(file.file).to.eql(
        path.join(process.env.MXL_TEST_BASE, FILENAME));
      expect(file.cwd).to.eql(process.env.MXL_TEST_BASE);
      done();
    })
    def.parse(args);
  });

  // file: test/fixtures/conf/tmux.conf
  // cwd: test/fixtures/conf/project
  it('should run index file with explicit working directory', function(done) {
    var args = ['run', '--noop', '-c', PROJECT];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);

      var file = req.launch.list[0];
      expect(file).to.be.an('object');
      expect(file.cwd).to.be.a('string');
      expect(file.file).to.eql(
        path.join(process.env.MXL_TEST_BASE, FILENAME));
      expect(file.cwd).to.eql(path.join(process.env.MXL_TEST_BASE, PROJECT));

      done();
    })
    def.parse(args);
  });

  // file: test/fixtures/conf/tmux.conf
  // cwd: test/fixtures/conf/project
  it('should use file parent directory on index file resolve from dir arg',
    function(done) {
      var args = ['run', '--noop', PROJECT];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(req.launch.list.length).to.eql(1);

        var file = req.launch.list[0];
        expect(file).to.be.an('object');
        expect(file.cwd).to.be.a('string');
        expect(file.file).to.eql(
          path.join(process.env.MXL_TEST_BASE, PROJECT, FILENAME));
        expect(file.cwd).to.eql(
          path.join(process.env.MXL_TEST_BASE, PROJECT));

        done();
      })
      def.parse(args);
    }
  );

});
