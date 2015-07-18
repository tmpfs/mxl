var util = require('util')
  , fs = require('fs')
  , path = require('path')
  , uniq = require('./uniq')
  , utils = require('./util')
  , resolve = utils.resolve
  , reduce = utils.reduce
  , search = utils.search
  , key = utils.key;

function before(info, req, next) {
  /* istanbul ignore next: bypass for help command */
  if(info.name === 'help'
    || info.name === 'alias'
    || info.name === 'as') {
    return next();
  }
  if(info.name === 'index' || info.name === 'in') {
    req.all = true;
  }

  var unparsed = info.args.slice(0)
    , recursive = this.recursive
    , pattern = this.pattern
    , dirs = []
    , files = []
    , alias = []
    , i, dir, as, k, v;


  // launch configuration
  var launch = req.launch = {
    dirs: dirs,
    files: files,
    alias: alias,
    each: this.each
  }

  for(i = 0;i < unparsed.length;i++) {
    dir = unparsed[i];
    if(dir.indexOf(req.aliasid) === 0) {
      as = dir.substr(1);
      alias.push(as); 
      unparsed.splice(i, 1);
      i--;
      if(req.rc && req.rc.alias
        && req.rc.alias[as] && req.rc.alias[as].file) {
        files.push(req.rc.alias[as].file); 
      }else{
        return next('alias not found @%s', [as]);
      }
    }
  }

  // dirs and files
  unparsed.forEach(function(dir) {
    var stat;
    if(!/^\//.test(dir)) {
      dir = path.normalize(path.join(process.cwd(), dir));
    }

    // normalize directories to ensure no duplicates
    dir = dir.replace(/\/+$/, '');

    try {
      stat = fs.statSync(dir);
    }catch(e) {
      return next(e);
    }

    if(stat.isDirectory()) {
      if(!req.all && fs.existsSync(path.join(dir, req.filename))) {
        files.push(path.join(dir, req.filename));
      }else{
        dirs.push(dir); 
      }
    }else if(stat.isFile() && /\.?tmux\.conf$/.test(dir)) {
      files.push(dir);
    }else{
      return next(
        new Error(
          util.format('bad filename %s, should end with tmux.conf', dir)));
    }
  })

  if(!dirs.length && !files.length) {
    if(this.all || pattern.length) {
      dirs.push(req.dir); 
    }else if(fs.existsSync(path.join(req.dir, req.filename))) {
      files.push(path.join(req.dir, req.filename)); 
    }else{
      return next(
        new Error(
          util.format('no files found in %s, try -a', req.dir)));
    }
  }

  resolve(info, req, function(err, list) {
    /* istanbul ignore next: difficult to mock resolve error */
    if(err) {
      return next(err);
    }

    //list = list;

    var map = {};

    function finish() {
      // when -e is specified the behaviour of 
      // -p switches to match the child directories of -c
      if(pattern.length && !req.launch.each) {
        try {
          list = reduce(list, pattern, req);
        }catch(e) {
          return next(e, e.parameters);
        }
      }
      list.forEach(function(pth) {
        var k = key(pth);
        map[k] = pth;
      })
      list = list.filter(uniq);
      req.launch.list = list;
      req.launch.map = map;
      next();
    }

    if(recursive) {

      var dirs = list;
      dirs = dirs.map(function(file) {
        return path.dirname(file);
      })
      req.launch.dirs = req.launch.dirs.concat(dirs);
      req.launch.dirs = req.launch.dirs.filter(uniq);
      req.recursive = true;

      //console.log('recurse %j', req.launch.dirs);

      function done(err, results) {
        /* istanbul ignore next: difficult to mock */
        if(err) {
          return next(err) ;
        }
        list = results.map(function(info) {
          return info.file;
        })
        finish();
      }
      return search(info, req, done) ;
    }

    if(!files.length && !list.length) {
      return next('no files found'); 
    }
    
    finish();
  });
}

module.exports = before;
