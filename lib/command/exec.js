var exec = require('child_process').exec
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function execute(info, req, next) {

  if(!info.args.length) {
    return next(
      this.errors.ETOO_FEW_ARGS, [info.cmd.extra()]); 
  }

  var target = info.args.join(' ');
  var cmd = [ 
    TMUX, 'set-environment', '-g', 'mxl_cmd',
    '"' + target + '"',
    ';', TMUX, 'source-file', constants.SYSTEM.exec,
    ';', TMUX, 'set-environment', '-gu', 'mxl_cmd'].join(' ');

  req.log.info('> %s', target);

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
