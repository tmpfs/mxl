var spawn = require('child_process').spawn
  , constants = require('../constants')
  , EDITOR = constants.EDITOR;

module.exports = function view(info, req, next) {
  var files = req.launch.list.map(function(item) {
    return item.file; 
  })

  if(req.noop) {
    return next(); 
  }

  var opts = {stdio: 'inherit', env: process.env};
  spawn(EDITOR, files, opts);
  next();
}
