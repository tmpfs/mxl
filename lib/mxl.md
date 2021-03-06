$0
==

Tmux launcher.

Finds files named either `tmux.conf` or with a `.tmux.conf` extension and executes using `tmux source-file`.

When no command is specified the `${cmd_run_long}` command is invoked.

The `--noop` option applies to all commands except `ls` and `help`, in the case of operations on aliases the rc file is not written.

If the `\$TMUX` variable is not set an attempt is made to spawn `tmux` to start an initial server, see _WORKFLOW_.

## Commands

* `attach: attach, att, a <name>`: Attach to a session.
* `exec: exec, ex <cmd>`: Execute a command in a pane.
* `list: list, ls`: List configuration files.
* `run: source, so`: Source tmux configuration files.
* `alias: alias, as <@alias=file>`: Manage file aliases.
* `remove: remove, rm <pattern...>`: Remove aliases by pattern match.
* `prune: prune, pr`: Remove stale aliases.
* `generate: index, idx <dir...>`: Generate alias index.
* `kill: kill, k <pattern...>`: Kill sessions, windows and panes.
* `install: install, i <@alias=filename>`: Install alias files.
* `view: view, vi`: View and edit configuration files.
* `quit: quit`: Kill the `tmux` server.

## Options

* `dir: -c, --directory [dir ...]`: Working directory contexts.
* `pattern: -p, --pattern [ptn ...]`: Filter files by regexp pattern(s).
* `all: -a, --all`: Match all configuration files.
* `noop: -n, --noop`: Print matched files, do not call `source-file`.
* `session: -s, --session [name]`: Create session before source file(s).
* `recursive: -r, --recursive`: Match files recursively.

### Exec

Execute a command in a new pane and kill the pane if the command succeeds, otherwise the pane remains open to inspect errors.

Focus is _not_ given to the new pane for the command unless the `${opt_fullscreen_long}` option is given.

#### Arguments

All unparsed arguments are treated as the command to execute, space characters are escaped with a backslash such that the command:

```
printf 'foo bar'
```

Will yield the command `printf foo\\ bar` and print the string `foo bar`, however the unquoted `printf foo bar` will print `foo` and exit without an error.

#### Options

* `fullscreen: -z, --fullscreen`: Display pane full screen.

#### Examples

Compare behaviour:

```
$0 ex true 
$0 ex false 
```

Run tests for a project and close pane on success:

```
$0 ex npm test
```

Show a man page fullscreen and exit on quit (`q`):

```
$0 ex -z man tmux
```

Test quote behaviour:

```
$0 ex printf 'foo bar' '&&' false
```

### Attach

Attach to the session specified by `<name>`, if name is not specified this command will attempt to attach to the scratch session.

If no matches are found and the _name_ compiles to a regular expression and the resulting pattern matches exactly one session it becomes the target session.

An error is reported if the _name_ matches the current attached session or if the target session does not exist.

#### Hints

In the case where it appears that the name would match multiple sessions, session hints are printed so that you can further refine the name, for example:

```
$0 att m
```

Could yield:

```
(2) + mail: 1 windows
(3) + music: 1 windows
```

Expand the command to choose a session:

```
$0 att mu
```

Would select the `music` session as `tmux` will match the session name with fnmatch(3).

### Quit

Alias for `:kill-server`.

### View

Open the configuration files referenced by `<args>` in _EDITOR_.

This allows quickly editing files via alias reference (`$0 vi @scratch @binding`) or using any configuration file list (`$0 vi -r`).

The _EDITOR_ is resolved by testing for `\$mxl_editor` and then `\$EDITOR` and finally using `vi` if neither are set.

### Kill

Destroy sessions, windows and panes using regular expression patterns.

A list is retrieved from `tmux` of whichever type is the target (session, window or pane) for each item in the list all patterns are matched against all fields, if any pattern matches any field the target is included, use the `${opt_noop_long}` option to see matches.

The `${cmd_kill_long}` command operates on windows by default.

When no patterns are passed the effect is to close the current session, window or pane. If patterns are specified and they match the current target, the current target is excluded and a warning is printed.

If an attempt is made to kill the current session (`$0 ${cmd_kill_long} -S`) and the current session is the scratch session or the session is the only session, the request is refused with an error.

