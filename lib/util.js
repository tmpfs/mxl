var path = require('path')
  , util = require('util')
  , fs = require('fs')
  , find = require('fs-find')
  , ptn = /^(tmux\.conf|.+\.tmux\.conf)$/
  , exec = require('child_process').exec;

function folder(path, info) {
  if(/^(\.git|node_modules)$/.test(info.matcher)) {
    return false;
  }
  return true;
}

function file(path, info) {
  if(info.name === 'tmux.conf' || /.+\.tmux\.conf$/.test(info.name)) {
    //console.info('file %s', info.file)
    return true;
  }
  return false;
}

function key(nm) {
  var prefix = path.basename(path.dirname(nm));
  if(path.basename(nm) === 'tmux.conf') {
    return prefix;
  }
  return prefix + '-' + path.basename(nm).replace(/(\.tmux)?\.conf$/, '');
}

function resolve(info, req, next) {
  var launch = req.launch
    , files = launch.files;

  if(!launch.dirs.length && launch.files.length) {
    return next(null, launch.files);
  }
  search(info, req, next);
}

function search(info, req, next) {
  var files = req.launch.files
    , dirs = req.launch.dirs.slice(0)
    , current = dirs.shift();

  if(req.recursive) {
    return find(req.launch.dirs, {folder: folder, file: file}, next);
  }

  function read(dir, next) {
    var list = [];

    fs.readdir(dir, function(err, listing) {
      /* istanbul ignore next: difficult to mock */
      if(err) {
        return next(err);
      }
      //if(req.recursive) {
        //return find(dir, )
      //}
      listing.forEach(function(file) {
        var fpath = path.join(dir, file)
          , stat;
        /* istanbul ignore next: difficult to mock */
        try {
          stat = fs.statSync(fpath);
        }catch(e) {
          return next(e);
        }
        if(stat.isFile() && ptn.test(file)) {
          list.push(fpath);
        }
      })
      next(null, list);
    });
  }

  function onread(err, list) {
    /* istanbul ignore next: difficult to mock */
    if(err) {
      return next(err);
    }
    files = files.concat(list);
    current = dirs.shift();
    if(!current) {
      return next(null, files);
    }

    read(current, onread); 
  }

  read(current, onread); 
}

function source(conf, info, req, next) {
  var dir = path.dirname(conf);
  var cmd = [req.tmux].concat('source-file', conf);
  cmd = cmd.join(' ');
  var cwd = req.cwd;
  var noop = req.result.flags.noop;
  if(cwd === undefined) {
    cwd = path.dirname(conf); 
  }
  console.info(':source-file %s (cwd: %s)', conf, cwd);
  if(noop) {
    return next();
  }
  var env = {
    mxl_file: conf,
    mxl_filename: path.basename(conf),
    mxl_cwd: cwd,
    mxl_cwdname: path.basename(cwd)
  };
  var envcmd = '';
  for(var k in env) {
    envcmd += util.format('tmux set-environment -g %s "%s";', k, env[k]);
  }
  exec(envcmd + cmd, {env: process.env, cwd: cwd}, function(err, stdout, stderr) {
    if(err) {
      return next(err);
    } 
    //console.info(stdout);
    next();
  })
}

function reduce(list, profiles, req) {
  var out = [], i, re, cache, e;

  for(i = 0;i < profiles.length;i++) {
    cache = [];
    try {
      re = new RegExp(profiles[i]);
    }catch(e) {
      throw e; 
    }
    list.forEach(function(item) {
      var nm = path.basename(item);
      // use parent directory name for tmux.conf match
      // for :profile matches
      if(nm === req.filename) {
        nm = path.basename(path.dirname(item));
      }
      if(re.test(nm)) {
        cache.push(item);
        out.push(item);
      }
    })
    if(!cache.length) {
      e = new Error('pattern %s does not match');
      e.parameters = [profiles[i]];
      throw e;
    }else if(cache.length > 1 && !req.all) {
      e = new Error('ambiguous pattern %s, %s');
      e.parameters = [profiles[i], cache.join(', ')];
      throw e;
    }
  }
  return out;
}

module.exports = {
  resolve: resolve,
  reduce: reduce,
  source: source,
  search: search,
  key: key,
  folder: folder,
  file: file,
  ptn: ptn
}
