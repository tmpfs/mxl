Use the `ls` command to see matching configuration files:

```
mxl ls
mxl ls -a
mxl ls :test
```

Prefix an argument with `:` to treat the argument as a profile pattern matching 
regular expression, matches are performed on the file name.

Launch `tmux.conf` in the current working directory:

```
mxl
```

Launch all profiles (`tmux.conf` and `*.tmux.conf`) in the current working 
directory:

```
mxl -a
```

Perform file name regular expression matching using a `:profile` reference:

```
mxl :test
```

Launch `tmux.conf` in current working directory with another target directory:

```
mxl -c /usr/local/project
```

This is particularly useful when you have a common configuration file that you 
wish to share across multiple projects.

Launch `tmux.conf` in a target directory:

```
mxl /usr/local/project
```
