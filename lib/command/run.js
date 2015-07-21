var path = require('path')
  , find = require('fs-find')
  , Alias = require('../alias')
  , utils = require('../util')
  , key = utils.key
  , each = utils.each
  , reduce = utils.reduce;

module.exports = function run(info, req, next) {
  var conf = this.configure()
    , pattern = this.pattern
    , list = req.launch.list.slice(0)
    , alias = new Alias(conf, req);

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

  if(!req.cwd.length) {
    req.cwd.push(process.cwd());
  }

  if(req.each) {

    var opts = {
      dirs: true,
      depth: 1,
      file: find.reject,
      folder: utils.folder,
      exclude: true,
      absolute: true
    };

    // find direct child directories of the target directories
    // either the -c option or the process working directory
    return find(req.cwd, opts, function(err, results) {
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
        results = reduce(results, pattern, req);
      }
      req.launch.find.files = results;
      each(results, info, req, finish);
    })
  }

  each(req.cwd, info, req, finish);
}
