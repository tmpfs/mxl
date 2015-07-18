var TmuxLauncher = require('./launcher');

module.exports = function(pkg, name, description) {
  return new TmuxLauncher(pkg, name, description);
}
