var util = require('util')
  , ansi = require('ttycolor').ansi;

function prefix(record, tty) {
  var fmt = '⚡'

  if(!tty) {
    return fmt;
  }

  //console.dir(record.level)

  var col = 'cyan';
  switch(record.level) {
    // error
    case 50:
      col = 'red';
      break;
    // warn
    case 40:
      col = 'magenta';
      break;
    // do not use prefix for info messages
    case 30:
      return '';
  }
  var c = ansi(fmt)[col];
  return c;
}

module.exports = prefix;
