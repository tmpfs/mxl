var util = require('util')
  , constants = require('./constants')
  , TMUX = constants.TMUX
  , PREFIX = constants.ENV_PREFIX;

function merge(env, rcenv) {
  env = env || {};
  rcenv = rcenv || {};
  var out = {}
    , args = [].slice.call(arguments).reverse();

  args.forEach(function(o) {
    var k, key;
    for(k in o) {
      key = '' + k;
      if(!(key.indexOf(PREFIX) === 0)) {
        key = PREFIX + key; 
      }
      out[key] = o[k];
    } 
  });

  return out;
}

function setEnv(env, opts, req) {
  opts = opts || {};
  opts.exec = opts.exec !== undefined ? opts.exec : false;
  var envcmd = []
    , k;

  env = merge(env, req.rc.env);

  for(k in env) {
    envcmd.push(util.format(
      (opts.exec ? util.format('%s ', TMUX) : '')
      + 'set-environment -g "%s" "%s"', k, env[k]));
  }
  if(opts.terminate) {
    envcmd.push('') ;
  }
  envcmd = envcmd.join(opts.exec ? ';' : '\n');
  return envcmd;
}

function unsetEnv(env, opts, req) {
  opts = opts || {};
  opts.exec = opts.exec !== undefined ? opts.exec : false;
  var envcmd = []
    , k;

  env = merge(env, req.rc.env);

  for(k in env) {
    envcmd.push(util.format(
      (opts.exec ? util.format('%s ', TMUX) : '')
      + 'set-environment -gu "%s"', k));
  }
  if(opts.terminate) {
    envcmd.push('') ;
  }
  envcmd = envcmd.join(opts.exec ? ';' : '\n');
  return envcmd;
}

module.exports = {
  set: setEnv,
  unset: unsetEnv
}
