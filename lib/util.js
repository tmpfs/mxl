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
    return true;
  }
  return false;
}

function key(nm) {
  var prefix = path.basename(path.dirname(nm));
  if(path.basename(nm) === 'tmux.conf') {
    return prefix;
  }
  return prefix + '/' + path.basename(nm).replace(/(\.tmux)?\.conf$/, '');
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

function run(list, info, req, next) {
  list = list.slice(0);

  session(info, req, function(err) {
    /* istanbul ignore next: awkward to mock */
    if(err) {
      return next(err) ;
    }
    function start(list) { 
      var runner = list.shift();

      function onSourceComplete(err, res) {
        if(err) {
          return next(err);
        }

        runner = list.shift();

        // all done
        if(!runner) {
          return next();
        }

        function showNext() {
          source(runner, info, req, onSourceComplete);
        }

        // TODO: allow disabling timeout
        setTimeout(showNext, req.rc.timeout);
      }
      source(runner, info, req, onSourceComplete);
    }
    start(list);
  });
}

function session(info, req, next) {
  if(!req.session) {
    return next();
  }

  var cmd = [req.tmux].concat(
    'source-file',
    path.join(__dirname, '..', 'conf', 'session.tmux.conf')).join(' ');

  var key = req.session;
  cmd = req.tmux + ' set-environment -g mxl_key ' + key + ';' + cmd;

  //console.dir(key);
  //console.dir(cmd)

  var opts = {env: process.env, cwd: req.cwd};
  exec(cmd, opts, function(err, stdout, stderr) {
    if(err) {
      return next(err);
    }
    // session creation is a one shot deal
    // do not want to trigger multiple times with each()
    // calling run()
    delete req.session;
    next();
  })
}

function each(dirs, info, req, next) {
  var list = dirs.slice(0);
  session(info, req, function(err) {
    /* istanbul ignore next: awkward to mock */
    if(err) {
      return next(err) ;
    }

    function onEach(err) {
      /* istanbul ignore next: difficult to mock */
      if(err) {
        return next(err);
      } 
      if(list.length) {
        return iterate(list.shift());
      }
      next();
    }

    function iterate(dir) {
      req.cwd = dir;
      run(req.launch.list.slice(0), info, req, onEach);
    }
    
    iterate(list.shift())
  });
}

/**
 *  Source a single configuration file.
 */
function source(conf, info, req, next) {
  var dir = path.dirname(conf);
  var cmd = [req.tmux].concat('source-file', conf).join(' ');
  var cwd = req.cwd;
  var noop = req.result.flags.noop;
  if(cwd === undefined) {
    cwd = path.dirname(conf); 
  }
  //console.log(':source-file %s (cwd: %s)', conf, cwd);
  if(noop) {
    return next();
  }
  req.launch.exec = req.launch.exec || {};
  var env = {
    mxl_file: conf,
    mxl_key: key(conf),
    mxl_filename: path.basename(conf),
    mxl_cwd: cwd,
    mxl_cwdname: path.basename(cwd)
  };

  //console.dir(env.mxl_cwdname);

  var envcmd = '';
  for(var k in env) {
    envcmd += util.format('tmux set-environment -g %s "%s";', k, env[k]);
  }
  var opts = {env: process.env, cwd: cwd};
  exec(envcmd + cmd, opts, function(err, stdout, stderr) {

    if(err) {
      return next(err);
    }

    // stash success files for auto alias creation
    req.launch.exec[conf] = true;
    next();
  })
}

function reduce(list, patterns, req) {
  var out = [], i, re, cache, e;
  for(i = 0;i < patterns.length;i++) {
    cache = [];
    try {
      re = new RegExp(patterns[i]);
    }catch(e) {
      throw e; 
    }
    list.forEach(function(item) {
      // use parent directory name for tmux.conf match
      // for --pattern matches
      if(path.basename(item) === req.filename) {
        item = path.dirname(item);
      }
      if(re.test(item)) {
        cache.push(item);
        out.push(item);
      }
    })
    if(!cache.length) {
      e = new Error('pattern %s does not match');
      e.parameters = [patterns[i]];
      throw e;
    }else if(cache.length > 1 && !req.all) {
      e = new Error('ambiguous pattern %s, %s');
      e.parameters = [patterns[i], cache.join(', ')];
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
  each: each,
  run: run,
  key: key,
  folder: folder,
  file: file,
  ptn: ptn
}
