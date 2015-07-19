$0
==

Tmux launcher.

Finds files named either `tmux.conf` or with a `.tmux.conf` extension and 
executes using `tmux source-file`.

When no command is specified the `run` command is invoked.

The `--noop` option applies to all commands except `ls` and `help`, in the case 
of operations on aliases the rc file is not written.

## Commands

* `list: list, ls`: List configuration files.
* `run: run <file> <dir> <@alias>`: Source tmux configuration files.
* `alias: alias, as <@alias=file>`: Manage file aliases.
* `prune: prune, pr`: Remove stale aliases.
* `generate: index, in <dir...>`: Generate alias index.
* `template: template, tpl`: Manage file templates.

## Options

* `dir: -c | --directory [dir]`: Working directory used for `tmux` process.
* `pattern: -p | --pattern [ptn ...]`: Filter files by regexp pattern(s).
* `all: -a, --all`: Match all configuration files.
* `noop: -n | --noop`: Print matched files, do not call `source-file`.
* `recursive: -r | --recursive`: Match files recursively.

### Template

List, copy, link, show and edit templates.

#### Commands

* `list: list, ls`: List template files.
* `copy: copy, cp`: Copy template files.

### List

List configuration files, preferring an index file `tmux.conf` by default. Use 
the `-a` option to list all configuration files in a given directory and `-r` to
perform a recursive search.

When the `-a` and `-r` options are combined the search is recursive, `-r` takes 
precedence.

### Alias

Manage aliases using an @ notation.

Aliases are automatically added if they do not already exist the first time a 
call to `source-file` succeeds and are re-written to `~/.mxlrc.json`. The rc 
file is created if it does not exist.

#### Automatic

The rules for alias names created automatically are:

* When the file is `tmux.conf` use the name of the parent directory.
* When the file has a `.tmux.conf` extension concatenate the parent directory 
name with the name of the file after the extension has been removed. The 
delimiter for concatenation is `/`.

You may disable automatically adding aliases by modifying the `autoalias` 
rc option.

Note that if you run a file that kills the current window (`unlink-window` etc) 
aliases will not be added automatically as the process will have been killed 
before the success handler returns. To workaround this run from another window, 
eg: `mxl ~/project`.

#### Launch

You may pass an alias reference to the `run` command:

```
$0 @project
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

#### Options

* `each: -e | --each`: Iterate child directories and set `-c` for each directory.
* `session: -s | --session <name>`: Create session before source file(s).

#### Environment

Before calls to `source-file` the following environment variables are set 
using `set-environment -g`:

* `mxl_key`: An identifier for a session or window.
* `mxl_file`: The path to the configuration file.
* `mxl_filename`: The name of the configuration file.
* `mxl_cwd`: The working directory for the `tmux` process.
* `mxl_cwdname`: The name of the working directory.

#### Each

The `--each` switch changes the behaviour of execution to take the value of 
`-c | --directory` (which will be the working directory if not specified) 
find all direct child directories and iterate the result executing 
all matched configuration files for each directory found.

This feature is designed for a project comprising of modules:

```
project
├── client
├── db
├── server
└── tmux.conf
```

You can execute the commands in `tmux.conf` for each module with:

```
cd project && mxl --each
```

Typically used to open a window and pane set for all modules of a project from 
a single configuration file.

When the `--each` flag is used the behaviour of `--pattern` changes to 
match the child working directory path rather than the configuration file 
path(s) so that it may be used as a filter.

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

Use a pattern match on the file path to filter results returned with `-a` using 
the `-p` option:

```
$0 -a -p 'test'
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

## Patterns

When the `-p | --pattern` option is specified it is applied to the results of 
searching for configuration files except in the case of `-e | --each` when the 
behaviour changes to match on the current working directory context, see 
mxl-run(1) for more information on `--each`.

Patterns are compiled to regular expressions and are matched against the full 
file system path.

If any of the patterns match the file is included (logical OR).

## See

tmux(1)
