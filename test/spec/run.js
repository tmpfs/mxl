var expect = require('chai').expect
  , path = require('path')
  , config = {name: 'mxl'}
  , pkg = '../../package.json'
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should run files', function(done) {
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

  it('should run all files (-a)', function(done) {
    var args = ['run', '-a', '--no-color', '--noop'];
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      //console.dir(req.launch)
      done();
    })
    def.parse(args);
  });

  //it('should list files in directory', function(done) {
    //var args = ['ls', '--no-color', '.'];
    //var def = program(require(pkg), config.name)
    //def.program.on('complete', function(req) {
      ////console.dir(req.launch)
      //expect(req.launch.map['conf-alt']).to.be.a('string');
      //expect(req.launch.map['conf-mock']).to.be.a('string');
      //done();
    //})
    //def.parse(args);
  //});

});
