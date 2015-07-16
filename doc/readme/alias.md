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
