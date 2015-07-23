var expect = require('chai').expect
  , path = require('path')
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should run index file (no command)', function(done) {
    var args = ['--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run with --recursive option (no command)', function(done) {
    var args = ['-r', '--noop'];
    var def = program(require(config.pkg), config.name)
    // NOTE: different event
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.be.gt(4);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      expect(path.basename(req.launch.map['conf/alt']))
        .to.eql('alt.tmux.conf');
      expect(path.basename(req.launch.map['deep/mock']))
        .to.eql('mock.tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run with --recursive option (w/ command)', function(done) {
    var args = ['source', '-r', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.be.gt(4);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      expect(path.basename(req.launch.map['conf/alt']))
        .to.eql('alt.tmux.conf');
      expect(path.basename(req.launch.map['deep/mock']))
        .to.eql('mock.tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run index file (w/ command)', function(done) {
    var args = ['source', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should filter result (-p alt)', function(done) {
    var args = ['-a', '-p', 'alt'];
    var def = program(require(config.pkg), config.name)
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map['conf/alt']))
        .to.eql('alt.tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run alias (@conf/alt)', function(done) {
    var args = ['@conf/alt'];
    var def = program(require(config.pkg), config.name)
    def.program.on('run:complete', function(req) {
      expect(req.launch.alias.length).to.eql(1);
      expect(path.basename(req.launch.aliases['conf/alt'].file))
        .to.eql('alt.tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run alias (@conf/alt) w/ run command', function(done) {
    var args = ['source', '@conf/alt'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.alias.length).to.eql(1);
      expect(path.basename(req.launch.aliases['conf/alt'].file))
        .to.eql('alt.tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run specific file', function(done) {
    var args = [
      '--noop', path.join(process.cwd(), 'tmux.conf')];
    var def = program(require(config.pkg), config.name)
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run specific file (w/ command)', function(done) {
    var args = [
      'source', '--noop', path.join(process.cwd(), 'tmux.conf')];
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
    var args = ['source', '--noop', '-c=.'];
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
    var args = ['source', '-a', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.map['conf']).to.be.a('string');
      expect(req.launch.map['conf/alt']).to.be.a('string');
      expect(req.launch.map['conf/mock']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

  it('should run all files (-a) w/ directory arg', function(done) {
    var args = ['source', '-a', '--noop', '.'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.map['conf']).to.be.a('string');
      expect(req.launch.map['conf/alt']).to.be.a('string');
      expect(req.launch.map['conf/mock']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

  it('should run w/ specific absolute working directory', function(done) {
    var args = [
      '--noop', '-c', process.cwd()];
    var def = program(require(config.pkg), config.name)
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run empty file by pattern (no command)', function(done) {
    var args = ['-a', '-p', 'empty'];
    var def = program(require(config.pkg), config.name)
    // NOTE: different event!
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map['conf/empty']))
        .to.eql('empty.tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run using index file (no command)', function(done) {
    var args = ['../index'];
    var def = program(require(config.pkg), config.name)
    // NOTE: different event!
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(
        path.dirname(req.launch.list[0].file))).to.eql('index');
      done();
    })
    def.parse(args);
  });

  it('should run using index file and alias (mixed)', function(done) {
    var args = ['source', '../index', '@conf'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(2);
      done();
    })
    def.parse(args);
  });

  it('should run with --session option (no command)', function(done) {
    var args = ['--noop', '--session', 'mock'];
    var def = program(require(config.pkg), config.name)
    def.program.on('run:complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run with --session option w/ command', function(done) {
    var args = ['source', '--noop', '--session', 'mock'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run using --each w/ --session', function(done) {
    var args = [
      'source', 'project', '-c', 'project', '--each',
      '--session', 'mock', '--noop'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

  it('should run using pattern with each', function(done) {
    var args = [
      'source', 'project', '-c', 'project', '--each',
      '-p', 'client', '-p', 'server'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

});
