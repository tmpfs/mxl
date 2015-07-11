var path = require('path');

function ready(req, next) {
  // default file name
  req.dir = process.cwd();
  // current working directory for source-file
  req.cwd = req.dir;
  if(this.dir) {
    req.cwd = this.dir;
    if(/^\./.test(this.dir)) {
      req.cwd = path.normalize(path.join(process.cwd(), this.dir));
    }
  }
  req.filename = 'tmux.conf';
  req.tmux = 'tmux';
  next();
}

module.exports = ready;
