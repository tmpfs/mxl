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
      alias.print(k, Alias.operations.rm);
      alias.del(k);
      changed = true;
    } 
  }

  if(!req.noop && changed) {
    alias.write();
  }
  next();
}
