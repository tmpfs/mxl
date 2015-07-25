var util = require('util')
  , exec = require('child_process').exec
  , constants = require('../constants')
  , parse = require('../parse')
  , getFormat = require('../format')
  , TMUX = constants.TMUX;

module.exports = function attach(info, req, next) {
  var format = {
    session_id: 'id',
    session_name: 'name',
    session_windows: 'windows',
    session_attached: 'attached'
  }
  format = getFormat(format);

  // TODO: definitive get scratch name
  var listcmd = [TMUX, 'list-sessions', '-F', format].join(' ')
    , target = info.args[0] || constants.SCRATCH;

  exec(listcmd, function(err, stdout, stderr) {
    if(err) {
      return next(err); 
    } 

    var items = parse(stdout)
      , current
      , iscurrent
      , exact
      , matches;

    // map indices
    items.forEach(function(item, index) {
      item.index = index;
      if(item.name === target) {
        exact = target; 
      }
      if(parseInt(item.attached)) {
        current = item;
      }
    })

    if(!exact) {
      matches = items.filter(function(item) {
        return item.name && item.name.indexOf(target) === 0;
      })

      // NOTE: tmux will fnmatch on single session matches
      // NOTE: and select the right session so we only need
      // NOTE: to print hints on multiple matches

      // print matches
      if(matches.length > 1) {
        matches.forEach(function(item) {
          var msg = util.format('(%s) + %s: %d windows',
            item.index, item.name, item.windows);

          if(parseInt(item.attached)) {
            msg += ' (attached)';
          }

          req.log.info(msg);
        })
        return next();
      // NOTE: in the case of an arg of '/' fnmatch fails so we
      // NOTE: can handle this case
      }else if(matches.length === 1) {
        target = matches[0].name;

      // see if a regexp match produces a single match
      }else{
        var re;
        try {
          re = new RegExp(target);
          matches = items.filter(function(item) {
            return re.test(item.name);
          })
          if(matches.length === 1) {
            target = matches[0].name;
          }
        // we can let this fail
        }catch(e){
          req.log.warn(e);
        }
      }
    }

    if(current && current.name === target) {
      return next('already attached to %s', [target]); 
    }

    var cmd = [ 
      TMUX, 'set-environment', '-g', 'mxl_session',
      '"' + target + '"',
      ';', TMUX, 'source-file', constants.SYSTEM.attach,
      ';', TMUX, 'set-environment', '-gu', 'mxl_session'].join(' ');

    if(req.noop) {
      return next(); 
    }

    exec(cmd, function(err, stdout, stderr) {
      if(err) {
        return next(err); 
      } 

      var res;
      try {
        res = JSON.parse(stdout)
        if(res && res.err && res.msg) {
          return next(res.msg); 
        }
      }catch(e) {}

      next();
    });
  });

}