To kill the last session use the `${cmd_quit_long}` command.

#### Options

* `kills: -S`: Kill sessions.
* `killw: -W`: Kill windows.
* `killp: -P`: Kill panes.

#### Formats

The field mappings for sessions are:

* `#{session_id}` => id
* `#{session_name}` => name

The field mappings for windows are:

* `#{window_id}` => id
* `#{window_name}` => name

The field mappings for panes are:

* `#{pane_id}` => id
* `#{pane_current_command}` => cmd
* `#{pane_current_path}` => path

See the _FORMATS_ section of tmux(1) for more information.

#### Examples

Kill all windows starting with the `vim` string at the beginning of the name:

```
$0 ${cmd_kill_long} '^vim'
```

Kill the sessions `cmus` and `mutt`:

```
$0 ${cmd_kill_long} -S cmus mutt
```

Kill all other windows:

```
$0 ${cmd_kill_long} @
```

Kill all other sessions:

```
$0 ${cmd_kill_long} -S '.*'
```

Kill all other panes:

```
$0 ${cmd_kill_long} -P %
```

### Remove

Removes user aliases by regular expression pattern match, global aliases may not be deleted.

All unparsed arguments and values given to `-p | --pattern` are compiled to regular expressions and matched against the keys for the user aliases.

Matched alias keys are deleted and the aliases are re-written unless `--noop` is specified.

### Install

Copy the files referenced by aliases into one or more target directories and optionally set the filename for each destination file.

If the `${opt_symlink_long}` option if given installation will create a soft symbolic link rather than copy the file, use this option when you are certain you do not need to make project specific changes.

#### Options

* `force: -f | --force`: Force overwrite existing files.
* `symlink: -l | --link`: Create soft symbolic link.

#### Files

To reference the alias file and use the basename of the alias file for the destination just specify the alias: `@project`.

To explicitly set the destination file name assign to the alias:

```
@project=profile
```

Uses the file name `profile.tmux.conf` - the extension is added automatically.

Files are copied to all of the directories referenced by the `-c` options or the current working directory if none are specified.

Destination files may overlap, for example, if both aliases share the same file name:

```
@scm @editor
```

Would result in an error as the destination file names conflict. To resolve this use explicit file names:

```
@scm=scm-profile @edit=edit-profile
```

If an alias reference is stale (the file has been moved or deleted) then an error is reported, you should invoke `prune` and try again checking against the alias list: `$0 alias`.

See `mxl-prune(1)` for more information.

If any of the destination files exist you must specify `--force` to overwrite.

#### Examples

Copy the file referenced by the alias `@scratch` to the current working directory as `tmux.conf`.

```
mxl i @scratch
```

Overwrite the previous file with a soft symbolic link:

```
mxl i @scratch -lf
```

Copy the `@editor` file as `edit.tmux.conf` to the current working directory:

```
mxl i @editor=edit
```

Copy into an alternative directory overwriting if the file exists:

```
mxl i @editor -c ~/project -f
```

Copy multiple aliases into multiple directories:

```
mxl i @editor=edit @scm=scm -c ~/dir1 -c ~/dir2
```

Will result in the files:

```
~/dir1/edit.tmux.conf
~/dir1/scm.tmux.conf
~/dir2/edit.tmux.conf
~/dir2/scm.tmux.conf
```

### List

List configuration files, preferring an index file `tmux.conf` by default. Use the `-a` option to list all configuration files in a given directory and `-r` to perform a recursive search.

When the `-a` and `-r` options are combined the search is recursive, `-r` takes precedence.

The list command is an alias for `${cmd_run_long} --noop`.

### Alias

Manage aliases using an @ notation.

Global aliases are created in the default rc file when $0(1) is installed, they are written to `.${0}rc.json` pointing to the files in `conf/tpl` and may not be deleted.

Aliases are automatically added if they do not already exist the first time a call to `source-file` succeeds and are re-written to `\$HOME/.mxlrc.json`.

The rc file (`\$HOME/.mxlrc.json`.) is created if it does not exist.

For more information see _AUTOMATIC_.

#### Options

* `global: -g, --global`: List global aliases.
* `all: -a, --all`: List user and global aliases.

#### Source

Pass an alias to the default command (`${cmd_run_long}`) to source the file referenced by the alias:

