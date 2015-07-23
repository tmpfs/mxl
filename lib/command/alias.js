var Alias = require('../alias')
  , constants = require('../constants');

module.exports = function alias(info, req, next) {

  // remove non-alias references from unparsed args
  // TODO: warn or error?
  for(var i = 0;i < info.args.length;i++) {
    if(!(info.args[i].indexOf(constants.ALIAS_ID) === 0)) {
      info.args.splice(i, 1);
      i--;
    } 
  }
  var unparsed = info.args.slice(0)
    , k
    , v
    , modified = false
    , none = !unparsed.length && !Object.keys(req.vars).length
    , alias = new Alias(this.configure(), req, {mutate: true})
    , keys = constants.ALIAS_OPTION_KEYS
    , saveopts = {};

  //unparsed.forEach(function(arg) {
  //})

  // nothing to process - list
  if(none) {
    for(k in alias.map) {
      alias.print(k);
    } 
  // got vars to process
  }else{
    unparsed.forEach(function(arg) {
      if(arg.indexOf(constants.ALIAS_ID) === 0) {
        k = arg.substr(1);
        alias.print(k);
      } 
    })
    for(k in req.vars) {
      v = req.vars[k];

      if(!v && !alias.isGlobal(k)) {
        alias.print(k, Alias.operations.rm);
        alias.del(k);
        modified = true;
      }else if(v) {

        // handle alias assignment references eg: @alias=@git
        if(v.indexOf(constants.ALIAS_ID) === 0) {
          if(alias.get(v.substr(1))) {
            v = alias.get(v.substr(1)).file;
          }else{
            return next('bad alias reference %s', [v]);
          }
        }

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

        alias.print(k, Alias.operations.add);
        modified = true;
      }
    }

    if(!req.noop && modified) {
      alias.write();
    }
  }

  next();
}
