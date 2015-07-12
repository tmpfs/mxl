var path = require('path')
  , fs = require('fs')
  , ptn = /\.?tmux\.conf$/
  , exec = require('child_process').exec;

function strip(nm) {
  return path.basename(nm).replace(ptn, '');
}

function key(nm) {
  var prefix = path.basename(path.dirname(nm));
  if(path.basename(nm) === 'tmux.conf') {
    return prefix;
  }
  return prefix + '-' + path.basename(nm).replace(/(\.tmux)?\.conf$/, '');
}

function resolve(info, req, next) {
  var files = []
    , launch = req.launch;

  if(launch.single) {
    if(fs.existsSync(path.join(req.dir, req.filename))) {
      files.push(path.join(req.dir, req.filename));
    }
    return next(null, files);
  }

  // TODO: support multiple search directories
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
  var dir = path.dirname(conf);
  var cmd = [req.tmux].concat('source-file', conf);
  cmd = cmd.join(' ');
  //console.log('source %s', conf);
  exec(cmd, {env: process.env, cwd: req.cwd}, function(err, stdout, stderr) {
    if(err) {
      return next(err);
    } 
    next();
  })
}

function reduce(list, profiles) {
  var out = [];
  var i, re, match;
  for(i = 0;i < profiles.length;i++) {
    match = false;
    try {
      re = new RegExp(profiles[i]);
    }catch(e) {
      throw e; 
    }
    list.forEach(function(item){
      if(re.test(item)) {
        match = true;
        out.push(item);
      }
    })
    if(!match) {
      console.warn('profile %s does not match', profiles[i]);
    }
  }
  return out;
}

module.exports = {
  resolve: resolve,
  reduce: reduce,
  source: source,
  strip: strip,
  key: key,
}
