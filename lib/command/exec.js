var exec = require('child_process').exec
  , tmenv = require('../env')
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function execute(info, req, next) {

  if(!info.args.length) {
    return next(
      this.errors.ETOO_FEW_ARGS, [info.cmd.extra()]); 
  }

  req.fullscreen = this.fullscreen;

  // pass quoted args through
  //info.args = info.args.map(function(arg) {
    //if(/\s+/.test(arg)) {
      //return '"' + arg + '"'; 
    //} 
    //return arg;
  //})

  var target = info.args.join(' ');
  // NOTE: have to split and retrieve reference here due to 
  // NOTE: environment variable bug on *first run*
  var cmd = [
    TMUX, 'split-window',
    ';', TMUX, 'display', '-p', '-F', '"#S:#W.#P"'
  ].join(' ');

  req.log.info('> %s', target);

  if(req.noop) {
    return next(); 
  }

  exec(cmd, {env: process.env}, function(err, stdout, stderr) {
    if(err) {
      return next(err); 
    } 

    var cmd = [
      TMUX, 'source-file', constants.SYSTEM.exec
    ].join(' ');

    var env = {
      mxl_cmd: target,
      mxl_fullscreen: req.fullscreen ? '1' : '',
      mxl_target: stdout.trim()
    };

    var envset = tmenv.set(env, {exec: true, terminate: true}, req);
    cmd = envset + cmd;
    exec(cmd, {env: process.env}, function(err, stdout, stderr) {
      if(err) {
        return next(err); 
      } 
      next();
    });
  });
}
