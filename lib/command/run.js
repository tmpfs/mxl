var utils = require('../util')
  , resolve = utils.resolve
  , source = utils.source;

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
