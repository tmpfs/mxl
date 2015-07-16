var path = require('path')
  , utils = require('../util')
  , search = utils.search
  , key = utils.key
  , uniq = require('../uniq');

module.exports = function ls(info, req, next) {
  function print(map) {
    map = map || req.launch.map; 
    for(var k in map) {
      console.info(k + ' %s', map[k]);
    }
  }
  if(this.recursive) {

    var dirs = req.launch.list;

    dirs = dirs.map(function(file) {
      return path.dirname(file);
    })

    req.launch.dirs = req.launch.dirs.concat(dirs);
    req.launch.dirs = req.launch.dirs.filter(uniq);
    req.recursive = true;

    function done(err, results) {
      if(err) {
        return next(err);
      }

      //console.dir(results)
      var map = {};
      results.forEach(function(info, index, arr) {
        map[key(info.file)] = info.file;
      })

      print(map);
      next();
    }
    return search(info, req, done) ;
  }
  print();
  next();
}
