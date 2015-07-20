var fs = require('fs')
  , path = require('path')
  , utils = require('../util')
  , constants = require('../constants');

function copy(source, target, cb) {
  var cbCalled = false;
  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
  var rd = fs.createReadStream(source);
  rd.on("error", done);
  var wr = fs.createWriteStream(target);
  wr.on("error", done);
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);
}

function installer(map, info, req, next) {
  var sources = Object.keys(map)
    , source = sources.shift()
    , target = map[source];
  function doCopy(source, target) {
    copy(source, target, function onCopy(err) {
      if(err) {
        return next(err);
      } 
      if(!sources.length) {
        return next(); 
      }
      source = sources.shift();
      doCopy(source, map[source]);
    }) 
  }
  doCopy(source, target);
}

module.exports = function install(info, req, next) {
  var k
    , v
    , commands = this.commands()
    , errors = this.errors
    , force = this.force
    , map = {}
    , targets = [];

  // pick up aliases without assignment
  req.launch.alias.forEach(function(key) {
    if(req.rc.alias[key] && !req.vars[key]) {
      req.vars[key] = path.basename(req.rc.alias[key].file);
    } 
  })

  // all alias references must exist for install
  for(k in req.vars) {
    if(!req.rc.alias[k]) {
      return next(this.errors.EALIAS_NOT_FOUND, [constants.ALIAS_ID, k]) ;
    }
    req.launch.aliases[k] = req.rc.alias[k];
  }

  // map source alias files to output file names
  if(!req.cwd.length) {
    req.cwd.push(process.cwd()) ;
  }

  req.cwd.forEach(function(dir) {
    var k, v, source, target;
    for(k in req.vars) {
      v = req.vars[k];
      v = utils.suffix(v);
      source = req.rc.alias[k].file;
      target = path.join(dir, v);
      if(~targets.indexOf(target)) {
        return next(errors.ENAME_CONFLICT, [target]);
      }
      if(!fs.existsSync(source)) {
        return next(
          errors.EALIAS_SOURCE, [k, source, commands.prune.names()[0]]);
      }else if(fs.existsSync(target) && !force) {
        return next(errors.EFILE_EXISTS, [target]);
      }
      map[source] = target;
      targets.push(target);
      console.info('%s -> %s', source, target);
    }
  })

  if(req.noop) {
    return next(); 
  }

  installer(map, info, req, next);
}
