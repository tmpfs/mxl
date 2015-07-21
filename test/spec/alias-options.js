var expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')
  , config = require('../config')
  , program = require('../../lib/mxl')
  , constants = require('../../lib/constants')
  , Alias = require('../../lib/alias');

describe('mxl:', function() {

  it('should add alias and save option (--each)', function(done) {
    var args = [
      'alias', '--no-color',
      '@opt=./project/tmux.conf', '-e', '-c', './project'];
    var def = program(require(config.pkg), config.name)
      def.program.on('error', function(e) {
        console.dir(e)
      })
    def.program.on('complete', function(req) {
      expect(req.rc.alias.opt).to.be.an('object');
      expect(req.rc.alias.opt.key).to.eql('opt');
      expect(req.rc.alias.opt.file).to.eql(
        path.join(process.cwd(), 'project', constants.FILENAME));
      expect(req.rc.alias.opt.options).to.be.an('object');
      expect(req.rc.alias.opt.options.each).to.eql(true);
      expect(req.rc.alias.opt.cwd).to.be.an('array');
      done();
    })
    def.parse(args);
  });

  it('should run alias with saved --each option (@opt)', function(done) {
    var args = ['run', '--no-color', '@opt'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {

      // TODO: fix exec key collision when executing same file against
      // TODO: multiple targets

      expect(req.rc.alias.opt.options.each).to.eql(true);
      expect(req.launch.aliases.opt.cwd).to.be.an('array');
      done();
    })
    def.parse(args);
  });

  it('should run alias with saved options and --noop (@opt)', function(done) {
    var args = ['run', '--no-color', '@opt', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.opt.options.each).to.eql(true);
      expect(req.launch.aliases.opt.cwd).to.be.an('array');
      done();
    })
    def.parse(args);
  });

  it('should add alias and save option (--session)', function(done) {
    var args = [
      'alias', '--no-color',
      '@opt=./project/tmux.conf', '-s', 'mock'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.opt).to.be.an('object');
      expect(req.rc.alias.opt.key).to.eql('opt');
      expect(req.rc.alias.opt.file).to.eql(
        path.join(process.cwd(), 'project', constants.FILENAME));
      expect(req.rc.alias.opt.options).to.be.an('object');
      expect(req.rc.alias.opt.options.session).to.eql('mock');
      done();
    })
    def.parse(args);
  });

  it('should run alias with saved --session option (@opt)', function(done) {
    var args = ['run', '--no-color', '@opt', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.opt.options.session).to.eql('mock');
      done();
    })
    def.parse(args);
  });

  it('should run alias with saved --session option and wd', function(done) {
    var args = ['run', '--no-color', '@opt', '--noop', '-c', './project'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.opt.options.session).to.eql('mock');
      done();
    })
    def.parse(args);
  });

});
