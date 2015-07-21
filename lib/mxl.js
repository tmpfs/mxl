//process.env.CLI_TOOLKIT_DEBUG=true;
//process.env.CLI_TOOLKIT_MIDDLEWARE_REQUEST=true;
//process.env.CLI_INPUT_NO_READLINE_PATCH=true;

var path = require('path')
  , util = require('util')
  , glue = require('cli-interface')
  , CommandInterface = glue.CommandInterface
  , cli = require('cli-command')
  , help = cli.help
  , rc = require('cli-rc')
  , logger = require('cli-logger')
  , ready = require('./ready')
  , before = require('./before')
  , run = require('./command/run')
  , expand = require('cli-property').expand
  , merge = require('cli-util').merge
  , base = path.normalize(path.join(__dirname, '..'))
  , constants = require('./constants');

var TmuxLauncher = function() {
  CommandInterface.apply(this, arguments);
}

util.inherits(TmuxLauncher, CommandInterface);

TmuxLauncher.prototype.configure = function() {
  var file = path.join(__dirname, this.name() + '.md');
  var options = {};
  var conf = {
    start: {
      time: new Date(),
      cwd: process.cwd()
    },
    stdin: false,
    trace: process.env.NODE_ENV === 'devel',
    compiler: {
      input: [file],
      output: path.join(__dirname, this.name() + 'c.js'),
      definition: options,
      cache: process.env.NODE_ENV !== 'devel'
    },
    command: {
      dir: path.join(__dirname, 'command'),
      required: false,
      before: before
    },
    error: {
      locales: path.join(__dirname, 'error', 'locales')
    },
    manual: {
      dir: path.join(base, 'doc', 'man'),
      dynamic: process.env.NODE_ENV === 'devel'
    },
    env: {
      merge: false,
      cache: true,
      //cache:  process.env.NODE_ENV !== 'test',
      rcmerge: function(env, rc) {
        var expanded = expand(env);
        var merged = merge(expanded, rc);
        return env;
      },
      expand: {
        delimiter: '.'
      },
      native: {delimiter: ',', json: false}
    },
    rc: {
      merge: true,
      type: rc.JSON,
      base: base,
      name: '.' + this.name() + 'rc.json',
      home: function() {
        /* istanbul ignore next: always use custom rc in test env */
        return process.env.MXL_RC_HOME || process.env.HOME;

      },
    },
    variables: {
      prefix: constants.ALIAS_ID
    },
    help: {
      width: 28
    },
    ready: ready,
  };
  this
    .configure(conf)
    .usage();
}

TmuxLauncher.prototype.use = function() {
  var opts = {level: logger.INFO, json: false};
  /* istanbul ignore next: always in test env */
  if(process.env.NODE_ENV !== 'test') {
    this.use(require('cli-mid-color'));
  }

  this
    .use(require('cli-mid-logger'), opts);
}

TmuxLauncher.prototype.on = function() {
  var scope = this
    , conf = this.configure()
    , wrap = this.wrap;
  this
    .once('load', function(req) {
      this
        .use(require('cli-mid-manual'))
        .help('-h | --help', 'Print help and exit')
        .version(null, null, 'Print version and exit');
    })
    .once('rc:load', function(rc, runcontrol, req){
      var file = path.join(runcontrol.path[0], runcontrol.name);
      var globalrc = runcontrol.store[file];
      req.globalrc = globalrc;
    })
    .on('complete', function onComplete(req) {
      var info = {args: req.result.unparsed}
        , scope = this;

      function onError(err, parameters, source) {
        scope.removeAllListeners('complete');
        scope.emit('error', wrap.call(scope, err, parameters, source));
      }

      function onRunComplete(err, parameters, source) {
        if(err) {
          return onError(err, parameters, source);
        }
        scope.emit('run:complete', req);
      }

      function onBeforeComplete(err, parameters, source) {
        if(err) {
          return onError(err, parameters, source);
        }
        run.call(scope, info, req, onRunComplete);
      }

      if(!req.command) {
        return before.call(scope, info, req, onBeforeComplete);
      }
    })
}

module.exports = function(pkg, name, description) {
  return new TmuxLauncher(pkg, name, description);
}
