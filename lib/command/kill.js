var exec = require('child_process').exec
  , constants = require('../constants')
  , TMUX = constants.TMUX;

module.exports = function kill(info, req, next) {
  var patterns = info.args.slice(0)
    , cmd
    , i
    , re
    , format;

  // compile args
  for(i = 0;i < patterns.length;i++) {
    try {
      re = new RegExp(patterns[i]);
      patterns[i] = re;
    }catch(e) {
      return next(e);
    }
  }

  // -p args in this.pattern are already compiled
  patterns = this.pattern.concat(patterns);

  // operating on sessions
  if(this.kills && !this.killw) {
    format = '"#{session_name} #{session_id}"';
    cmd = [TMUX, 'list-sessions', '-F', format].join(' ');
  // operating on windows
  }else{
    format = '"#{window_name} #{window_id}"';
    cmd = [TMUX, 'list-windows', '-F', format].join(' ');
  }

  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      return next(err); 
    } 
    stdout = (stdout || '').trim();
    var lines = stdout.split('\n');
    lines.forEach(function(line) {
      console.info(line); 
    })
    next();
  })
}
