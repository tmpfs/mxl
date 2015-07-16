var fs = require('fs')
  , path = require('path')
  , uniq = require('../uniq')
  , utils = require('../util')
  , key = utils.key
  , search = utils.search
  , find = require('fs-find')
  , folder = utils.folder
  , file = utils.file
  , Alias = require('../alias');

module.exports = function generate(info, req, next) {
  var alias = new Alias(this.configure(), req)
    , dirs = req.launch.list;

  dirs = dirs.map(function(file) {
    return path.dirname(file);
  })

  req.launch.dirs = req.launch.dirs.concat(dirs);
  req.launch.dirs = req.launch.dirs.filter(uniq);

  req.recursive = true;

  function done(err, files) {
    /* istanbul ignore next: difficult to mock error */
    if(err) {
      return next(err);
    }
    var changed = false;
    files.forEach(function(v) {
      v = v.file;
      var k = key(v); 
      console.info('set %s=%s', k, v);
      alias.set(k, v);
      changed = true;
    })

    if(!req.noop && changed) {
      alias.write();
    }
    next();
  }
  search(info, req, done);
}
