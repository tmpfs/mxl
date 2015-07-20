var path = require('path')
  , uniq = require('./uniq');

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

  // current working directory for :source-file
  req.cwd = undefined;

  if(!this.dir.length) {
    this.dir.push(process.cwd());
  }

  this.dir = this.dir.map(function(f) {
    if(!/^\//.test(f)) {
      return path.normalize(path.join(process.cwd(), f));
    }
    return f;
  });

  this.dir = this.dir.filter(uniq);
  req.cwd = this.dir;
  next();
}

module.exports = ready;
