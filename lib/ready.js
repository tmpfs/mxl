var path = require('path');

function ready(req, next) {
  req.all = this.all;
  req.noop = this.noop;
  req.recursive = this.recursive;
  req.each = this.each;
  req.pattern = this.pattern;

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

  // constants
  req.session = this.session;
  req.filename = 'tmux.conf';
  req.tmux = 'tmux';
  req.profid = ':';
  req.aliasid = '@';

  next();
}

module.exports = ready;
