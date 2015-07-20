var utils = require('../util')
  , key = utils.key
  , Alias = require('../alias');

module.exports = function generate(info, req, next) {
  var alias = new Alias(this.configure(), req)
    , files = req.launch.list;

  var changed = false;
  files.forEach(function(v) {
    v = v.file;
    var k = key(v); 
    console.info('set %s=%s', k, v);
    alias.set(k, v, req);
    changed = true;
  })

  if(!req.noop && changed) {
    alias.write();
  }
  next();
}
