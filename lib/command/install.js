var fs = require('fs')
  , path = require('path')
  , Alias = require('../alias')
  , utils = require('../util')
  , constants = require('../constants');

function copy(source, target, cb) {
  var called = false;
  function done(err) {
    /* istanbul ignore next: not going to mock pipe error */
    if (!called) {
      cb(err);
      called = true;
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
      /* istanbul ignore next */
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
    , alias = new Alias(this.configure(), req)
    , commands = this.commands()
    , errors = this.errors
    , force = this.force
    , map = {}
    , targets = [];

  // pick up aliases without assignment
  Object.keys(req.launch.aliases).forEach(function(key) {
    if(!req.vars[key]) {
      req.vars[key] = path.basename(alias.getFile(key));
    } 
  })

  // all alias references must exist for install
  for(k in req.vars) {
    if(!alias.get(k)) {
      return next(this.errors.EALIAS_NOT_FOUND, [constants.ALIAS_ID, k]) ;
    }
    req.launch.aliases[k] = alias.get(k);
  }

  if(!Object.keys(req.vars).length) {
    return next(
      this.errors.ETOO_FEW_ARGS, [info.cmd.extra()]); 
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
      source = alias.getFile(k);
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
