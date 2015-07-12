var utils = require('./util')
  , resolve = utils.resolve
  , reduce = utils.reduce
  , key = utils.key;

function before(info, req, next) {
  var unparsed = info.args
    , dirs = []
    , files = []
    , profiles = [];

  //console.dir(unparsed);

  // launch configuration
  var launch = req.launch = {
    dirs: dirs,
    files: files,
    profiles: profiles,
    all: this.all === true
  }

  unparsed.forEach(function(arg) {
    if(arg.indexOf(req.profid) === 0) {
      profiles.push(arg.substr(1)); 
    }
  })

  //console.dir(launch);

  // single conf file in working directory
  launch.single = !dirs.length && !files.length && !profiles.length && !this.all;

  resolve(info, req, function(err, list) {
    if(err) {
      return next(err);
    }

    if(profiles.length) {
      list = reduce(list, profiles)
    }

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
