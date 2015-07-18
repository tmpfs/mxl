var Alias = require('../alias');

module.exports = function alias(info, req, next) {
  var unparsed = info.args.slice(0)
    , alias = new Alias(this.configure(), req)
    , k
    , v
    , modified = false
    , none = !unparsed.length && !Object.keys(req.vars).length;

  // nothing to process - list
  if(none) {
    for(k in req.rc.alias) {
      console.info(k + ' %s', req.rc.alias[k]);
    } 
  // got vars to process
  }else{
    unparsed.forEach(function(arg) {
      if(arg.indexOf(req.aliasid) === 0) {
        k = arg.substr(1);
        console.info('get %s=%s', k, alias.get(k) || '');
      } 
    })
    for(k in req.vars) {
      v = req.vars[k];
      if(!v) {
        console.info('rm %s', k) ;
        alias.del(k);
        modified = true;
      }else{
        console.info('set %s=%s', k, v) ;
        // TODO: test suffix and file existence?
        alias.set(k, v, req);
        modified = true;
      }
    }
    /* istanbul ignore next: never want to write in test env */
    if(!req.noop && modified) {
      alias.write();
    }
  }

  next();
}
