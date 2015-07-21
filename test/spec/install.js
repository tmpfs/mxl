var expect = require('chai').expect
  , path = require('path')
  , fs = require('fs')
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  before(function(done) {
    process.chdir(process.env.MXL_TEST_TARGET);
    done(); 
  })

  after(function(done) {
    process.chdir(process.env.MXL_TEST_BASE);
    done(); 
  })

  it('should run install with system alias reference',
    function(done) {
      var args = ['install', '--no-color', '@home'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(fs.existsSync('tmux.conf')).to.eql(true);
        done();
      })
      def.parse(args);
    }
  );

});
