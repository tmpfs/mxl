var utils = require('./util')
  , fs = require('fs')
  , path = require('path')
  , resolve = utils.resolve
  , reduce = utils.reduce
  , key = utils.key;

function before(info, req, next) {
  var unparsed = info.args.slice(0)
    , dirs = []
    , files = []
    , profiles = []
    , alias = [];

  //console.dir(req.rc)

  // launch configuration
  var launch = req.launch = {
    dirs: dirs,
    files: files,
    profiles: profiles,
    alias: alias
  }

  // alias matches
  var i, dir, as;
  for(i = 0;i < unparsed.length;i++) {
    dir = unparsed[i];
    if(dir.indexOf(req.aliasid) === 0) {
      as = dir.substr(1);
      //console.log(as)
      alias.push(as); 
      unparsed.splice(i, 1);
      i--;
      if(req.rc && req.rc.alias && req.rc.alias[as]) {
        if(!utils.ptn.test(path.basename(req.rc.alias[as]))) {
          console.warn('bad alias file %s for %s', req.rc.alias[as], as);
          continue;
        }
        if(fs.existsSync(req.rc.alias[as])) {
          files.push(req.rc.alias[as]); 
        }else{
          console.warn('missing alias file %s for %s', req.rc.alias[as], as);
        }
      }
    }
  }

  // profile matches
  for(i = 0;i < unparsed.length;i++) {
    if(dir.indexOf(req.profid) === 0) {
      profiles.push(dir.substr(1)); 
      unparsed.splice(i, 1);
      i--;
    }
  }

  // dirs and files
  unparsed.forEach(function(dir) {
    if(/^\./.test(dir)) {
      dir = path.normalize(path.join(process.cwd(), dir));
    }
    if(fs.existsSync(dir)) {
      var stat = fs.statSync(dir);
      if(stat.isDirectory()) {
        if(req.all) {
          dirs.push(dir); 
        }else if(fs.existsSync(path.join(dir, req.filename))
          && !profiles.length) {
          files.push(path.join(dir, req.filename));
        }else{
          dirs.push(dir); 
        }
      }else if(stat.isFile() && /tmux\.conf$/.test(dir)) {
        files.push(dir);
      }else{
        console.warn('ignored: %s', dir);
      }
    }else{
      console.warn('ignored (missing): %s', dir);
    }
  })

  // single conf file in working directory
  launch.single = !dirs.length && !files.length && !profiles.length && !this.all;

  // cannot be single with -r flag
  if(req.recursive) {
    launch.single = false; 
  }

  if(!req.unparsed.length || (req.command && !req.command.args.length)) {
    if(this.all) {
      dirs.push(req.dir); 
    }else{
      files.push(path.join(req.dir, req.filename)); 
    }
  }

  resolve(info, req, function(err, list) {
    if(err) {
      return next(err);
    }

    if(profiles.length) {
      list = reduce(list || [], profiles, req);
    }

    list = list || [];

    list = list.filter(uniq);

    var map = {};
    req.launch.list = list;
    req.launch.map = map;
    list.forEach(function(pth) {
      var k = key(pth);
      map[k] = pth;
    })
    next();
  });
}

function uniq(value, index, self) { 
  return self.indexOf(value) === index;
}

module.exports = before;
