var expect = require('chai').expect
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  it('should list files', function(done) {
    var args = ['ls', '--no-color'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

  it('should list all files (-a)', function(done) {
    var args = ['ls', '-a', '--no-color'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      done();
    })
    def.parse(args);
  });

  it('should list files in directory', function(done) {
    var args = ['ls', '-a', '--no-color', '.'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.map['conf-alt']).to.be.a('string');
      expect(req.launch.map['conf-mock']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

  it('should list files in directory w/ --recursive', function(done) {
    var args = ['ls', '-r', '--no-color', '.'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.map['deep-mock']).to.be.a('string');
      done();
    })
    def.parse(args);
  });

  it('should list files in multiple directories', function(done) {
    var args = ['ls', '-a', '--no-color', '.', '../', '../empty'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.launch.map['conf']).to.be.a('string');
      expect(req.launch.map['conf-empty']).to.be.a('string');
      expect(req.launch.map['conf-alt']).to.be.a('string');
      expect(req.launch.map['conf-mock']).to.be.a('string');
      expect(req.launch.map['fixtures-error']).to.be.a('string');
      done();
    })
    def.parse(args);
  });


});
