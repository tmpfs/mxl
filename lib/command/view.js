var exec = require('child_process').exec
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function view(info, req, next) {
  return next();
  //var cmd = [TMUX, 'move-window', '-r'].join(' ')
  //if(req.noop) {
    //return next(); 
  //}
  //exec(cmd, function(err, stdout, stderr) {
    //if(err) {
      //return next(err); 
    //} 
    //next();
  //});
}
