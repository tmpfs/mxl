var tpl = require('../../tpl')
  , utils = require('../../util')
  , key = utils.key;

module.exports = function list(info, req, next) {
  tpl.find(function onFind(err, results) {
    if(err) {
      return next(err) ;
    }
    var map = {};
    results.forEach(function(info) {
      var k = key(info.file);
      map[k] = info.relative; 
      console.info(k + ' %s', info.relative);
    })
    next();
  });
}
