Table of Contents
=================

* [Tmux Launcher](#tmux-launcher)
  * [Install](#install)
  * [Usage](#usage)
  * [Configuration](#configuration)
  * [Examples](#examples)
    * [List files](#list-files)
    * [Launch](#launch)
    * [Launch All](#launch-all)
    * [Launch Profile](#launch-profile)
    * [Launch Project](#launch-project)
    * [Launch All Project](#launch-all-project)
    * [Launch Target](#launch-target)
  * [Alias](#alias)
    * [Launch Alias](#launch-alias)
    * [List Aliases](#list-aliases)
    * [Set Alias](#set-alias)
    * [Get Alias](#get-alias)
    * [Delete Alias](#delete-alias)
    * [Batch Alias](#batch-alias)
  * [Configuration Examples](#configuration-examples)
    * [git-status-npm-test.tmux.conf](#git-status-npm-testtmuxconf)
    * [git-status.tmux.conf](#git-statustmuxconf)
    * [home.tmux.conf](#hometmuxconf)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Docs](#docs)
    * [Manual](#manual)
    * [Readme](#readme)
  * [License](#license)

Tmux Launcher
=============

Tmux launcher.

Launches tmux profiles by invoking `source-file` ensuring your tmux 
configurations are completely portable, see [tmux.conf](https://github.com/freeformsystems/mxl/blob/master/tmux.conf).

Requires [node](http://nodejs.org) and [npm](http://www.npmjs.org).

## Install

```
npm i -g mxl
```

## Usage

```
Usage: mxl <command> [-arnvh] [--color|--no-color] [-a] [-r]
           [-n|--noop] [-v] [-h|--help] [--version]
           [-c|--directory=<dir>] <args>

Tmux launcher.

Commands:
 run, r                   Run tmux commands (source-file).
 alias, as                Manage file aliases.
 ls                       List command files.
 help                     Show help for commands.

Options:
 -c, --directory=[dir]    Working directory used for source-file.
 -n, --noop               Print matched files, do not call source-file.
 -h, --help               Display this help and exit.
     --[no]-color         Enable or disable terminal colors.
     -a                   Launch all matched files.
     -r                   Recursive file search.
     -v                   Print more information.
     --version            Print version and exit.

Report bugs to https://github.com/freeformsystems/mxl/issues.
```

## Configuration

Start `tmux` and define commands in a `tmux.conf` file within a project,  add 
additional profiles by using the `.tmux.conf` suffix.

```conf
# vim: set ft=conf:
new-window -n mxl
send-keys -t: 'vim .' C-m
split-window -h -t:
send-keys -t: 'git status' C-m
split-window -v -t:
send-keys -t: 'npm test' C-m
select-pane -L
```

## Examples

### List files

Use the `ls` command to see matching configuration files:

```
mxl ls
mxl ls -a
mxl ls :test
```

### Launch

Launch `tmux.conf` in the current working directory:

```
mxl
```

### Launch All

Launch all profiles (`tmux.conf` and `*.tmux.conf`) in the current working 
directory:

```
mxl -a
```

### Launch Profile

Prefix an argument with `:` to treat the argument as a profile pattern matching 
regular expression, matches are performed on the file name.

```
mxl :test
```

### Launch Project

Launch `tmux.conf` in a target project directory:

```
mxl /usr/local/project
```

### Launch All Project

Launch all files in a target project directory:

```
mxl /usr/local/project -a
```

### Launch Target

Launch `tmux.conf` in current working directory with another target directory:

```
mxl -c /usr/local/project
```

This is particularly useful when you have a common configuration file that you 
wish to share across multiple projects.

## Alias

When a configuration file is launched an alias is created if it does not exist 
and added to the `~/.mxlrc.json` file.

The rules for alias names created automatically are:

1. When the file is `tmux.conf` use the name of the parent directory.
2. When the file has a `.tmux.conf` extension concatenate the parent directory 
name with the name of the file after the extension has been removed.

You may disable automatically adding aliases by modifying the `autoalias` 
rc option.

### Launch Alias

To reference an alias when launching use an `@` prefix, for example:

```
mxl @alias-name
```

Will launch the configuration file referenced by the alias `alias-name`.

### List Aliases

```
mxl as
```

### Set Alias

```
mxl as @project=/usr/local/project/tmux.conf
```

### Get Alias

```
mxl as @project
```

### Delete Alias

To delete an alias set it to the empty string:

```
mxl as @project=
```

### Batch Alias

The set, get and delete operations can be combined in a single statement, use 
the `--noop` option to see what would be done without re-writing the rc file:

```
mxl as @foo @bar=baz @baz= --noop
```

## Configuration Examples

### git-status-npm-test.tmux.conf

```
# vim: set ft=conf:
new-window -n project-test
send-keys -t: 'vim .' C-m
split-window -h -t:
send-keys -t: 'git status' C-m
split-window -v -t:
send-keys -t: 'npm test' C-m
select-pane -L
```

### git-status.tmux.conf

```
# vim: set ft=conf:
new-window -n project
send-keys -t: 'vim .' C-m
split-window -h -t:
send-keys -t: 'git status' C-m
select-pane -L
```

### home.tmux.conf

```
# vim: set ft=conf:
rename-session launch
rename-window '~'
kill-session -t cmus
new-session -d -s cmus -n cmus 'cmus'
attach -t cmus
send-keys -t: ':tqueue 10' C-m
send-keys -t: ':player-play' C-m
```

## Developer

### Test

To run the test suite:

```
npm test
```

Note that the working directory for test execution is set to 
[fixtures/conf](https://github.com/freeformsystems/mxl/blob/master/test/fixtures/conf).

### Cover

To generate code coverage:

```
npm run cover
```

### Docs

To build all documentation:

```
npm run docs
```

### Manual

To build all man pages (requires [manpage](https://github.com/freeformsystems/cli-manpage)):

```
npm run manual
```

### Readme

To build the readme file from the partial definitions (requires [mdp](https://github.com/freeformsystems/mdp)):

```
npm run readme
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/mxl/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[mdp]: https://github.com/freeformsystems/mdp
[manpage]: https://github.com/freeformsystems/cli-manpage
[nvm]: https://github.com/creationix/nvm
