function parse(stdout) {
  stdout = (stdout || '').trim();
  var lines = stdout.split('\n')
    , i
    , item
    , items = [];
  for(i = 0;i < lines.length;i++) {
    try {
      item = JSON.parse(lines[i]);
      items.push(item);
    }catch(e) {
      return next(e);
    }
  }
  return items;
}

module.exports = parse;
