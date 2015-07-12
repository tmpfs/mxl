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
    , profiles = [];

  // launch configuration
  var launch = req.launch = {
    dirs: dirs,
    files: files,
    profiles: profiles
  }

  // profile matches
  unparsed.forEach(function(dir, index) {
    if(dir.indexOf(req.profid) === 0) {
      profiles.push(dir.substr(1)); 
      unparsed.splice(index, 1);
    }
  })

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

  if(!unparsed.length || (!dirs.length && profiles.length)) {
    dirs.push(req.dir); 
  }

  resolve(info, req, function(err, list) {
    if(err) {
      return next(err);
    }

    if(profiles.length) {
      list = reduce(list || [], profiles, req);
    }

    list = list || [];

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

module.exports = before;
