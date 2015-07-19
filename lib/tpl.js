var path = require('path')
  , base = path.normalize(path.join(__dirname, '..', 'conf', 'tpl'))
  , utils = require('./util')
  , file = utils.file
  , folder = utils.folder
  , cached 
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

function finder(next) {
  if(cached) {
    return next(err, cached);
  }
  var opts = {file: file, folder: folder};
  find(base, opts, function onFind(err, results) {
    if(err) {
      return next(err) ;
    } 
    cached = results
    next(null, results);
  });
}

module.exports = {
  find: finder,
  copy: copy,
}
