var util = require('util')
  , fs = require('fs')
  , path = require('path')
  , uniq = require('./uniq')
  , utils = require('./util')
  , Alias = require('./alias')
  , reduce = utils.reduce
  , search = utils.search
  , key = utils.key
  , constants = require('./constants')
  , normalize = require('./normalize');

function before(info, req, next) {
  var cmd = this.finder.getCommandByName(info.name, this.commands());
  var bypass = ['help', 'alias', 'install', 'remove', 'kill', 'attach']
    , noalias  = ['help', 'remove', 'kill'];

  if(cmd && cmd.key() === 'generate') {
    req.all = false;
    req.recursive = true;
  }

  var unparsed = info.args.slice(0)
    , errors = this.errors
    , pattern = this.pattern
    , asconf = new Alias(this.configure(), req, {mutate: true, all: true})
    , dirs = []
    , files = []
    , alias = []
    , aliases = {}
    , list = []
    , indices = []
    , i, dir, as, k, v;

  // launch configuration
  var launch = req.launch = {
    dirs: dirs,
    files: files,
    alias: alias,
    aliases: aliases,
    list: list,
    indices: indices,
    exec: {}
  }

  // alias references
  if(!cmd || (cmd && !~noalias.indexOf(cmd.key()))) {
    for(i = 0;i < unparsed.length;i++) {
      dir = unparsed[i];
      if(dir.indexOf(constants.ALIAS_ID) === 0) {
        as = dir.substr(1);
        alias.push(as); 
        unparsed.splice(i, 1);
        i--;
        if(asconf.get(as)) {
          aliases[as] = asconf.get(as);
          files.push(asconf.getFile(as)); 
        }else{
          return next(errors.EALIAS_NOT_FOUND, [constants.ALIAS_ID, as]);
        }
      }
    }

    req.launch.alias = alias.filter(uniq);

  }

  if(cmd && ~bypass.indexOf(cmd.key())) {
    return next();
  }

  var cwdindex = path.join(process.cwd(), constants.FILENAME);

  // dirs and files
  unparsed.forEach(function(dir) {
    var stat
      , index = normalize.absolute(path.join(dir, constants.FILENAME));
    dir = normalize.absolute(dir);

    try {
      stat = fs.statSync(dir);
    }catch(e) {
      return next(e);
    }

    if(stat.isDirectory()) {
      if(!req.all && !req.recursive && fs.existsSync(index)) {
        files.push(index);
        indices.push(index);
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
    if(req.all || req.recursive) {
      dirs.push(process.cwd());
    }else if(fs.existsSync(cwdindex)) {
      files.push(cwdindex); 
    }else{
      return next(
        new Error(
          util.format('no files found in %s, try -a', process.cwd())));
    }
  }

  req.launch.dirs = normalize(dirs);
  req.launch.files = normalize(files);

  // handle pattern matching and mapping after search
  function finish(list) {
    var map = {};

    // when -e is specified the behaviour of 
    // -p switches to match the child directories of -c
    if(pattern.length && !req.each) {
      list = reduce(list, pattern, req);
      if(!list.length) {
        return next(errors.EPATTERN_MATCH); 
      }
    }

    list.forEach(function(pth) {
      pth = typeof pth === 'string' ? pth : pth.file;
      map[key(pth)] = pth;
    })

    list = list.filter(uniq);

    // merge aliases options and cwd with files
    var k, v, j;
    for(k in aliases) {
      v = aliases[k];
      for(j = 0;j < list.length;j++) {
        if(v.file === list[j].file) {
          list[j].alias = v;
        }
      } 
    }

    req.launch.list = list;
    req.launch.map = map;

    if(!files.length && !list.length) {
      return next('no files found'); 
    }

    next();
  }

  // find tmux configuration files
  search(info, req, function(err, list) {
    /* istanbul ignore next: difficult to mock error */
    if(err) {
      return next(err);
    }
    finish(list);
  });
}

module.exports = before;
