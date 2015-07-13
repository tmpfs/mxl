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
