module.exports = function ls(info, req, next) {
  for(var k in req.launch.map) {
    console.log(k + ' %s', req.launch.map[k]);
  }
  next();
}