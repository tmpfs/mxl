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

  it('should error on profile match', function(done) {
    var args = ['--no-color', ':missing'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/profile/i);
      expect(fn).throws(/does not match/i);
      done();
    })
    def.parse(args);
  });

  it('should error on profile match w/ run command', function(done) {
    var args = ['run', '--no-color', ':missing'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/profile/i);
      expect(fn).throws(/does not match/i);
      done();
    })
    def.parse(args);
  });

  it('should error on ambiguous profile match', function(done) {
    var args = ['--no-color', ':(empty|alt)'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/ambiguous profile/i);
      done();
    })
    def.parse(args);
  });

  it('should error on ambiguous profile match w/ run command', function(done) {
    var args = ['run', '--no-color', ':(empty|alt)'];
    var def = program(require(config.pkg), config.name)
    def.program.on('error', function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/ambiguous profile/i);
      done();
    })
    def.parse(args);
  });

  it('should error on no files found', function(done) {
    var args = ['--no-color', '../empty'];
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


  it('should error on no files found w/ run command', function(done) {
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

  it('should find no files w/ ls command', function(done) {
    var args = ['ls', '-a', '--no-color', '../empty'];
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

  //it('should error on bad alias file name', function(done) {
    //var args = ['alias', '--no-color', '@foo=bar'];
    //var def = program(require(config.pkg), config.name)
    //def.program.once('complete', function(req) {
      //def = program(require(config.pkg), config.name);
      //expect(req.rc.alias.foo).to.eql('bar');
      //args = ['ls', '@foo'];
      //def.program.once('error', function(err) {
        //function fn() {
          //throw err;
        //}
        //expect(fn).throws(Error);
        //expect(fn).throws(/missing alias file/i);
        //done();
      //}) 
      //def.parse(args);
    //})
    //def.parse(args);
  //});

  //it('should error on missing alias file', function(done) {
    //var args = ['alias', '--no-color', '@foo=missing.tmux.conf'];
    //var def = program(require(config.pkg), config.name)
    //def.program.once('complete', function(req) {
      //console.dir(req.rc.alias)
      //def = program(require(config.pkg), config.name);
      //console.dir(req.rc.alias)
      //expect(req.rc.alias.foo).to.eql('missing.tmux.conf');
      //args = ['ls', '@foo'];
      //def.program.once('error', function(err) {
        //function fn() {
          //throw err;
        //}
        //expect(fn).throws(Error);
        //expect(fn).throws(/missing alias file/i);
        //done();
      //}) 
      //def.parse(args);
    //})
    //console.dir(args)
    //def.parse(args);
  //});


});
