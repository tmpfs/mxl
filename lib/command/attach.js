var exec = require('child_process').exec
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function attach(info, req, next) {

  var cmd = [ 
    TMUX, 'set-environment', '-g', 'mxl_session',
    '"' + (info.args[0] || constants.SCRATCH) + '"',
    ';', TMUX, 'source-file', constants.SYSTEM.attach,
    ';', TMUX, 'set-environment', '-gu', 'mxl_session'].join(' ')

  if(req.noop) {
    return next(); 
  }

  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      return next(err); 
    } 
    next();
  });
}
