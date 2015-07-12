//process.env.CLI_TOOLKIT_DEBUG=true;
//process.env.CLI_TOOLKIT_MIDDLEWARE_REQUEST=true;
//process.env.CLI_INPUT_NO_READLINE_PATCH=true;

var path = require('path')
  , util = require('util')
  , querystring = require('querystring')
  , glue = require('cli-interface')
  , cli = require('cli-command'), help = cli.help
  , rc = require('cli-rc')
  , logger = require('cli-logger')
  , CommandInterface = glue.CommandInterface
  , ready = require('./ready')
  , before = require('./before')
  , run = require('./command/run')
  , expand = require('cli-property').expand
  , merge = require('cli-util').merge
  , base = path.normalize(path.join(__dirname, '..'));

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
      //cache: true,
      cache:  process.env.NODE_ENV !== 'test',
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
      cache: process.env.NODE_ENV !== 'test',
      enabled: process.env.NODE_ENV !== 'test',
      base: base,
      name: '.' + this.name() + 'rc.json',
      home: function() {
        return process.env.HOME;
      },
    },
    variables: {
      prefix: '@'
    },
    help: {
      width: 26
    },
    ready: ready,
  };
  this
    .configure(conf)
    .usage();
}

TmuxLauncher.prototype.use = function() {
  var opts = {level: logger.INFO, json: false};
  this
    .use(require('cli-mid-color'))
    .use(require('cli-mid-logger'), opts);
}

TmuxLauncher.prototype.on = function() {
  var scope = this
    , conf = this.configure();
  this
    .once('load', function(req) {
      this
        .use(require('cli-mid-manual'))
        .help('-h | --help')
        .version(null, null, 'Print version and exit');
    })
    .once('complete', function(req) {
      var info = {args: req.result.unparsed}
        , scope = this;
      if(!req.command) {
        return before.call(scope, info, req, function onComplete() {
          run.call(scope, info, req, function noop(){});
        });
      }
    })
}

module.exports = function(pkg, name, description) {
  return new TmuxLauncher(pkg, name, description);
}
