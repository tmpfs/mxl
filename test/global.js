var path = require('path')
  , fs = require('fs')
  , info = console.info;

process.env.MXL_RC_HOME = path.join(process.cwd(), 'target');
process.chdir('test/fixtures/conf');

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
