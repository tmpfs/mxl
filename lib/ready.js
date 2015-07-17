var path = require('path');

function ready(req, next) {
  //req.recursive = this.recursive;
  req.all = this.all;
  req.noop = this.noop;

  // default file name
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
