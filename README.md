Table of Contents
=================

* [Tmux Launcher](#tmux-launcher)
  * [Install](#install)
  * [Usage](#usage)
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
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Alias](#alias-1)
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
Usage: mxl <command> [-anrh] [-a|--all] [-n|--noop]
           [-r|--recursive] [--color|--no-color] [-h|--help]
           [--version] [-c|--directory=<dir...>]
           [-p|--pattern=<ptn...>] <args>

Tmux launcher.

Commands:
 list, ls                   List configuration files.
 source, so                 Source tmux configuration files.
 alias, as                  Manage file aliases.
 remove, rm                 Remove aliases by pattern match.
 prune, pr                  Remove stale aliases.
 index, idx                 Generate alias index.
 kill, k                    Kill sessions, windows and panes.
 install, i                 Install alias files.
 help                       Show help for commands.

Options:
 -c, --directory=[dir ...]  Working directory used for tmux process.
 -p, --pattern=[ptn ...]    Filter files by regexp pattern(s).
 -a, --all                  Match all configuration files.
 -n, --noop                 Print matched files, do not call source-file.
 -r, --recursive            Match files recursively.
 -h, --help                 Print help and exit.
     --[no]-color           Enable or disable terminal colors.
     --version              Print version and exit.

Report bugs to https://github.com/freeformsystems/mxl/issues.
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
mxl @project
```

Will launch the configuration file referenced by the alias `project`.

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

See the [templates](https://github.com/freeformsystems/mxl/blob/master/conf/tpl) for example `tmux` configuration files.

## Developer

Clone the repository, install deps (`npm i`) and symlink the executable in 
`$PATH`.

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

### Alias

To rebuild the default rc file aliases from the files in [tpl](https://github.com/freeformsystems/mxl/blob/master/conf/tpl) run:

```
npm run alias
```

This is automatically called on `postinstall` to ensure shipped aliases are 
correct.

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
