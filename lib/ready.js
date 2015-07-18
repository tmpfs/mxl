var path = require('path')
  , constants = require('./constants');

function ready(req, next) {

  // options passed to the request
  req.all = this.all;
  req.noop = this.noop;
  req.recursive = this.recursive;
  req.each = this.each;
  req.pattern = this.pattern;
  req.session = this.session;

  // default working directory value
  // is initial working directory
  req.dir = process.cwd();

  // current working directory for source-file
  req.cwd = undefined;

  if(this.dir) {
    req.cwd = this.dir;
    if(!/^\//.test(this.dir)) {
      req.cwd = path.normalize(path.join(process.cwd(), this.dir));
    }
  }

  next();
}

module.exports = ready;
