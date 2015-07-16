var fs = require('fs')
  , path = require('path')
  , uniq = require('../uniq')
  , utils = require('../util')
  , key = utils.key
  , search = utils.search
  , walk = require('../walk')
  , Alias = require('../alias');

function folder(path, info) {
  if(/^(\.git|node_modules)$/.test(info.matcher)) {
    return false;
  }
  return true;
}

function file(path, info) {
  if(info.name === 'tmux.conf' || /.+\.tmux\.conf$/.test(info.name)) {
    console.info('file %s', info.file)
    return true;
  }
  return false;
}


module.exports = function generate(info, req, next) {
  var alias = new Alias(this.configure(), req)
    , dirs = req.launch.list;

  dirs = dirs.map(function(file) {
    return path.dirname(file);
  })

  req.launch.dirs = req.launch.dirs.concat(dirs);
  req.launch.dirs = req.launch.dirs.filter(uniq);

  var opts = {
    paths: req.launch.dirs, folder: folder, file: file
  };

  function done(err, files) {
    if(err) {
      return next(err);
    }
    var changed = false;
    files.forEach(function(v) {
      v = v.file;
      var k = key(v); 
      console.info('set %s=%s', k, v);
      alias.set(k, v);
      changed = true;
    })

    if(!req.noop && changed) {
      alias.write();
    }
    next();
  }

  walk(opts, done);
}
