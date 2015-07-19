var tpl = require('../../tpl');

module.exports = function list(info, req, next) {
  console.log('list templates')
  tpl.find(info, req, function onFind(err, results) {
    if(err) {
      return next(err) ;
    }
    console.dir(results) 
    next();
  });
}
