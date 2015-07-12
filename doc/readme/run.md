Use the `ls` command to see matching configuration files:

```
mxl ls
mxl ls -a
```

Launch `tmux.conf` in the current working directory:

```
mxl
```

Launch all profiles (`tmux.conf` and `*.tmux.conf`) in the current working 
directory:

```
mxl -a
```

Launch `tmux.conf` in current working directory with another target directory:

```
mxl -c /usr/local/project
```

This is particularly useful when you have a common configuration file that you 
wish to share across multiple projects.
