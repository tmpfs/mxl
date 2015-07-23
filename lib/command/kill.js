var exec = require('child_process').exec
  , util = require('util')
  , constants = require('../constants')
  , TMUX = constants.TMUX;

function getFormatString(map) {
  var str
    , keys = Object.keys(map)
    , quote = '"'
    , lbrace = '{'
    , rbrace = '}'
    , k;

  str = quote + lbrace;

  keys.forEach(function(key, index) {
   str += util.format('\\"%s\\": \\"#{%s}\\"', map[key], key);
   if(index < (keys.length - 1)) {
      str += ', ';
   }
  })

  str += rbrace + quote;

  //console.dir(str)

  return str;
}

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

  if(!patterns.length) {
    return next(
      this.errors.ETOO_FEW_ARGS, [info.cmd.extra()]); 
  }

  // operating on sessions
  if(this.kills && !this.killw && !this.killp) {
    format = {
      session_id: 'id',
      session_name: 'name'
    }
    format = getFormatString(format);
    cmd = [TMUX, 'list-sessions', '-F', format].join(' ');

  // operating on panes
  }else if(this.killp) {
    format = {
      pane_id: 'id',
      pane_current_command: 'cmd',
      pane_current_path: 'path'
    }
    format = getFormatString(format);
    cmd = [TMUX, 'list-panes', '-F', format].join(' ');

  // operating on windows
  }else{
    format = {
      window_id: 'id',
      window_name: 'name'
    }
    format = getFormatString(format);
    cmd = [TMUX, 'list-windows', '-F', format].join(' ');
  }

  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      return next(err); 
    } 
    stdout = (stdout || '').trim();
    // get listing
    var lines = stdout.split('\n')
      , i
      , item;

    for(i = 0;i < lines.length;i++) {
      //console.dir(lines[i]);
      try {
        item = JSON.parse(lines[i]);
      }catch(e) {
        return next(e);
      }
      console.dir(item);
    }
    next();
  })
}
