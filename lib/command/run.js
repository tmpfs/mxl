var path = require('path')
  , fs = require('fs')
  , Alias = require('../alias')
  , utils = require('../util')
  , key = utils.key
  , uniq = require('../uniq')
  , search = utils.search
  , source = utils.source;

module.exports = function run(info, req, next) {
  var conf = this.configure()
    , list = req.launch.list.slice(0)
    , runner = list.shift()
    , alias = new Alias(conf, req);

  function start(runner) {

    function onSourceComplete(err, res) {
      if(err) {
        return next(err);
      }

      var k = key(runner)
        , aliased = alias.get(k) !== undefined;

      if(!aliased) {
        alias.set(k, runner);
      }

      if(!req.noop && req.rc.autoalias && !aliased) {
        alias.write();
      }

      runner = list.shift();

      // all done
      if(!runner) {
        return next();
      }

      function showNext() {
        source(runner, info, req, onSourceComplete);
      }

      // TODO: allow disabling timeout
      setTimeout(showNext, req.rc.timeout);
    }

    source(runner, info, req, onSourceComplete);
  }

  if(this.recursive) {
    var dirs = req.launch.list;
    dirs = dirs.map(function(file) {
      return path.dirname(file);
    })
    req.launch.dirs = req.launch.dirs.concat(dirs);
    req.launch.dirs = req.launch.dirs.filter(uniq);
    req.recursive = true;

    function done(err, results) {
      list = results.map(function(info) {
        return info.file;
      })
      runner = list.shift();
      start(runner);
      next();
    }
    return search(info, req, done) ;
  }

  start(runner);
}
