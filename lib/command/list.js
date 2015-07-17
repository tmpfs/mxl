var path = require('path')
  , utils = require('../util')
  , search = utils.search
  , key = utils.key
  , uniq = require('../uniq');

module.exports = function ls(info, req, next) {
  var k, map = req.launch.map;
  for(k in map) {
    console.info(k + ' %s', map[k]);
  }
  next();
}
