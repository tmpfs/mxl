function ready(req, next) {
  // default file name
  req.filename = 'tmux.conf';
  req.tmux = 'tmux';
  next();
}

module.exports = ready;
