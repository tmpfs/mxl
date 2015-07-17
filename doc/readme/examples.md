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
matches are performed on the file name.

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
