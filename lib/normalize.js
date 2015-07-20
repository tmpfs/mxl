var path = require('path')
  , uniq = require('./uniq');

function absolute(item) {
  var file = item.file || item;
  // make . and ./ equal string wise
  file = file .replace(/\/+$/, '');
  if(!/^\//.test(file)) {
    return path.normalize(path.join(process.cwd(), file));
  }
  return file;
}

function normalize(list) {
  list = list.map(function(item) {
    return absolute(item.file || item);
  })
  return list.filter(uniq);
}

normalize.absolute = absolute;

module.exports= normalize;
