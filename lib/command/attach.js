var exec = require('child_process').exec
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function attach(info, req, next) {

  var cmd = [ 
    TMUX, 'set-environment', '-g', 'mxl_scratch',
    '"' + (info.args[0] || constants.SCRATCH) + '"',
    ';', TMUX, 'source-file', constants.ATTACH,
    ';', TMUX, 'set-environment', '-gu', 'mxl_scratch'].join(' ')

  //console.dir(cmd)

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
