var path = require('path')
  , fs = require('fs')
  , ptn = /\.tmux\.conf$/
  , spawnSync = require('child_process').spawnSync;

function strip(nm) {
  return path.basename(nm).replace(ptn, '');
}

function resolve(info, req, next) {
  //console.log('resolve: ' + req.dir)
  var files = [];
  if(!info.args.length) {
    files.push(path.join(process.cwd(), req.filename));
  }else{
    files = info.args; 
  }
  //console.dir(info.args)
  //console.dir(fs.readdir)
  fs.readdir(req.dir, function(err, listing) {
    if(err) {
      return next(err);
    }
    listing.forEach(function(file) {
      if(ptn.test(file)) {
        files.push(path.join(req.dir, file));
      }
    })
    next(null, files);
  });
}

function source(conf, info, req, next) {
  //console.log('source: ' + conf)
  var dir = path.dirname(conf);
  spawnSync(
    req.tmux, ['source-file'].concat(conf), {env: process.env, cwd: dir});
  next();
}

module.exports = {
  resolve: resolve,
  source: source,
  strip: strip,
}
