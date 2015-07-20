var fs = require('fs');

function copy(source, target, cb) {
  var cbCalled = false;
  var rd = fs.createReadStream(source);
  rd.on("error", done);
  var wr = fs.createWriteStream(target);
  wr.on("error", done);
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);
  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

module.exports = function install(info, req, next) {
  console.dir('install called')
  console.dir(req.launch.alias)
  console.dir(req.launch.aliases)
  console.dir(req.vars)
  next();
}
