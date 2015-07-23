var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , utils = require('./util')
  , constants = require('./constants')
  , normalize = require('./normalize')
  , key = utils.key;

function Alias(conf, req, opts) {
  opts = opts || {};
  this.conf = conf;
  this.rcname = conf.rc.name;
  /* istanbul ignore next: always use custom rc in test env */
  this.rcfile = path.join(
    process.env.MXL_RC_HOME || process.env.HOME, this.rcname);
  var rc = req.rc;
  // mutate display - alias list
  if(opts.mutate) {
    this.map = req.runcontrol.user.alias;
    if(req.all || opts.all) {
      this.map = req.rc.alias;
    }else if(req.global) {
      this.map = req.runcontrol.global.alias; 
    }
    // have to re-assign for assertions
    req.rc.alias = this.map;
  }else{
    this.map = req.runcontrol.user.alias;  
  }

  this.global = req.runcontrol.global.alias;
  this.user = req.runcontrol.user.alias;

  this.rc = req.rc;
}

function set(key, value, req) {
  value = normalize.absolute(value);
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
  if(this.map[key]) {
    return this.map[key];
  }else if(this.global && this.global[key]) {
    return this.global[key];
  }
}

function getFile(key) {
  var as = this.get(key);
  if(as) {
    return as.file; 
  }
  return undefined;
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
    // sync keys
    for(var k in rc.alias) {
      delete rc.alias[k].key;
    }
    console.info('write %s', file);
    fs.writeFileSync(file, JSON.stringify(rc, undefined, 2));
  }catch(e) {
    /* istanbul ignore next: not going to mock error */
    throw new Error(util.format('rc file write failed: %s', e.message));
  }
}

function isGlobal(key) {
  var base = path.normalize(path.join(__dirname, '..', 'conf', 'tpl'));
  if(this.user[key]) {
    return false; 
  }
  return Boolean(this.global[key] && !this.user[key])
    || (this.getFile(key) && this.getFile(key).indexOf(base) === 0);
}


var ops = {
  show: 'show',
  rm: 'rm',
  add: 'add'
};

// print alias attributes
function attrs(cwd, opts) {
  var prefix = constants.TREE_VIEW.child
    , att = [];
  if(cwd) {
    cwd.forEach(function(dir) {
      att.push({key: 'cwd', value: dir});
    })
  }
  if(opts) {
    att.push({key: 'options', value: JSON.stringify(opts)});
  }

  for(var i = 0;i < att.length;i++) {
    if(i === (att.length - 1)) {
      prefix = constants.TREE_VIEW.last; 
    } 
    console.info(' ' + prefix + ' ' + att[i].key + ' %s', att[i].value);
  }
}

function print(k, op) {
  var as = this.get(k)
    , file = this.getFile(k) || '';

  if(!op) {
    op = ops.show;
  }

  switch(op) {
    case ops.show:
      console.info(constants.ALIAS_ID + k + ' %s', file);
      break;
    case ops.rm:
      console.info('-' + k + ' %s', file);
      break;
    case ops.add:
      console.info('+' + k + ' %s', file);
      break;
  }
  if(as) {
    attrs(as.cwd, as.options);
  }
}

Alias.prototype.set = set;
Alias.prototype.del = del;
Alias.prototype.get = get;
Alias.prototype.read = read;
Alias.prototype.write = write;
Alias.prototype.print = print;
Alias.prototype.getFile = getFile;
Alias.prototype.isGlobal = isGlobal;

Alias.operations = ops;

module.exports = Alias;
