var expect = require('chai').expect
  , path = require('path')
  , fs = require('fs')
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  beforeEach(function(done) {
    process.chdir(process.env.MXL_TEST_TARGET);
    done();
  })

  afterEach(function(done) {
    var files = [
      'tmux.conf',
      'home.tmux.conf',
      'vim.tmux.conf',
      'git.tmux.conf'
    ];
    files.forEach(function(file) {
      if(fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    })
    process.chdir(process.env.MXL_TEST_BASE);
    done();
  })

  it('should run install with system alias reference',
    function(done) {
      var args = ['install', '@scratch'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run install with system alias reference and specific dir (-c)',
    function(done) {
      var args = ['install', '@scratch', '-c', '.'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run install with system alias reference and --noop',
    function(done) {
      var args = ['install', '@scratch', '--noop'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('tmux.conf')).to.eql(false);
        done();
      })
      def.parse(args);
    }
  );

  it('should run install with alias references',
    function(done) {
      var args = ['install', '@vim=vim', '@git=git'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('vim.tmux.conf')).to.eql(true);
        expect(fs.existsSync('git.tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );


  it('should run install with system alias reference and default file name',
    function(done) {
      var args = ['install', '@scratch=tmux.conf'];
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
      var args = ['install', '@scratch=home'];
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
      var args = ['install', '@scratch=home.tmux.conf'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('home.tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  it('should run install and prefer assignment over reference',
    function(done) {
      var args = ['install', '@scratch=home.tmux.conf', '@scratch'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('home.tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

  // errors
  it('should error on too few arguments', function(done) {
    var args = ['install'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      expect(err.code).to.be.gt(0);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/too few arguments/i);
      done();
    })
    def.parse(args);
  });

  it('should error on unknown alias', function(done) {
    var args = ['install', '@unknown=mock'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      expect(err.code).to.be.gt(0);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/alias not found/i);
      done();
    })
    def.parse(args);
  });

  it('should error on install name conflict', function(done) {
    var args = ['install', '@vim', '@git'];
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
    var args = ['install', '@stale'];
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

  it('should error on overwrite without --force', function(done) {

    // create the file (cleaned after each spec)
    fs.writeFileSync('tmux.conf', '# mock conf file');

    var args = ['install', '@scratch'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      expect(err.code).to.be.gt(0);
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/exists/i);
      expect(fn).throws(/overwrite/i);
      done();
    })
    def.parse(args);
  });

});
