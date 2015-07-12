var path = require('path')
  , fs = require('fs')
  , utils = require('../util')
  , key = utils.key
  , source = utils.source;

module.exports = function run(info, req, next) {
  var conf = this.configure()
    , list = req.launch.list.slice(0)
    , runner = list.shift()
    , rcname = conf.rc.name
    , rc = require('../../' + rcname)
    , rcfile = path.join(process.env.HOME, rcname);

  //console.dir(req.result.variables);
  //console.log('vars %j', req.vars)
  //console.log(req.noop);

  try {
    rc = require(rcfile);
  }catch(e) {}

  rc = rc || {};
  rc.alias = rc.alias || {};

  function onSourceComplete(err, res) {
    if(err) {
      return next(err);
    }

    var k = key(runner);
    // add alias ref
    if(!req.noop && req.rc.autoalias) {
      if(!rc.alias[k]) {
        rc.alias[k] = runner;
        try {
          fs.writeFileSync(rcfile, JSON.stringify(rc, undefined, 2));
        }catch(e) {
          console.error('rc file write failed %s', rcfile);
        }
      }
    }

    runner = list.shift();

    // all done
    if(!runner) {
      return next();
    }

    source(runner, info, req, onSourceComplete);
  }
  if(runner) {
    source(runner, info, req, onSourceComplete);
  }
}
