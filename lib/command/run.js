var path = require('path')
  , fs = require('fs')
  , Alias = require('../alias')
  , utils = require('../util')
  , key = utils.key
  , source = utils.source;

module.exports = function run(info, req, next) {
  var conf = this.configure()
    , list = req.launch.list.slice(0)
    , runner = list.shift()
    , alias = new Alias(conf, req);

  function onSourceComplete(err, res) {
    if(err) {
      return next(err);
    }

    var k = key(runner)
      , aliased = alias.get(k) !== undefined;

    if(!aliased) {
      alias.set(k, runner);
    }

    // add alias ref
    if(!req.noop && req.rc.autoalias && !aliased) {
      alias.write();
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
