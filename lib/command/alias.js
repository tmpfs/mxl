var Alias = require('../alias')
  , constants = require('../constants');

module.exports = function alias(info, req, next) {
  var unparsed = info.args.slice(0)
    , k
    , v
    , modified = false
    , none = !unparsed.length && !Object.keys(req.vars).length
    , alias = new Alias(this.configure(), req, true)
    , keys = constants.ALIAS_OPTION_KEYS
    , saveopts = {};

  // nothing to process - list
  if(none) {
    for(k in alias.map) {
      console.info(k + ' %s', alias.getFile(k));
    } 
  // got vars to process
  }else{
    unparsed.forEach(function(arg) {
      if(arg.indexOf(constants.ALIAS_ID) === 0) {
        k = arg.substr(1);
        console.info('get %s=%s', k, alias.getFile(k));
      } 
    })
    for(k in req.vars) {
      v = req.vars[k];
      if(!v) {
        console.info('rm %s', k) ;
        alias.del(k);
        modified = true;
      }else{
        keys.forEach(function(key) {
          if(req[key] !== undefined) {
            saveopts[key] = req[key];
            // do not store the empty array
            if(Array.isArray(req[key]) && !req[key].length) {
              delete saveopts[key] ;
            }
          }
        });

        if(!Object.keys(saveopts).length) {
          saveopts = undefined; 
        }
        req.saveopts = saveopts;
        if(req.dirs.length) {
          // save cwd with alias
          req.savecwd = req.cwd;
        }

        // TODO: test suffix and file existence?
        var info = alias.set(k, v, req);

        console.info('set %s=%s', k, info.file);

        if(req.savecwd) {
          console.info(' +cwd %s', req.cwd) ;
        }
        
        if(req.saveopts) {
          console.info(' +opt %j', saveopts) ;
        }
        modified = true;
      }
    }

    if(!req.noop && modified) {
      alias.write();
    }
  }

  next();
}
