var utils = require('../util')
  , resolve = utils.resolve
  , strip = utils.strip
  , key = utils.key;

module.exports = function ls(info, req, next) {
  resolve(info, req, function(err, paths) {
    if(err) {
      return next(err);
    }
    paths.forEach(function(pth) {
      var k = key(pth);
      console.log(k + ' %s', pth);
    })
    next();
  });
}
