var exec = require('child_process').exec
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function quit(info, req, next) {
  var cmd = [TMUX, 'kill-server'].join(' ')
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
