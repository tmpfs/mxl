var fs = require('fs')
  , Alias = require('../alias');

module.exports = function prune(info, req, next) {
  var alias = new Alias(this.configure(), req)
    , map = alias.map
    , k
    , v
    , changed = false;

  for(k in map) {
    v = alias.getFile(k);
    if(!fs.existsSync(v)) {
      console.info('rm %s', k);
      alias.del(k);
      changed = true;
    } 
  }

  if(!req.noop && changed) {
    alias.write();
  }
  next();
}
