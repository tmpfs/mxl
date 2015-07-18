/**
 *  Run the program as a new set of arguments.
 *
 */
function sandbox(req, args, cb) {
  var cli = req.program;
  cli.configure().conflict = false;
  cli.reset(cli);
  delete cli.session;
  delete req.session;
  // switch bad arg order in cb signature
  cli.parse(args, function(req, err) {
    cb(err, req); 
  });
}

module.exports = sandbox;
