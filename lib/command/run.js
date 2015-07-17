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
      if(err) {
        return next(err);
      }

      // working directories for launch
      results = results.map(function(info) {
        return info.file;
      })
      each(results, info, req, next);
    })
  }

  utils.run(list, info, req, next);
}
