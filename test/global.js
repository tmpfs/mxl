var path = require('path')
  , fs = require('fs')
  , info = console.info
  , config = require('./config')
  , program = require('../lib/mxl');

//throw new Error('mock error');

process.env.MXL_RC_NAME = '.mxlrc.json';
process.env.MXL_RC_HOME = 
process.env.MXL_TEST_TARGET = path.join(process.cwd(), 'target');
process.env.MXL_TEST_BASE = path.join(process.cwd(), 'test/fixtures/conf');
process.env.MXL_RC_FILE = path.join(
  process.env.MXL_RC_HOME, process.env.MXL_RC_NAME);
process.env.MXL_TPL_BASE = path.join(process.cwd(), 'conf', 'tpl');

process.chdir(process.env.MXL_TEST_BASE);

before(function(done) {
  console.info = function(){};

  // set up default mock aliases
  var args = ['alias', '@stale=non-existent', '@mock=./tmux.conf'];
  var def = program(require('../package.json'), config.name)
  def.program.on('complete', function(req) {
    done();
  })
  def.parse(args);
});

after(function(done) {
  console.info = info;
  done();
});
