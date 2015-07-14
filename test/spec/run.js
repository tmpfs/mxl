var expect = require('chai').expect
  , path = require('path')
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should run index file (no command)', function(done) {
    var args = ['--no-color', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should select file (:alt)', function(done) {
    var args = ['--no-color', '--noop', ':alt'];
    var def = program(require(config.pkg), config.name)
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map['conf-alt']))
        .to.eql('alt.tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run index file (w/ command)', function(done) {
    var args = ['run', '--no-color', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run specific file', function(done) {
    var args = [
      '--no-color', '--noop', path.join(process.cwd(), 'tmux.conf')];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run specific file (w/ command)', function(done) {
    var args = [
      'run', '--no-color', '--noop', path.join(process.cwd(), 'tmux.conf')];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run files (w/ cwd)', function(done) {
    var args = ['run', '--no-color', '--noop', '-c=.'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run all files (-a)', function(done) {
    var args = ['run', '-a', '--no-color', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.map['conf']).to.be.a('string');
      expect(req.launch.map['conf-mock']).to.be.a('string');
      expect(req.launch.map['conf-mock']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

  it('should run all files (-a) w/ directory arg', function(done) {
    var args = ['run', '-a', '--no-color', '--noop', '.'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.map['conf']).to.be.a('string');
      expect(req.launch.map['conf-mock']).to.be.a('string');
      expect(req.launch.map['conf-mock']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

  it('should run w/ specific absolute working directory', function(done) {
    var args = [
      '--no-color', '--noop', '-c', process.cwd()];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run empty file by profile (no command)', function(done) {
    var args = ['--no-color', ':empty'];
    var def = program(require(config.pkg), config.name)
    // NOTE: different event!
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map['conf-empty']))
        .to.eql('empty.tmux.conf');
      done();
    })
    def.parse(args);
  });

});
