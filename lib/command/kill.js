var exec = require('child_process').exec
  , util = require('util')
  , constants = require('../constants')
  , getFormat = require('../format')
  , TMUX = constants.TMUX;

module.exports = function kill(info, req, next) {
  var errors = this.errors
    , patterns = info.args.slice(0)
    , cmd
    , killcmd
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
    format = getFormat(format);
    killcmd = 'kill-session';
    cmd = [TMUX, 'list-sessions', '-F', format].join(' ');

  // operating on panes
  }else if(this.killp) {
    format = {
      pane_id: 'id',
      pane_current_command: 'cmd',
      pane_current_path: 'path'
    }
    format = getFormat(format);
    killcmd = 'kill-pane';
    cmd = [TMUX, 'list-panes', '-F', format].join(' ');

  // operating on windows
  }else{
    format = {
      window_id: 'id',
      window_name: 'name'
    }
    format = getFormat(format);
    killcmd = 'kill-window';
    cmd = [TMUX, 'list-windows', '-F', format].join(' ');
  }

  function print(item, prefix) {
    prefix = prefix || '-';
    var id = killcmd.replace(/^kill-/, '');
    console.info(prefix + id + ': %j', item);
  }

  // iterate over matches and send the command
  function destroy(matched) {

    function done(err) {
      if(err) {
        return next(err);
      } 

      if(!matched.length) {
        return next(); 
      }

      killer(matched.shift(), done);
    }

    function killer(runner, cb) {
      var cmd = [TMUX, killcmd, '-t', runner.id].join(' ');
      print(runner);

      if(req.noop) {
        return cb(); 
      }

      exec(cmd, cb);
    }

    killer(matched.shift(), done);
  }

  // filter list results against supplied patterns
  function filter(list) {
    var i
      , j
      , re
      , k
      , v
      , item
      , matches = [];

    //console.dir(list)
    for(i = 0;i < list.length;i++) {
      item = list[i];
      //console.dir(item)
      for(j = 0;j < patterns.length;j++) {
        re = patterns[j];
        for(k in item) {
          v = item[k];
          if(re.test(v)) {
            matches.push(item); 
            j = patterns.length;
            break;
          }
        }
      }
    }

    if(!matches.length) {
      return next(errors.EPATTERN_MATCH);
    }

    destroy(matches);
  }

  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      return next(err); 
    } 
    stdout = (stdout || '').trim();
    // get listing
    var lines = stdout.split('\n')
      , i
      , item
      , items = [];
    for(i = 0;i < lines.length;i++) {
      try {
        item = JSON.parse(lines[i]);
        items.push(item);
      }catch(e) {
        return next(e);
      }
    }
    filter(items);
  })
}
