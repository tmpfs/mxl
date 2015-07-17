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
    * [Launch Filter](#launch-filter)
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
    * [Prune Aliases](#prune-aliases)
    * [Index Aliases](#index-aliases)
  * [Configuration Examples](#configuration-examples)
    * [git-status-npm-test.tmux.conf](#git-status-npm-testtmuxconf)
    * [git-status.tmux.conf](#git-statustmuxconf)
    * [home.tmux.conf](#hometmuxconf)
    * [npm-debug.log](#npm-debuglog)
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

This document is a brief introduction and guide, see `mxl help` 
and `mxl help <cmd>` for the man pages.

Requires [node](http://nodejs.org) and [npm](http://www.npmjs.org).

## Install

```
npm i -g mxl
```

## Usage

```
Usage: mxl <command> [-anrh] [--color|--no-color] [-a|--all]
           [-n|--noop] [-r|--recursive] [-h|--help] [--version]
           [-c|--directory=<dir>] [-p|--pattern=<ptn...>] <args>

Tmux launcher.

Commands:
 list, ls                   List configuration files.
 run                        Run tmux commands (source-file).
 alias, as                  Manage file aliases.
 prune, pr                  Remove stale aliases.
 index, in                  Generate alias index.
 help                       Show help for commands.

Options:
 -c, --directory=[dir]      Working directory used for tmux process.
 -p, --pattern=[ptn ...]    Filter files by regexp pattern(s).
 -a, --all                  Match all configuration files.
 -n, --noop                 Print matched files, do not call source-file.
 -r, --recursive            Match files recursively.
 -h, --help                 Print help and exit.
     --[no]-color           Enable or disable terminal colors.
     --version              Print version and exit.

Report bugs to https://github.com/freeformsystems/mxl/issues.
```

## Configuration

Start `tmux` and define commands in a `tmux.conf` file within a project,  add 
additional profiles by using the `.tmux.conf` suffix.

```conf
# vim: set ft=conf:
if-shell 'tmux find-window -N ${mxl_cwdname}' 'unlink-window -k -t ${mxl_cwdname}' 'select-pane'
new-window -k -n ${mxl_cwdname}
send-keys -t: 'vim .' C-m
split-window -h -t:
send-keys -t: 'git status' C-m
split-window -v -t:
send-keys -t: 'npm run cover' C-m
select-pane -L
```

## Examples

### List files

Use the `ls` command to see matching configuration files:

```
mxl ls
mxl ls -a
mxl ls -a -p '^test'
```

### Launch

Launch `tmux.conf` in the current working directory:

```
mxl
```

### Launch All

Launch all files (`tmux.conf` and `*.tmux.conf`) in the current working 
directory:

```
mxl -a
```

### Launch Filter

Use the `-p | --pattern` option to filter by regular expression pattern, 
matches are performed on the full file path.

```
mxl -a -p test
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

### Prune Aliases

To remove aliases for files that no longer exist run:

```
mxl prune
```

### Index Aliases

Run the `index` command to generate and save aliases recursively in 
target directories:

```
mxl index /usr/local/project
```

## Configuration Examples

### git-status-npm-test.tmux.conf

```
# vim: set ft=conf:
if-shell 'tmux find-window -N ${mxl_key}' 'unlink-window -k -t ${mxl_key}' 'select-pane'
new-window -n ${mxl_key}
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
if-shell 'tmux find-window -N ${mxl_key}' 'unlink-window -k -t ${mxl_key}' 'select-pane'
new-window -n ${mxl_key}
send-keys -t: 'vim .' C-m
split-window -h -t:
send-keys -t: 'git status' C-m
select-pane -L
```

### home.tmux.conf

```
# vim: set ft=conf:
if-shell 'tmux has-session -t launch' 'select-pane' 'rename-session launch'
rename-window -t:1 '~'
if-shell 'tmux has-session -t cmus' 'kill-session -t cmus' 'select-pane'
new-session -A -d -s cmus -n cmus 'cmus'
send-keys -t: '4' C-m
send-keys -t: ':tqueue 64' C-m
send-keys -t: ':player-play' C-m
# required so that subsequent calls to source-file
# that do not create sessions are invoked in the context 
# of the launch session
switch-client -t launch
```

### npm-debug.log

```
0 info it worked if it ends with ok
1 verbose cli [ '/home/muji/.nvm/v0.10.29/bin/node',
1 verbose cli   '/home/muji/.nvm/v0.10.29/bin/npm',
1 verbose cli   'run',
1 verbose cli   'cover' ]
2 info using npm@1.4.14
3 info using node@v0.10.29
4 verbose node symlink /home/muji/.nvm/v0.10.29/bin/node
5 error Error: ENOENT, open '/home/muji/git/mxl/conf/package.json'
6 error If you need help, you may report this *entire* log,
6 error including the npm and node versions, at:
6 error     <http://github.com/npm/npm/issues>
7 error System Linux 3.16.0-30-generic
8 error command "/home/muji/.nvm/v0.10.29/bin/node" "/home/muji/.nvm/v0.10.29/bin/npm" "run" "cover"
9 error cwd /home/muji/git/mxl/conf
10 error node -v v0.10.29
11 error npm -v 1.4.14
12 error path /home/muji/git/mxl/conf/package.json
13 error code ENOENT
14 error errno 34
15 verbose exit [ 34, true ]
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
