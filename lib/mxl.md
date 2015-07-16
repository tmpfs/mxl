$0
==

Tmux launcher.

Finds files named either `tmux.conf` or with a `.tmux.conf` extension and 
executes using `tmux source-file`.

To inspect matched files use the `ls` command to test which files would be run 
use the `--noop` option: `$0 -a --noop`.

When no command is specified the `run` command is invoked.

## Commands

* `list: list, ls`: List configration files.
* `run: run, r`: Run tmux commands (source-file).
* `alias: alias, as <@alias=file>`: Manage file aliases.
* `prune: prune, pr`: Remove stale aliases.
* `generate: index, in <dir...>`: Generate alias index.

## Options

* `dir: -c | --directory [dir]`: Working directory used for `tmux` process.
* `all: -a`: Match all configuration files.
* `noop: -n | --noop`: Print matched files, do not call `source-file`.
* `recursive: -r | --recursive`: Match files recursively.

### List

List configuration files, preferring an index file `tmux.conf` by default. Use 
the `-a` option to list all configuration files in a given directory and `-r` to
perform a recursive search.

### Alias

Manage aliases using an `@` notation.

When called with no alias references the command will print the current alias 
list `$0 alias`.

Aliases are automatically added if they do not already exist the first time a 
call to `source-file` succeeds for the file.

#### Add

To add or update an alias manually assign to the alias:

```
$0 alias @project=/usr/local/project
```

#### Delete

Assign the empty string to delete an alias.

```
$0 alias @project=
```

### Prune

As files are moved or deleted aliases may get out of date, run the `prune` 
command to remove alias entries for files that no longer exist.

### Run

The default command when no command is specified, invokes `tmux source-file` 
with the configuration files found by evaluating the arguments.

### Generate

Recursively searches the specified directories for 
