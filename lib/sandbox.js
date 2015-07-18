var path = require('path')
  , spawn = require('child_process').spawn
  , exe = path.join(__dirname, '..', 'bin', 'mxl');

/**
 *  Run the program as a new instance.
 *
 *  Used when running aliases so saved options and 
 *  cwd settings do not interfere with the primary request.
 */
function sandbox(args, cb) {
  var opts = {env: process.env, cwd: process.cwd(), stdio: 'inherit'};
  //console.dir(exe);
  //console.dir(args);
  //return cb();
  spawn(exe, args, opts, function(err) {
    if(err) {
      return cb(err) ;
    } 
    cb();
  })
}

module.exports = sandbox;
