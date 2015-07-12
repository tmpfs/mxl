var path = require('path')
  , fs = require('fs')
  , utils = require('../util')
  , key = utils.key
  , source = utils.source;

module.exports = function run(info, req, next) {
  var list = req.launch.list.slice(0)
    , runner = list.shift()
    , rc = require('../../.mxlrc.json')
    , rcfile = path.join(process.env.HOME, '.mxlrc.json');

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
    if(!req.noop) {
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
