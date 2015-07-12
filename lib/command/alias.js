module.exports = function alias(info, req, next) {
  var unparsed = info.args.slice(0);
  console.dir(req.vars)
  console.dir(unparsed)
  next();
}
