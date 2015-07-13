module.exports = function ls(info, req, next) {
  for(var k in req.launch.map) {
    console.info(k + ' %s', req.launch.map[k]);
  }
  next();
}
