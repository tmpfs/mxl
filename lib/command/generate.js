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
    alias.set(k, v, req);
    alias.print(k, Alias.operations.add);
    changed = true;
  })

  if(!req.noop && changed) {
    alias.write();
  }
  next();
}
