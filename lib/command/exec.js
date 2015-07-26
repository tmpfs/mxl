var exec = require('child_process').exec
  , tmenv = require('../env')
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function execute(info, req, next) {

  if(!info.args.length) {
    return next(
      this.errors.ETOO_FEW_ARGS, [info.cmd.extra()]); 
  }

  // pass quoted args through
  info.args = info.args.map(function(arg) {
    if(/\s+/.test(arg)) {
      return '"' + arg + '"'; 
    } 
    return arg;
  })

  var target = info.args.join(' ');
  var cmd = [TMUX, 'source-file', constants.SYSTEM.exec].join(' ');

  var env = {
    mxl_cmd: target,
    mxl_fullscreen: this.fullscreen ? '1' : ''
  };

  var envset = tmenv.set(env, {exec: true, terminate: true}, req);
  env.mxl_target = '';
  cmd = envset + cmd;

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
