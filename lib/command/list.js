var run = require('./run');

module.exports = function ls(info, req, next) {
  req.noop = true;
  run.call(this, info, req, next);
}
