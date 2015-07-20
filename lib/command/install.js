module.exports = function install(info, req, next) {
  console.dir('install called')
  console.dir(req.launch.alias)
  console.dir(req.launch.aliases)
  console.dir(req.vars)
  next();
}
