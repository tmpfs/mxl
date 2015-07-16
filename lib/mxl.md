$0
==

Tmux launcher.

Finds files named either `tmux.conf` or with a `.tmux.conf` extension and 
executes using `tmux source-file`.

When no command is specified the `run` command is invoked.

To inspect matched files use the `ls` command to test which files would be run 
use the `--noop` option: `$0 -a --noop`.

## Commands

* `list: list, ls`: List configuration files.
* `run: run, r <file> <dir> <:pattern> <@alias>`: Run tmux commands (source-file).
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

Manage aliases using an @ notation.

Aliases are automatically added if they do not already exist the first time a 
call to `source-file` succeeds for the file.

#### Launch

You may pass an alias reference to the `run` command:

```
$0 @alias-name
```

#### List

List aliases:

```
$0 alias
```

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

#### See

mxl-alias(1)

### Run

Invokes `tmux source-file` with the configuration files found by evaluating 
the arguments, use the `--noop` option to inspect what would be executed.

Arguments can be directories, files, alias references and file pattern matching 
expressions.

See mxl-alias(1) for more information on aliases.

#### Examples

Source `tmux.conf` in the current working directory:

```
$0
```

Source a file by directory:

```
$0 /usr/local/project
```

Source all `*.tmux.conf` files in the current working directory (and `tmux.conf` 
if present):

```
$0 -a
```

Use a pattern match on the filename to filter results returned with `-a` using 
a `:` prefix:

```
$0 -a ':^test'
```

Source a file by alias reference:

```
$0 @project
```

Source with multiple arguments:

```
$0 @project @alt-project /usr/local/project 
```

#### See

mxl-alias(1), mxl-list(1)

### Generate

Recursively searches the specified directories for configuration files and adds 
them as aliases unless the `--noop` option is specified.

#### See

mxl-alias(1)

## See

tmux(1)
