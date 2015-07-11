$0
==

Tmux launcher.

Reads tmux command configurations and executes commands in sequence.

<!--- top-level commands and options -->

## Commands

* `run: run, r`: Run a command sequence profile.
* `alias: alias, as`: Manage alias shortcuts.

## Options

* `--force`: Force file overwrite.

<!--- command definitions -->

### Alias

Aliases allow users to map names to commonly used locations, a location being a 
directory containing a tmux command configuration.

#### Commands

* `get: get <alias>`: Print an alias.
* `add: add <alias> <dir>`: Add an alias.
* `rm: rm <alias>`: Remove an alias.
* `ls: ls`: List aliases.
