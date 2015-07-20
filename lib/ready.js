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

  // default working directory value
  // is initial working directory
  req.dir = process.cwd();

  req.dirs = this.dir;

  // current working directories for :source-file
  req.cwd = this.dir.slice(0);
  req.cwd = normalize(req.cwd);

  next();
}

module.exports = ready;
