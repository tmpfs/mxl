module.exports = function template(info, req, next){
  //if(!info.args.length) {
    //return req.error(this.errors.ENO_SUBCOMMAND, req, next);
  //}
  info.validate(function response(err, parameters) {
    if(err) {
      return next(err, parameters);
    }
    next(info.cmd.commands());
  })
}
