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
    var args = ['source', '--noop'];
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
    var args = ['source', '--noop', '.'];
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
    var args = ['source', '--noop', '.', './', './tmux.conf'];
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
    var args = ['source', '--noop', '-c', PROJECT];
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
      var args = ['source', '--noop', PROJECT];
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

  // file: mxl/conf/tpl/vim/tmux.conf
  // cwd: test/fixtures/conf
  it('should use default working directory when global alias reference',
    function(done) {
      var args = ['source', '--noop', '@vim'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(req.launch.list.length).to.eql(1);

        var file = req.launch.list[0];
        expect(file).to.be.an('object');
        expect(file.cwd).to.be.a('string');
        expect(file.file).to.eql(
          path.join(process.env.MXL_TPL_BASE, 'vim', FILENAME));
        expect(file.cwd).to.eql(
          path.join(process.env.MXL_TEST_BASE));

        done();
      })
      def.parse(args);
    }
  );

  // file: test/fixtures/conf/tmux.conf
  // cwd: test/fixtures/conf
  it('should use default working directory when user alias reference',
    function(done) {
      var args = ['source', '--noop', '@mock'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(req.launch.list.length).to.eql(1);

        var file = req.launch.list[0];
        expect(file).to.be.an('object');
        expect(file.cwd).to.be.a('string');
        expect(file.file).to.eql(
          path.join(process.env.MXL_TEST_BASE, FILENAME));
        expect(file.cwd).to.eql(
          path.join(process.env.MXL_TEST_BASE));

        done();
      })
      def.parse(args);
    }
  );

  // file: test/fixtures/conf/tmux.conf
  // cwd: test/fixtures/conf/project
  it('should use working directory option with user alias reference',
    function(done) {
      var args = ['source', '--noop', '@mock', '-c', PROJECT];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(req.launch.list.length).to.eql(1);
        var file = req.launch.list[0];
        expect(file).to.be.an('object');
        expect(file.cwd).to.be.a('string');
        expect(file.file).to.eql(
          path.join(process.env.MXL_TEST_BASE, FILENAME));
        expect(file.cwd).to.eql(
          path.join(process.env.MXL_TEST_BASE, PROJECT));
        done();
      })
      def.parse(args);
    }
  );

  // file: test/fixtures/conf/tmux.conf
  // cwd: test/fixtures/conf
  // cwd: test/fixtures/conf/project
  it('should use multiple working directory options with user alias reference',
    function(done) {
      var args = ['source', '--noop', '@mock', '-c', PROJECT, '-c' ,'.'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        var map = req.launch.results.map
          , conf = path.join(process.env.MXL_TEST_BASE, FILENAME)
          , dir1 = process.env.MXL_TEST_BASE
          , dir2 = path.join(process.env.MXL_TEST_BASE, PROJECT);
        expect(map).to.be.an('object');
        expect(map[dir1]).to.be.an('array');
        expect(map[dir2]).to.be.an('array');
        expect(map[dir1][0].file).to.eql(conf);
        expect(map[dir2][0].file).to.eql(conf);
        expect(map[dir1][0].cwd).to.eql(dir1);
        expect(map[dir2][0].cwd).to.eql(dir2);
        done();
      })
      def.parse(args);
    }
  );

});