```
$0 @project
```

The alias must exist. You can run global aliases immediately:

```
$0 @editor -c ~/project
```

#### Automatic

Aliases are automatically created for the user provided:

* The rc field `autoalias` is enabled (default).
* The file is not a system file (`session.tmux.conf` etc).
* The file is not a global alias reference.
* An alias does not exist by the same id.

The rules for alias names created automatically are:

* When the file is `tmux.conf` use the name of the parent directory.
* When the file has a `.tmux.conf` extension concatenate the parent directory name with the name of the file after the extension has been removed. The delimiter for concatenation is `/`.

You may disable automatically adding aliases by modifying the `autoalias` rc option.

Note that if you run a file that kills the current window (`unlink-window` etc) aliases will not be added automatically as the process will have been killed before the success handler returns. To workaround this run from another window, eg: `mxl ~/project`.

#### List

List user aliases:

```
$0 alias
```

List user aliases and include global aliases:

```
$0 alias -a
```

List global aliases:

```
$0 alias -g
```

#### Edit

To add or update an alias manually assign to the alias:

```
$0 alias @project=/usr/local/project
```

It is possible to assign the file from an alias by referencing an existing alias in the assignment, for example:

```
$0 alias @project=@scm
```

When adding aliases you may pass the options:

* `${opt_recursive_name}`
* `${opt_all_name}`
* `${opt_each_name}`
* `${opt_pattern_name}`
* `${opt_session_name}`

And they will be saved along with the alias (as an `options` object) and used when the alias is executed. 

You may also specify the `${opt_dir_name}` and it is saved as an array of working directories for the alias as the `cwd` field.

When associating options and working directories with an alias like this you can ensure they are always used when executing the alias, they may not be overriden.

Consider the use case where you have an existing template that suffices and a complex project consisting of modules that you wish to run the file against using `${opt_each_long}`, you might do this:

```
mxl @scm -e -s project -c ~/project
```

To iterate over the child directories of `~/project` and source the `@scm` file for each directory after creating a session named `project`.

Save this configuration with:

```
mxl as @project=@scm -e -s project -c ~/project
```

Then run with the saved options and directory:

```
mxl @project
```

#### Delete

Assign the empty string to delete an alias.

```
$0 alias @project=
```

#### See

mxl-index(1), mxl-prune(1), mxl-rm(1)

### Prune

As files are moved or deleted aliases may get out of date, run the `prune` command to remove alias entries for files that no longer exist.

#### See

mxl-alias(1)

### Run

Invokes `tmux source-file` with the configuration files found by evaluating the arguments, use the `--noop` option to inspect what would be executed.

Arguments can be directories, files, and aliases which are resolved to configuration files. Every file found is executed against each working directory context, specified using the `${opt_dir_name}` option; when not specified the current working directory is used. 

See mxl-alias(1) for more information on aliases.

#### Options

* `each: -e, --each`: Iterate child directories and set `-c` for each directory.

#### Environment

Before calls to `source-file` the following environment variables are set using `set-environment -g`:

* `mxl_key`: An identifier for a session or window.
* `mxl_name`: The name for the window or session.
* `mxl_session`: The name of a session.
* `mxl_cwd`: The working directory for the `tmux` process.
* `mxl_cwdname`: The name of the working directory.

#### Each

The `--each` switch changes the behaviour of execution to take the value of `-c | --directory` (which will be the working directory if not specified) find all direct child directories and iterate the result executing all matched configuration files for each directory found.

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

Typically used to open a window and pane set for all modules of a project from a single configuration file.

When the `--each` flag is used the behaviour of `--pattern` changes to match the child working directory path rather than the configuration file path(s) so that it may be used as a filter.

#### Examples

Source `tmux.conf` in the current working directory:

```
$0
```

Source a file by directory:

```
$0 /usr/local/project
```

Source all `*.tmux.conf` files in the current working directory (and `tmux.conf` if present):

```
$0 -a
```

Use a pattern match on the file path to filter results returned with `-a` using the `-p` option:

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

Recursively searches the specified directories for configuration files and adds them as aliases unless the `--noop` option is specified.

#### See

mxl-alias(1)

## Patterns

