var path = require('path')
  , base = path.normalize(path.join(__dirname, '..', 'conf', 'tpl'))
  , utils = require('./util')
  , file = utils.file
  , folder = utils.folder
  , find = require('fs-find');

function finder(info, req, next) {
  var opts = {file: file, folder: folder};
  find([base, path.dirname(base)], opts, next);
}

module.exports = {
  find: finder,
}
