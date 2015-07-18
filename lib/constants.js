var constants = {
  FILENAME: 'tmux.conf',
  TMUX: 'tmux',
  ALIAS_ID: '@',
  ALIAS_OPTION_KEYS: [
    'all',
    'recursive',
    'each',
    'pattern',
    'session'
  ],
  ALIAS_OPTION_MAP: {}
}

constants.ALIAS_OPTION_KEYS.forEach(function(key) {
  constants.ALIAS_OPTION_MAP[key] = '--' + key;
});

module.exports = constants;
