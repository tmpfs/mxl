var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , utils = require('./util')
  , key = utils.key;

function Alias(conf, req) {
  this.conf = conf;
  this.rcname = conf.rc.name;
  this.rcfile = path.join(process.env.HOME, this.rcname);
  var rc = req.rc;
  this.alias = req.rc.alias;
  this.rc = req.rc;
}

function set(key, value) {
  if(!/^\//.test(value)) {
    value = path.normalize(path.join(process.cwd(), value));
  }
  this.alias[key] = value;
}

function del(key) {
  delete this.alias[key];
}

function get(key) {
  return this.alias[key];
}

function read(file) {
  /* istanbul ignore next: never write to home directory in test env */
  file = file || this.rcfile;
  var rc = {};
  if(fs.existsSync(file)) {
    try {
      rc = require(file);
    }catch(e) {
      /* istanbul ignore next: not going to mock error */
      throw new Error(util.format('rc file read failed: %s', e.message));
    }
  }
  return rc;
}

function write(file) {
  /* istanbul ignore next: never write to home directory in test env */
  file = file || this.rcfile;
  var rc = {};
  try {
    rc = this.read(file);
    rc.alias = this.alias;
    console.info('write %s', file);
    fs.writeFileSync(file, JSON.stringify(rc, undefined, 2));
  }catch(e) {
    /* istanbul ignore next: not going to mock error */
    throw new Error(util.format('rc file write failed: %s', e.message));
  }
}

Alias.prototype.set = set;
Alias.prototype.del = del;
Alias.prototype.get = get;
Alias.prototype.read = read;
Alias.prototype.write = write;

module.exports = Alias;
