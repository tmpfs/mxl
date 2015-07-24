var path = require('path')
  , conf = path.normalize(path.join(__dirname, '..', 'conf'))
  , tpl = path.join(conf, 'tpl')
  , session = path.join(conf, 'session.tmux.conf')
  , attach = path.join(conf, 'attach.tmux.conf')

var constants = {
  SCRATCH: process.env.mxl_scratch || '/launch',
  ENV_PREFIX: 'mxl_',
  CONF: conf,
  TPL: tpl,
  SESSION: session,
  ATTACH: attach,
  FILENAME: 'tmux.conf',
  EXTENSION: '.tmux.conf',
  TMUX: 'tmux',
  ALIAS_ID: '@',
  ALIAS_OPTION_KEYS: [
    'all',
    'recursive',
    'each',
    'pattern',
    'session'
  ],
  ALIAS_OPTION_MAP: {},
  TREE_VIEW: {
    child: '├──',
    last: '└──',
    pipe: '│',
    plus: '+'
  },
  PATTERN: {
    ptn: /^(tmux\.conf|.+\.tmux\.conf)$/,
    extension: /(\.tmux)?\.conf$/
  }
}

constants.ALIAS_OPTION_KEYS.forEach(function(key) {
  constants.ALIAS_OPTION_MAP[key] = '--' + key;
});

module.exports = constants;
