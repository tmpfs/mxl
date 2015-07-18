var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , utils = require('./util')
  , key = utils.key;

function Alias(conf, req) {
  this.conf = conf;
  this.rcname = conf.rc.name;
  /* istanbul ignore next: always use custom rc in test env */
  this.rcfile = path.join(
    process.env.MXL_RC_HOME || process.env.HOME, this.rcname);
  var rc = req.rc;
  this.map = req.rc.alias;
  this.rc = req.rc;
}

function set(key, value, req) {
  if(!/^\//.test(value)) {
    value = path.normalize(path.join(process.cwd(), value));
  }
  var info = {
    file: value,
    options: req.saveopts,
    cwd: req.savecwd
  }
  this.map[key] = info;

  return info;
}

function del(key) {
  delete this.map[key];
}

function get(key) {
  return this.map[key];
}

function getFile(key) {
  return this.map[key] && this.map[key].file ? this.map[key].file : undefined;
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
    rc.alias = this.map;
    // clean internal fields
    for(var k in rc.alias) {
      delete rc.alias[k].id; 
    }
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
Alias.prototype.getFile = getFile;

module.exports = Alias;
