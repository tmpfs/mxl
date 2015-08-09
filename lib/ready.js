var path = require('path')
  , spawn = require('child_process').spawn
  , constants = require('./constants')
  , normalize = require('./normalize');

function proceed(req, next) {
  var j, re;

  // pre-compile and validate patterns (-p)
  for(j = 0;j < this.pattern.length;j++) {
    try {
      re = new RegExp(this.pattern[j]);
      this.pattern[j] = re;
    }catch(e) {
      return next(e);
    }
  }

  // propagate alias keys so that alias objects
  // can be dereferenced and access to the alias 
  // key is available
  for(var k in req.rc.alias) {
    req.rc.alias[k].key = k;
  }

  // recursive overrides all
  if(req.all && req.recursive) {
    req.all = false;
  }

  // expose reference for reparse()
  req.program = this;

  // if -c is left without a value we'll have undefined
  // so filter those out
  this.dir = this.dir.filter(function(d) {
    return d;
  })

  // reference to originally submitted dir args
  req.directories = this.dir.slice(0);

  // current working directories for :source-file
  req.cwd = this.dir.slice(0);
  req.cwd = normalize(req.cwd);

  req.dirs = req.cwd.slice(0);
  next();
}

/**
 *  Start tmux(1).
 */
function start(req, next) {
  var opts = {stdio: 'inherit', detached: true}
    , scope = this
    , wait = 1000;
  req.log.info('start %s (wait: %ss)',
    constants.TMUX, (wait / 1000).toFixed(2));
  var ps = spawn(constants.TMUX, [], opts);
  //ps.unref();
  function onWait() {
    proceed.call(scope, req, next);
  }
  setTimeout(onWait, wait);
}

function ready(req, next) {
  // NOTE: this program impl passes data in req, it does not typically
  // NOTE: maintain the program scope
  req.all = this.all;
  req.noop = this.noop;
  req.recursive = this.recursive;
  req.each = this.each;
  req.pattern = this.pattern;
  req.session = this.session;
  req.global = this.global;
  req.log = this.log;

  if(!process.env.TMUX) {
    return start.call(this, req, next);
  }

  proceed.call(this, req, next);
}

module.exports = ready;
