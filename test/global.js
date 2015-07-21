var path = require('path')
  , fs = require('fs')
  , info = console.info;

process.env.MXL_RC_NAME = '.mxlrc.json';
process.env.MXL_RC_HOME = 
process.env.MXL_TEST_TARGET = path.join(process.cwd(), 'target');
process.env.MXL_TEST_BASE = path.join(process.cwd(), 'test/fixtures/conf');
process.env.MXL_RC_FILE = path.join(
  process.env.MXL_RC_HOME, process.env.MXL_RC_NAME);

process.chdir(process.env.MXL_TEST_BASE);

function clean() {
  var names = [
    'fixtures-error',
    'conf',
    'conf-empty',
    'conf-alt',
    'index',
    'foo'
  ];
  var file = path.join(process.env.HOME, '.mxlrc.json'), rc;
  if(fs.existsSync(file)) {
    try {
      rc = require(file);
    }catch(e) {}

    if(rc && rc.alias) {
      names.forEach(function(name) {
        delete rc.alias[name] ;
      }) 
      fs.writeFileSync(file, JSON.stringify(rc, undefined, 2));
    }
  }
}

before(function(done) {
  console.info = function(){};
  //clean();
  done();
});

after(function(done) {
  console.info = info;
  //clean();
  done();
});
