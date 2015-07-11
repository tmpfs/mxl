var path = require('path')
  , spawnSync = require('child_process').spawnSync;

function resolve(info, req, next) {
  var files = [];
  if(!info.args.length) {
    files.push(path.join(process.cwd(), req.filename));
  }else{
    files = info.args; 
  }
  next(null, files);
}

function source(conf, info, req, next) {
  console.log('source: ' + conf)
  var dir = path.dirname(conf);
  spawnSync(
    req.tmux, ['source-file'].concat(conf), {env: process.env, cwd: dir});
  next();
}

module.exports = function run(info, req, next) {
  resolve(info, req, function(err, paths) {
    if(err) {
      return next(err);
    }
    var list = paths.slice(0);
    function onSourceComplete(err, res) {
      if(err) {
        return next(err);
      }
      var runner = list.shift();
      // all done
      if(!runner) {
        return next();
      }

      source(runner, info, req, onSourceComplete);
    }
    source(list.shift(), info, req, onSourceComplete);
  });
}
