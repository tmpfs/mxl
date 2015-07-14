var path = require('path')
  , fs = require('fs')
  , utils = require('./util')
  , key = utils.key;

function Alias(conf, req) {
  req.rc = req.rc || {};
  this.conf = conf;
  this.rcname = conf.rc.name;
  this.rcfile = path.join(process.env.HOME, this.rcname);
  var rc = req.rc || {};
  this.alias = req.rc.alias || {};
  this.rc = req.rc;
}

function set(key, value) {
  this.alias[key] = value;
}

function del(key) {
  delete this.alias[key];
}

function get(key) {
  return this.alias[key];
}

function write(file) {
  file = file || this.rcfile;
  var rc = {};
  try {
    if(fs.existsSync(file)) {
      try {
        rc = require(file);
      }catch(e) {
        console.warn('rc file read failed: %s', e.message);
      }
    }
    rc.alias = this.alias;
    console.info('write %s', file);
    fs.writeFileSync(file, JSON.stringify(rc, undefined, 2));
  }catch(e) {
    console.warn('rc file write failed: %s', e.message);
  }
}

Alias.prototype.set = set;
Alias.prototype.del = del;
Alias.prototype.get = get;
Alias.prototype.write = write;

module.exports = Alias;
