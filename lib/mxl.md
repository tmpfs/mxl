$0
==

Tmux launcher.

Finds files named either `tmux.conf` or with a `.tmux.conf` extension and 
executes using `tmux source-file`.

To inspect matched files use the `ls` command to test which files would be run 
use the `--noop` option: `$0 -a --noop`.

When no command is specified the `run` command is invoked.

## Commands

* `ls: ls`: List command files.
* `run: run, r`: Run tmux commands (source-file).
* `alias: alias, as`: Manage file aliases.
* `prune: prune, pr`: Remove stale aliases.

## Options

* `dir: -c | --directory [dir]`: Working directory used for `source-file`.
* `all: -a`: Match all configuration files.
* `noop: -n | --noop`: Print matched files, do not call `source-file`.
