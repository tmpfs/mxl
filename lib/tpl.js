var path = require('path')
  , base = path.normalize(path.join(__dirname, '..', 'conf', 'tpl'))
  , utils = require('./util')
  , file = utils.file
  , folder = utils.folder
  , find = require('fs-find');

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

function finder(info, req, next) {
  var opts = {file: file, folder: folder};
  find(base, opts, next);
}

module.exports = {
  find: finder,
  copy: copy,
}
