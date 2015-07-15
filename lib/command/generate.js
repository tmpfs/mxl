var fs = require('fs')
  , path = require('path')
  , utils = require('../util')
  , key = utils.key
  , search = utils.search
  , Alias = require('../alias');

module.exports = function generate(info, req, next) {
  var alias = new Alias(this.configure(), req)
    , dirs = req.launch.list;

  dirs = dirs.map(function(file) {
    return path.dirname(file);
  })

  req.launch.dirs = req.launch.dirs.concat(dirs);
  req.recursive = true;

  search(info, req, function(err, files) {
    /* istanbul ignore next */
    if(err) {
      return next(err); 
    } 
    var changed = false;
    files.forEach(function(v) {
      var k = key(v); 
      console.info('set %s=%s', k, v);
      alias.set(k, v);
      changed = true;
    })

    if(!req.noop && changed) {
      alias.write();
    }

    next();
  })

}
