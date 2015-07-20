var util = require('util')
  , fs = require('fs')
  , path = require('path')
  , uniq = require('./uniq')
  , utils = require('./util')
  , reduce = utils.reduce
  , search = utils.search
  , key = utils.key
  , constants = require('./constants');

function before(info, req, next) {
  var cmd = this.finder.getCommandByName(info.name, this.commands());
  var bypass = ['help', 'alias', 'install'];

  if(cmd && cmd.key() === 'generate') {
    req.all = false;
    req.recursive = true;
  }

  var unparsed = info.args.slice(0)
    , pattern = this.pattern
    , dirs = []
    , files = []
    , alias = []
    , aliases = {}
    , list = []
    , i, dir, as, k, v;


  // launch configuration
  var launch = req.launch = {
    dirs: dirs,
    files: files,
    alias: alias,
    aliases: aliases,
    list: list,
    exec: {}
  }

  // alias references
  for(i = 0;i < unparsed.length;i++) {
    dir = unparsed[i];
    if(dir.indexOf(constants.ALIAS_ID) === 0) {
      as = dir.substr(1);
      alias.push(as); 
      unparsed.splice(i, 1);
      i--;
      if(req.rc && req.rc.alias
        && req.rc.alias[as] && req.rc.alias[as].file) {
        aliases[as] = req.rc.alias[as];
        aliases[as].key = as;
        // add the alias object
        files.push(req.rc.alias[as]); 
        //list.push(req.rc.alias[as]); 
      }else{
        return next('alias not found %s%s', [constants.ALIAS_ID, as]);
      }
    }
  }

  if(cmd && ~bypass.indexOf(cmd.key())) {
    return next();
  }

  //console.dir(aliases)

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
      if(!req.all && !req.recursive
        && fs.existsSync(path.join(dir, constants.FILENAME))) {
        files.push(path.join(dir, constants.FILENAME));
      }else{
        dirs.push(dir); 
      }
    }else if(stat.isFile() && /\.?tmux\.conf$/.test(dir)) {
      files.push(dir);
    }else{
      return next(
        new Error(
          util.format('bad file name %s, should end with tmux.conf', dir)));
    }
  })

  if(!dirs.length && !files.length && !alias.length) {
    if((req.all || req.recursive) && !~dirs.indexOf(req.dir)) {
      dirs.push(req.dir); 
    }else if(fs.existsSync(path.join(req.dir, constants.FILENAME))) {
      files.push(path.join(req.dir, constants.FILENAME)); 
    }else{
      return next(
        new Error(
          util.format('no files found in %s, try -a', req.dir)));
    }
  }

  files = files.filter(uniq);
  req.launch.files = files;

  function finish(list) {
    var map = {};
    // when -e is specified the behaviour of 
    // -p switches to match the child directories of -c
    if(pattern.length && !req.each) {
      try {
        list = reduce(list, pattern, req);
      }catch(e) {
        return next(e, e.parameters);
      }
    }

    list.forEach(function(pth) {
      pth = typeof pth === 'string' ? pth : pth.file;
      var k = key(pth);
      map[k] = pth;
    })

    list = list.filter(uniq);

    //console.dir('merge aliases')
    //console.dir(aliases)

    var k, v, j;
    for(k in aliases) {
      v = aliases[k];
      for(j = 0;j < list.length;j++) {
        if(v.file === list[j].file) {
          list[j].options = v.options; 
          list[j].cwd = v.cwd; 
          //console.dir('merging alias: ' + k);
          //console.dir(list[j])
        }
      } 
    }

    //console.dir(list)

    req.launch.list = list;
    req.launch.map = map;

    if(!files.length && !list.length) {
      return next('no files found'); 
    }

    next();
  }

  search(info, req, function(err, list) {
    /* istanbul ignore next: difficult to mock error */
    if(err) {
      return next(err);
    }
    finish(list);
  });
}

module.exports = before;
