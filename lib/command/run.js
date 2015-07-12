var utils = require('../util')
  , source = utils.source;

module.exports = function run(info, req, next) {
  var list = req.launch.list.slice(0)
    , runner = list.shift();

  function onSourceComplete(err, res) {
    if(err) {
      return next(err);
    }
    runner = list.shift();

    // all done
    if(!runner) {
      return next();
    }

    source(runner, info, req, onSourceComplete);
  }
  if(runner) {
    source(runner, info, req, onSourceComplete);
  }
}
