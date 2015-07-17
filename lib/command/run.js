var path = require('path')
  , fs = require('fs')
  , find = require('fs-find')
  , Alias = require('../alias')
  , utils = require('../util')
  , key = utils.key
  , uniq = require('../uniq')
  , search = utils.search
  , each = utils.each
  , source = utils.source;

module.exports = function run(info, req, next) {
  var conf = this.configure()
    , list = req.launch.list.slice(0)
    , alias = new Alias(conf, req);

  // TODO: reinstate autoalias logic!

  //function start(list) { 
    //var runner = list.shift();

    //function onSourceComplete(err, res) {
      //if(err) {
        //return next(err);
      //}

      //var k = key(runner)
        //, aliased = alias.get(k) !== undefined;

      //if(!aliased) {
        //alias.set(k, runner);
      //}

      //if(!req.noop && req.rc.autoalias && !aliased) {
        //alias.write();
      //}

      //runner = list.shift();

      //// all done
      //if(!runner) {
        //return next();
      //}

      //function showNext() {
        //source(runner, info, req, onSourceComplete);
      //}

      //// TODO: allow disabling timeout
      //setTimeout(showNext, req.rc.timeout);
    //}

    //source(runner, info, req, onSourceComplete);
  //}

  if(this.each) {
    //console.dir('run on each sub directory') 

    function folder(path, info) {
      if(utils.folder(path, info) === false) {
        return false;
      }
      return true;
    }

    var opts = {
      dirs: true,
      depth: 1,
      file: find.reject,
      folder: folder,
      exclude: true
    };

    // prefer -c
    req.dir = this.dir || req.dir;

    // find direct child directories of the target dir
    // either the -c option or the process working directory
    return find(req.dir, opts, function(err, results) {
      /* istanbul ignore next: difficult to mock */
      if(err) {
        return next(err);
      }

      req.launch.find = {results: results};

      // working directories for launch
      results = results.map(function(info) {
        return info.file;
      })
      req.launch.find.files = results;
      each(results, info, req, next);
    })
  }

  utils.run(list, info, req, next);
}
