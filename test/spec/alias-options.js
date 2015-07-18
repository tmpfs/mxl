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
      'alias', '--no-color', '@opt=./project/tmux.conf', '-e', '-c', './project'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      expect(req.rc.alias.opt).to.be.an('object');
      expect(req.rc.alias.opt.key).to.eql('opt');
      expect(req.rc.alias.opt.file).to.eql(
        path.join(process.cwd(), 'project', constants.FILENAME));
      expect(req.rc.alias.opt.options).to.be.an('object');
      expect(req.rc.alias.opt.options.each).to.eql(true);
      expect(req.rc.alias.opt.cwd).to.eql(
        path.join(process.cwd(), 'project'));
      done();
    })
    def.parse(args);
  });

  it('should run alias with saved options (@opt)', function(done) {
    var args = ['run', '--no-color', '@opt'];
    var def = program(require(config.pkg), config.name)
    def.program.on('complete', function(req) {
      var res = req.reparse[0];
      // TODO: fix exec key collision when executing same file against
      // TODO: multiple targets
      //console.dir(res.launch.exec);
      done();
    })
    def.parse(args);
  });

});
