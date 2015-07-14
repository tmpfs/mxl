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

  // launch configuration
  var launch = req.launch = {
    dirs: dirs,
    files: files,
    profiles: profiles,
    alias: alias
  }

  // alias matches
  var i, dir, as, k, v;
  for(k in req.vars) {
    unparsed.push('@' + k);
  }
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
      }else{
        // ignore due to alias command warnings
        // console.warn('unknown alias %s', as);
      }
    }
  }

  // profile matches
  for(i = 0;i < unparsed.length;i++) {
    dir = unparsed[i];
    if(dir.indexOf(req.profid) === 0) {
      profiles.push(dir.substr(1)); 
      unparsed.splice(i, 1);
      i--;
    }
  }

  // dirs and files
  unparsed.forEach(function(dir) {
    var stat;
    if(/^\./.test(dir)) {
      dir = path.normalize(path.join(process.cwd(), dir));
    }

    try {
      stat = fs.statSync(dir);
    }catch(e) {
      // let the call to source-file trigger an error
      // for missing paths
      files.push(dir);
      return;
    }

    if(stat) {
      if(stat.isDirectory()) {
        if(!req.all && fs.existsSync(path.join(dir, req.filename))) {
          files.push(path.join(dir, req.filename));
        }else{
          dirs.push(dir); 
        }
      }else if(stat.isFile() && /tmux\.conf$/.test(dir)) {
        files.push(dir);
      }
    }
  })

  //console.dir(req.launch)

  if(!dirs.length && !files.length) {
    if(this.all || profiles.length) {
      dirs.push(req.dir); 
    }else if(fs.existsSync(path.join(req.dir, req.filename))) {
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
