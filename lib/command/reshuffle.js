var exec = require('child_process').exec
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function reshuffle(info, req, next) {
  var cmd = [TMUX, 'move-window', '-r'].join(' ')
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      return next(err); 
    } 
    next();
  });
}
