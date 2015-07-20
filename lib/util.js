var path = require('path')
  , util = require('util')
  , fs = require('fs')
  , find = require('fs-find')
  , ptn = /^(tmux\.conf|.+\.tmux\.conf)$/
  , extension = /(\.tmux)?\.conf$/
  , exec = require('child_process').exec
  , constants = require('./constants')
  , reparse = require('./reparse')
  , TMUX = constants.TMUX;

/**
 *  Find folder (descend) filter function.
 */
function folder(path, info) {
  if(/^(\.git|node_modules)$/.test(info.matcher)) {
    return false;
  }
  return true;
}

/**
 *  Find file filter function.
 */
function file(path, info) {
  return ptn.test(info.name);
}

/**
 *  Extract a key from a path.
 */
function key(nm) {
  var prefix = path.basename(path.dirname(nm));
  if(path.basename(nm) === constants.FILENAME) {
    return prefix;
  }
  return prefix + '/' + path.basename(nm).replace(extension, '');
}

/**
 *  Search for configuration files.
 */
function search(info, req, next) {
  var haystack = req.launch.dirs.slice(0).concat(req.launch.files);
  haystack = haystack.map(function(info) {
    return info.file || info; 
  })
  // recursive
  var opts = {folder: folder, file: file, absolute: true, dedupe: true};
  if(req.recursive) {
    return find(haystack, opts, next);
  }

  // single level find
  opts = {
    depth: 1,
    file: file,
    folder: folder,
    absolute: true
  };
  return find(haystack, opts, next);
}

/**
 *  Run a collection of configuration files (list) for a single 
 *  working directory.
 */
function run(list, info, req, next) {
  list = list.slice(0);

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
}

/**
 *  Iterate a set of working directories and run on each working directory.
 */
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
      //console.dir(dir)
      req.cwd = dir;
      run(req.launch.list.slice(0), info, req, onEach);
    }
    
    iterate(list.shift())
  });
}

/**
 *  Source the system session file to create a new session (-s | --session).
 */
function session(info, req, next) {
  if(!req.session) {
    return next();
  }

  var file = path.join(__dirname, '..', 'conf', 'session.tmux.conf');
  var cwd;
  if(req.directories.length) {
    cwd = req.directories[0].file;
  }else{
    cwd = req.launch.list[0].cwd
      || path.dirname(req.launch.list[0].file);
  }
  var opts = {
    file: file,
    key: '' + req.session,
    system: true,
    cwd: cwd
  }

  // session creation is a one shot deal
  // do not want to trigger multiple times with each()
  // calling run()
  delete req.session;

  function done(err) {
    /* istanbul ignore next: source session file should always pass */
    if(err) {
      return next(err);
    }
    next();
  }

  source(opts, info, req, done);
}


/**
 *  Source a single configuration file.
 */
function source(conf, info, req, next) {
  var isalias = typeof conf === 'object'
    , dir
    , cmd
    , cwd
    , id
    , file = conf.file || conf
    , noop = req.noop;

  dir = path.dirname(file);
  cmd = [TMUX].concat('source-file', file).join(' ');
  cwd = req.cwd;
  if(conf.cwd) {
    cwd = conf.cwd; 
  }

  if(cwd === undefined) {
    cwd = path.dirname(file); 
  }

  //console.dir(cwd)
  //console.dir(cwd && cwd !== process.cwd())

  var defkey = (cwd && cwd !== process.cwd())
    ? key(cwd) : key(file);
  id = conf.key || defkey;

  //console.dir(id)

  var env = {
    mxl_file: file,
    mxl_key: id,
    mxl_filename: path.basename(file),
    mxl_cwd: cwd,
    mxl_cwdname: path.basename(cwd)
  };

  if(conf.options) {
    var args = ['run'];
    for(var k in conf.options) {
      /* istanbul ignore else: not going to assert on edge case (manual edit)*/
      if(constants.ALIAS_OPTION_MAP[k]) {
        args.push(constants.ALIAS_OPTION_MAP[k]); 
        if(typeof conf.options[k] !== 'boolean') {
          args.push(conf.options[k]);
        }
      }
    }
    args.push('-c', cwd);
    if(noop) {
      args.push('--noop');
    }
    args.push(conf.file);
    return reparse(req, args, next);
  }


  console.info(id + ' (%s)', cwd);
  console.info(constants.TREE_VIEW.last + ' %s', file);

  if(noop) {
    return next();
  }

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
    // flag some files as internal system files to bypass
    // auto aliasing
    req.launch.exec[file] = {
      conf: conf,
      cmd: cmd,
      system: Boolean(conf.system),
      env: env
    };
    next();
  })
}

/**
 *  Filter a file list against a set of regexp patterns.
 */
function reduce(list, patterns, req) {
  var out = [], i, file, j, re, e;
  for(i = 0;i < list.length;i++) {
    file = typeof list[i] === 'object' ? list[i].file : list[i];

    // use parent directory path for tmux.conf match
    if(path.basename(file) === constants.FILENAME) {
      file = path.dirname(file);
    }

    for(j = 0;j < patterns.length;j++) {
      try {
        re = new RegExp(patterns[j]);
      }catch(e) {
        throw e; 
      }
      if(re.test(file)) {
        out.push(file);
        break;
      }
    }
  }

  if(!out.length) {
    e = new Error('pattern does not match anything');
    throw e;
  }
  return out;
}

function suffix(file) {
  var dir = path.dirname(file)
    , nm = path.basename(file);
  if(!ptn.test(nm)) {
    return path.normalize(path.join(dir, nm + '.tmux.conf'));
  }
  return file;
}

module.exports = {
  reduce: reduce,
  source: source,
  search: search,
  each: each,
  run: run,
  key: key,
  folder: folder,
  file: file,
  ptn: ptn,
  suffix: suffix
}
