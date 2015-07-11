module.exports = function ls(info, req, next) {
  var aliases = req.rc.alias || {};
  for(var k in aliases) {
    console.log(k + ' %s', aliases[k]); 
  }
  return next();
}
