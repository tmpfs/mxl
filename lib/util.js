var path = require('path')
  , util = require('util')
  , fs = require('fs')
  , find = require('fs-find')
  , Alias = require('./alias')
  , exec = require('child_process').exec
  , constants = require('./constants')
  , ptn = constants.PATTERN.ptn
  , extension = constants.PATTERN.extension
  , reparse = require('./reparse')
  , tmenv = require('./env')
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
    var runner;

    function showNext() {
      runner = list.shift();

      // all done
      if(!runner) {
        return next();
      }

      runner.last = Boolean(!list.length);
      source(runner, info, req, onSourceComplete);
    }

    function onSourceComplete(err, res) {
      if(err) {
        return next(err);
      }

      setTimeout(showNext, req.rc.timeout);
    }

    showNext();
  }
  start(list);
}

/**
 *  Post process the working directories list and configuration file lists 
 *  inferring, cwd, key and id where necessary.
 *
 *  @param dirs An array of string working directories to process.
 */
function getTree(dirs, files, req) {
  var map = {}
    , list = []
    , i
    , j
    , dir
    , cwd
    , file
    , id
    , alias = new Alias(req.program.configure(), req);


  var isDefaultWorkingDir = dirs.length === 1 && dirs[0] === process.cwd()
    , hasSession = req.session !== undefined
    , isGlobal;

  for(i = 0;i < dirs.length;i++) {
    dir = cwd = dirs[i];
    for(j = 0;j < files.length;j++) {
      file = files[j];

      file.cwd = cwd;
      if(file.alias) {
        isGlobal = alias.isGlobal(file.alias.key);

        // custom saved cwd
        if(file.alias.cwd) {
          file.cwd = file.alias.cwd; 
        }else if(isDefaultWorkingDir) {
          if(!isGlobal && !req.dirs.length) {
            file.cwd = path.dirname(file.alias.file);
          }
          // use current working directory for global aliases 
        }
      }

      file.index = Boolean(~req.launch.indices.indexOf(file.file));

      if(file.index) {
        file.cwd = path.dirname(file.file);
      }

      file.name = key(file.cwd);
      file.key = key(file.file);

      if(req.each) {
        file.key = path.basename(file.cwd); 
      }

      file.id = file.key;
      file.inSession = hasSession;
      if(hasSession) {
        file.id = req.session + ':' + file.key;  
      }
      
      // need a cheap clone
      file = JSON.parse(JSON.stringify(file));
      list.push(file);
      map[file.cwd] = map[file.cwd] || [];
      map[file.cwd].push(file);
    }
  }

  // rewrite with new dirs
  dirs = Object.keys(map);

  if(hasSession) {

    // use first specified non-default working directory for session
    if(!isDefaultWorkingDir) {
      cwd = dirs[0];
    // when using the default directory, attempt to inherit 
    // from the first custom file in the list
    }else{
      cwd = files[0].cwd; 
    }

    var sess = getSessionFile(req, cwd);  
    // inject session at start
    list.unshift(sess);

    map[dirs[0]] = map[dirs[0]];
    map[dirs[0]].unshift(sess);
  }

  return {map: map, list: list, dirs: dirs};
}

/**
 *  Iterate a set of working directories and run all matched configuration 
 *  files on each working directory.
 */
function each(dirs, info, req, next) {
  var res = getTree(dirs.slice(0), req.launch.list, req)
    , tree = res.map
    , list = res.dirs
    , files = res.list;

  req.launch.results = res;

  function onRun(err) {
    /* istanbul ignore next: difficult to mock */
    if(err) {
      return next(err);
    } 
    if(!list.length) {
      //delete process.env.mxl_session;
      return next();
    }
    iterate(list.shift());
  }

  function iterate(dir) {
    var files = tree[dir];
    console.info(dir);
    run(files, info, req, onRun);
  }
  
  iterate(list.shift())
}

function getSessionFile(req, cwd) {
  var file = path.join(__dirname, '..', 'conf', 'session.tmux.conf');
  var opts = {
    file: file,
    key: req.session,
    id: req.session,
    system: true,
    session: true,
    cwd: cwd
  }

  // re-parse access to parent session (current)
  process.env.mxl_session = req.session;

  return opts;
}

/**
 *  Source a single configuration file.
 */
function source(conf, info, req, next) {
  var cmd
    , cwd = conf.cwd
    , id = conf.key
    , name = conf.name
    , alias = conf.alias
    , file = conf.file || conf
    , noop = req.noop
    , opts;

  cmd = [TMUX].concat('source-file', file).join(' ');

  // when we encounter an alias with saved options
  // we re-parse through the program
  if(alias && alias.options) {
    var args = ['run'];
    for(var k in alias.options) {
      /* istanbul ignore else: not going to assert on edge case (manual edit)*/
      if(constants.ALIAS_OPTION_MAP[k]) {
        args.push(constants.ALIAS_OPTION_MAP[k]); 
        if(typeof alias.options[k] !== 'boolean') {
          args.push(alias.options[k]);
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

  var prefix = '  ' + (conf.last
    ? constants.TREE_VIEW.last : constants.TREE_VIEW.child);

  if(conf.session) {
    console.info(
      prefix + ' ' + conf.id + ' %s (%s)', file, constants.TREE_VIEW.plus);
  }else{
    console.info(
      prefix + ' ' + conf.id + ' %s', file);
  }

  //console.info('session: %s', process.env.mxl_session);

  var env = {
    mxl_key: id,
    mxl_name: name,
    mxl_session: process.env.mxl_session || '',
    mxl_cwd: cwd,
    mxl_cwdname: path.basename(cwd)
  };

  var envcmd = tmenv.set(env, {exec: true, terminate: true}, req);
  opts = {env: process.env, cwd: cwd};
  cmd = envcmd + cmd;

  //console.log('env: %j', env);

  // don't execute with noop
  if(noop) {
    return next();
  }

  // set environment and source file
  exec(cmd, opts, function(err, stdout, stderr) {
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
   
    // unset environment
    envcmd = tmenv.unset(env, {exec: true, terminate: true}, req);
    exec(envcmd, next);
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
      re = patterns[j];
      if(re.test(file)) {
        out.push(file);
        break;
      }
    }
  }

  return out;
}

function suffix(file) {
  var dir = path.dirname(file)
    , nm = path.basename(file);
  if(!ptn.test(nm)) {
    return path.normalize(path.join(dir, nm + constants.EXTENSION));
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
