var util = require('util');

/**
 *  Get a template string to be used when listing using tmux(1).
 *
 *  Creates a string that is well formed JSON.
 *
 *  The source object is a map between tmux(1) _FORMATS_ and the object 
 *  key names:
 *
 *  {session_id: 'id'}
 *
 *  Maps #{session_id} to the `id` field of the response JSON object.
 */
function getFormat(map) {
  var str
    , keys = Object.keys(map)
    , quote = '"'
    , lbrace = '{'
    , rbrace = '}'
    , k;

  str = quote + lbrace;

  keys.forEach(function(key, index) {
   str += util.format('\\"%s\\": \\"#{%s}\\"', map[key], key);
   if(index < (keys.length - 1)) {
      str += ',';
   }
  })

  str += rbrace + quote;
  return str;
}

module.exports = getFormat;
