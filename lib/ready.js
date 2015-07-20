var path = require('path')
  , normalize = require('./normalize');
  //, uniq = require('./uniq');

function ready(req, next) {

  // options passed to the request
  req.all = this.all;
  req.noop = this.noop;
  req.recursive = this.recursive;
  req.each = this.each;
  req.pattern = this.pattern;
  req.session = this.session;

  // recursive overrides all
  if(req.all && req.recursive) {
    req.all = false;
  }

  // expose reference for reparse()
  req.program = this;

  // reference to originally submitted dir args
  req.directories = this.dir.slice(0);

  // current working directories for :source-file
  req.cwd = this.dir.slice(0);
  req.cwd = normalize(req.cwd);

  req.dirs = req.cwd.slice(0);


  next();
}

module.exports = ready;
