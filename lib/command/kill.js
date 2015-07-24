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
    , id
    , i
    , re
    , format
    , fmt = {session_name: 'session', window_id: 'window', pane_id: 'pane'}
    , items
    , disp = [TMUX, 'display', '-p', '-F', getFormat(fmt)].join(' ')
    , pane;

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

  id = killcmd.replace(/^kill-/, '');

  function print(item, prefix) {
    prefix = prefix || '-';
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
      var target = runner.id;
      if(id === 'session') {
        target = runner.name; 
      }
      var cmd = [TMUX, killcmd, '-t', '"' + target + '"'].join(' ');
      print(runner);
      // do not execute the kill-* command
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
      , matches = []
      , selfid;

    for(i = 0;i < list.length;i++) {
      item = list[i];
      for(j = 0;j < patterns.length;j++) {
        re = patterns[j];
        for(k in item) {
          v = item[k];
          if(re.test(v)) {
            // get id for current type
            selfid  = pane[id];
            if(item.id !== selfid) {
              matches.push(item); 
            }else{
              console.warn('!' + id + ': %j', item);
            }

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

  function parse(stdout) {
    stdout = (stdout || '').trim();
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
    return items;
  }

  // get information about *this* pane
  exec(disp, function(err, stdout, stderr) {
    if(err) {
      return next(err); 
    } 

    try {
      items = parse(stdout);
      pane = items[0];
    }catch(e) {
      return next(e);
    }

    // called with tmux not running?
    if(!pane) {
      return next('could not determine own pane'); 
    }

    // kill self with no patterns
    if(!patterns.length && !req.noop) {
      cmd = [TMUX, killcmd, '-t', '"' + pane[id] + '"'].join(' ');
      if(id === 'session') {
        var scmd = [ 
          TMUX, 'set-environment', '-g', 'mxl_scratch',
          '"' + constants.SCRATCH + '"',
          ';', TMUX, 'source-file', constants.ATTACH].join(' ');

        // attach to default session
        exec(scmd, function(err, stdout, stderr) {
          if(err) {
            return next(err);
          }

          // kill the session
          exec(cmd, next);
        })
      }else{
        // NOTE: callback will never be called on success
        exec(cmd, next);
      }
      return;
    }

    // get listing for target type
    exec(cmd, function(err, stdout, stderr) {
      if(err) {
        return next(err); 
      } 
      try {
        items = parse(stdout);
      }catch(e) {
        return next(e);
      }
      // filter and proceed to kill matches
      filter(items);
    });
  });
}