When the `-p | --pattern` option is specified it is applied to the results of searching for configuration files except in the case of `-e | --each` when the behaviour changes to match on the current working directory context, see mxl-source(1) for more information on `--each`.

Patterns are compiled to regular expressions and are matched against the full file system path.

If any of the patterns match the file is included (logical OR).

## Workflow

Information on an efficient workflow, examples assume the `zsh` shell.

To remove the first few keystrokes for a session start `tmux` at login:

```
if [ -z $TMUX ]; then
  tmux
fi
```

Once `$0` is installed you have a lot of power to create many sessions and windows very quickly so it is useful to be able to also kill sessions, windows and panes when necessary. Save a few more keystrokes with the following aliases:

```
# kill self (session, window, pane)
alias ks="mxl kill -S"
alias kw="mxl kill -W"
alias kp="mxl kill -P"
# kill all others (session, window, pane)
alias kso="mxl kill -S '.*'"
alias kwo="mxl kill -W '@'"
alias kpo="mxl kill -P '%'"
# kill tmux server
alias tks="mxl quit"
# attach to scratch (zero args) or specific session
alias att="mxl attach"
# exec command in unfocused visible pane
alias mxe="mxl exec"
# exec command in fullscreen pane
alias mxf="mxl exec -z"
# exec man(1) in fullscreen pane
alias mxm="mxl exec -z man"
```

The concept of a `scratch` session exists as the default session and as the session to re-attach to when killing the current session. Typically you would define this in `\$HOME/tmux.conf` and configure the sessions, windows and panes you want for the `scratch` session.

The session name given to the scratch session is `/launch` by default but you may change this with the `\$mxl_scratch` environment variable, but _do not_ start the session name with `-`.

A global alias is available with my preference named `@scratch`, install it:

```
cd ~ && $0 i @scratch
```

And modify `tmux.conf` to suit your needs.

Once you have run the scratch session:

```
$0 .
```

You will have a user alias named `@<username>`, eg: `@muji`; you can list user aliases with `$0 as` to check.

Now you can update your shell rc file to run `$0` directly with the user profile:

```
if [ -z $TMUX ]; then
  mxl @muji
fi
```

When `\$TMUX` is not set `$0` will attempt to spawn it to start a server, so the above command will spawn `tmux`, wait a while for the server to start and then execute the arguments.

Specify more aliases to source other files at login:

```
if [ -z $TMUX ]; then
  mxl @binding @muji
fi
```

Note it is important to test that `\$TMUX` is _not_ set to prevent nested session attempts when splitting windows and panes.

When modifying the shell login rc file it is best to kill the server (`:kill-server`) and terminal emulator and start fresh.

## Preamble

Templates that operate on sessions or windows will include a preamble that tries to ensure the session or window starts with a clean execution. To do so it uses the `mxl_key` and `mxl_session` variables, you can hard code values here if you prefer but this helps to allow the file to be shared across projects easily.

Install the `@blank` template to create a file with just the preamble.

## Binding

The `@binding` template is designed to be available as a map of key bindings useful to the default scratch session; attach to scratch, check email, pause music etc. Install and modify to match your requirements.

## Completion

The zsh completion file `_$0.zsh` is available in `completion`, copy the file to a directory in `fpath` or modify `fpath`.

## Environment

The variables declared in the `env` section of rc file(s) are always exposed as global environment variables.

When a call to `:source-file` is made additional file context environment variables are set, these variables are unset after each call, see mxl-source(1) for information on context environment variables.

Exposed variables are always prefixed with `mxl_`, eg: `mxl_scratch` represents the name of the scratch session.

Global variables may be configured in the user rc file, for example:

```
{
  "env": {
    "scratch": "/launch",
    "mail": "mail",
    "music": "music",
    "irc": "irc"
  }
}
```

Modify the session names to suit your needs, or override them with environment variables:

```
export mxl_scratch=/scratch
```

The `mxl_editor` environment variable is used if already set otherwise `EDITOR`, if the `env` section contains an `editor` field it overrides the `mxl_editor` variable.

Use the `mxl_tpl` variable to set the base path that should be used for files that source other files, by default this is configured to be the installation template directory (`conf/tpl`) and is used to ensure that files may source other files correctly when templates are installed as a symbolic link.

## See

tmux(1), ${see_all}
