var path = require('path')
  , util = require('util')
  , fs = require('fs')
  , ptn = /^(tmux\.conf|.+\.tmux\.conf)$/
  , exec = require('child_process').exec;

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

  function read(dir, next) {
    var list = [];
    fs.readdir(dir, function(err, listing) {
      /* istanbul ignore next: difficult to mock */
      if(err) {
        return next(err);
      }
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
  exec(cmd, {env: process.env, cwd: cwd}, function(err, stdout, stderr) {
    /* istanbul ignore next */
    /**
     *  File existence already tested
     *  and tmux never errors on source-file if 
     *  the file exists, maintained in case the tmux 
     *  behaviour changes.
     */
    if(err) {
      return next(err);
    } 
    next();
  })
}

function reduce(list, profiles, req) {
  var out = [], i, re, cache;

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
      throw new Error(
        util.format('profile :%s does not match', profiles[i]));
    }else if(cache.length > 1) {
      throw new Error(
        util.format('ambiguous profile %s: %s', profiles[i], cache.join(', ')));
    }
  }
  return out;
}

module.exports = {
  resolve: resolve,
  reduce: reduce,
  source: source,
  key: key,
  ptn: ptn
}
