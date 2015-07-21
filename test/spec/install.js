var expect = require('chai').expect
  , path = require('path')
  , fs = require('fs')
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  before(function(done) {
    process.chdir(process.env.MXL_TEST_TARGET);

    // mock stale alias (missing alias source file)
    var args = ['alias', '--no-color', '@stale=non-existent'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  })

  after(function(done) {
    process.chdir(process.env.MXL_TEST_BASE);
    done(); 
  })

  afterEach(function(done) {
    var files = ['tmux.conf', 'home.tmux.conf'];
    files.forEach(function(file) {
      if(fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    })
    done();
  })

  it('should run install with system alias reference',
    function(done) {
      var args = ['install', '--no-color', '@home'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run install with system alias reference and default file name',
    function(done) {
      var args = ['install', '--no-color', '@home=tmux.conf'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run install with system alias reference and custom file name',
    function(done) {
      var args = ['install', '--no-color', '@home=home'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('home.tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run install with system alias reference and custom name/extension',
    function(done) {
      var args = ['install', '--no-color', '@home=home.tmux.conf'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('home.tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  // errors
  it('should error on install name conflict', function(done) {
    var args = ['install', '--no-color', '@vim', '@git'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      expect(err.code).to.be.gt(0);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/destination file conflict/i);
      done();
    })
    def.parse(args);
  });

  it('should error on stale alias file (@stale)', function(done) {
    var args = ['install', '--no-color', '@stale'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      expect(err.code).to.be.gt(0);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/has stale file/i);
      done();
    })
    def.parse(args);
  });

});