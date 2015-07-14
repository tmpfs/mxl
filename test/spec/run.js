var expect = require('chai').expect
  , path = require('path')
  , config = {name: 'mxl'}
  , pkg = '../../package.json'
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should run index file (no command)', function(done) {
    var args = ['--no-color', '--noop'];
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      //console.dir(req.launch)
      expect(req.launch.list.length).to.eql(1);
      expect(path.basename(req.launch.map.conf))
        .to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should select file (:alt)', function(done) {
    var args = ['--no-color', '--noop', ':alt'];
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      //console.dir(req.launch)
      //expect(req.launch.list.length).to.eql(1);
      //expect(path.basename(req.launch.map.conf))
        //.to.eql('tmux.conf');
      done();
    })
    def.parse(args);
  });

  it('should run index file (w/ command)', function(done) {
    var args = ['run', '--no-color', '--noop'];
    var def = program(require(pkg), config.name)
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
    var def = program(require(pkg), config.name)
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
    var def = program(require(pkg), config.name)
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
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.map['conf']).to.be.a('string');
      expect(req.launch.map['conf-mock']).to.be.a('string');
      expect(req.launch.map['conf-mock']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

});
