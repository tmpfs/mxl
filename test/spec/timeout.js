var expect = require('chai').expect
  , path = require('path')
  , fs = require('fs')
  , config = require('../config')
  , program = require('../../lib/mxl');

describe('mxl:', function() {

  var timeout;

  before(function(done) {
    var rc = require(process.env.MXL_RC_FILE);
    timeout = rc.timeout;
    rc.timeout = false;
    fs.writeFileSync(process.env.MXL_RC_FILE, JSON.stringify(rc, undefined, 2));
    done();
  })

  after(function(done) {
    var rc = require(process.env.MXL_RC_FILE);
    rc.timeout = timeout;
    fs.writeFileSync(process.env.MXL_RC_FILE, JSON.stringify(rc, undefined, 2));
    done(); 
  })

  it('should run install with timeout disabled',
    function(done) {
      var args = ['run', '--no-color'];
      var def = program(require(config.pkg), config.name)
      def.program.on('complete', function(req) {
        expect(req.launch.list.length).to.eql(1);
        expect(path.basename(req.launch.map.conf))
          .to.eql('tmux.conf');
        done();
      })
      def.parse(args);
    }
  );

});
