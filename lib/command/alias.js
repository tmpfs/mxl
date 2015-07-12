var Alias = require('../alias');
module.exports = function alias(info, req, next) {
  var unparsed = info.args.slice(0)
    , alias = new Alias(this.configure(), req)
    , k
    , v
    , none = !unparsed.length && !Object.keys(req.vars).length;

  // nothing to process - list
  if(none) {
    for(k in req.rc.alias) {
      console.log(k + ' %s', req.rc.alias[k]);
    } 
  // got vars to process
  }else{
    //console.dir(req.vars)
    //console.dir(unparsed)
    unparsed.forEach(function(arg) {
      if(arg.indexOf(req.aliasid) === 0) {
        k = arg.substr(1);
        console.log('get %s=%s', k, alias.get(k) || '');
      } 
    })
    for(k in req.vars) {
      v = req.vars[k];
      if(!v) {
        console.log('rm %s', k) ;
        alias.del(k);
      }else{
        console.log('set %s=%s', k, v) ;
        // TODO: test suffix and file existence?
        alias.set(k, v);
      }
    }

    if(!req.noop) {
      alias.write();
    }
  }
  next();
}
