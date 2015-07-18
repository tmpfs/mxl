var program = require('./mxl')
  , pkg = require('../package.json');

/**
 *  Run the program as a new instance.
 *
 *  Used when running aliases so saved options and 
 *  cwd settings do not interfere with the primary request.
 */
function sandbox(args, cb) {
  var facade = program(pkg)
    , cli = facade.program;
  cli.once('error', function(err) {
    cli.removeAllListeners();
    cb(err);
  })
  cli.once('complete', function(req) {
    cli.removeAllListeners();
    cb(null, req);
  })
  cli.parse(args);
}

module.exports = sandbox;
