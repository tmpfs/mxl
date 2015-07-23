var utils = require('../util') 
  , reduce = utils.reduce
  , Alias = require('../alias');

module.exports = function remove(info, req, next) {
  var patterns = info.args.slice(0)
    , alias = new Alias(this.configure(), req)
    , modified = false
    , i
    , re;

  // compile args
  for(i = 0;i < patterns.length;i++) {
    try {
      re = new RegExp(patterns[i]);
      patterns[i] = re;
    }catch(e) {
      return next(e);
    }
  }

  // -p args in this.pattern are already compiled
  patterns = this.pattern.concat(patterns);

  if(!patterns.length) {
    return next(
      this.errors.ETOO_FEW_ARGS, [info.cmd.extra()]); 
  }

  var keys = Object.keys(alias.map);
  var results = reduce(keys, patterns, req);
  if(!results.length) {
    return next(this.errors.EPATTERN_MATCH); 
  }
  results.forEach(function(k) {
    alias.print(k, Alias.operations.rm);
    alias.del(k);
    modified = true;
  });

  if(!req.noop && modified) {
    alias.write();
  }

  next();
}
