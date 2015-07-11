var utils = require('../util')
  , resolve = utils.resolve
  , strip = utils.strip;

module.exports = function ls(info, req, next) {
  resolve(info, req, function(err, paths) {
    if(err) {
      return next(err);
    }
    paths.forEach(function(pth) {
      console.log(strip(pth) + ' %s', pth);
    })
    next();
  });
}
