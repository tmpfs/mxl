module.exports = function kill(info, req, next) {
  console.dir('kill')
  next();
}
