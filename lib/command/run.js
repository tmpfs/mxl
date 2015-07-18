delete require.cache[require.resolve('../util')];

var path = require('path')
  , fs = require('fs')
  , find = require('fs-find')
  , Alias = require('../alias')
  , utils = require('../util')
  , key = utils.key
  , uniq = require('../uniq')
  , each = utils.each
  , reduce = utils.reduce;

module.exports = function run(info, req, next) {
  var conf = this.configure()
    , pattern = this.pattern
    , list = req.launch.list.slice(0)
    , alias = new Alias(conf, req);

  //console.dir(req.launch)

  function finish(err) {
    if(err) {
      return next(err); 
    } 

    var k, v, file, aliased, changed;
    for(file in req.launch.exec) {
      k = key(file);
      v = req.launch.exec[file];
      aliased = !v.system && alias.get(k) !== undefined;
      if(!aliased) {
        alias.set(k, file, req);
        changed = true;
      }
    }

    if(!req.noop && req.rc.autoalias && changed) {
      alias.write();
    }
    next();
  }

  if(this.each) {
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

      if(pattern.length) {
        // pattern match on resolved working directories
        try {
          results = reduce(results, pattern, req);
        }catch(e) {
          return next(e, e.parameters);
        }
      }
      req.launch.find.files = results;
      each(results, info, req, finish);
    })
  }

  utils.run(list, info, req, finish);
}
