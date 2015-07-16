var expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')
  , config = require('../config')
  , program = require('../../lib/mxl')
  , Alias = require('../../lib/alias');

describe('mxl:', function() {

  it('should add alias', function(done) {
    var args = ['alias', '--no-color', '@foo=bar'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.foo).to.eql(path.join(process.cwd(), 'bar'));
      done();
    })
    def.parse(args);
  });

  it('should list aliases', function(done) {
    var args = ['alias', '--no-color'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

  it('should update alias', function(done) {
    var args = ['alias', '--no-color', '--noop', '@foo=baz'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.foo).to.eql(path.join(process.cwd(), 'baz'));
      done();
    })
    def.parse(args);
  });

  it('should get alias', function(done) {
    var args = ['alias', '--no-color', '--noop', '@foo', '@missing'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

  it('should delete alias', function(done) {
    var args = ['alias', '--no-color', '--noop', '@foo=', '../'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.foo).to.eql(undefined);
      done();
    })
    def.parse(args);
  });

  it('should add valid alias reference and run alias', function(done) {
    var args = ['alias', '--no-color', '@foo=./alt.tmux.conf'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      //console.dir(req.rc.alias);
      expect(req.rc.alias.foo).to.eql(
        path.join(process.cwd(), 'alt.tmux.conf'));
      args = ['run', '--noop', '@foo'];
      def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(req.rc.alias.foo).to.eql(
          path.join(process.cwd(), 'alt.tmux.conf'));
        done();
      });
      def.parse(args);
    })
    def.parse(args);
  });

  it('should write alias file', function(done) {
    var args = ['ls', '--no-color'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      var alias = new Alias(this.configure(), req)
        , file = path.join(
            process.cwd(), '..', '..', '..', 'target', 'mock-mxlrc.json');
      alias.set('foo', 'bar');
      alias.write(file);
      expect(fs.existsSync(file)).to.eql(true);
      var rc = alias.read(file);
      expect(rc.alias.foo).to.eql(path.join(process.cwd(), 'bar'));
      done();
    })
    def.parse(args);
  });

});
