module.exports = function remove(info, req, next) {
  var patterns = this.pattern.concat(info.args);
  if(!patterns.length) {
    return next(
      this.errors.ETOO_FEW_ARGS, [info.cmd.extra()]); 
  }
  console.dir(patterns) 
  next();
}
