function ready(req, next) {
  // default file name
  req.dir = process.cwd();
  req.filename = 'tmux.conf';
  req.tmux = 'tmux';
  next();
}

module.exports = ready;
