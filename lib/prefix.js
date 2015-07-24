var util = require('util')
  , ansi = require('ttycolor').ansi;

function prefix(record, tty) {
  var fmt = '⚡'

  if(!tty) {
    return fmt;
  }

  var col = 'cyan';
  switch(record.level) {
    case 50:
      col = 'red';
      break;
  }
  var c = ansi('⚡')[col];
  return c;
}

module.exports = prefix;
