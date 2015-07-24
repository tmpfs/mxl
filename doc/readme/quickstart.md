## Quick Start

First install a scratch template into `$HOME`.

```
cd ~
mxl i @scratch
```

Modify `~/tmux.conf` to suit your needs then source it to create a scratch alias by username:

```
mxl .
```

Check the new alias exists:

```
mxl as
```

Then once you are in `tmux` you can launch the scratch template in your home directory:

```
mxl
```

Or from any directory with:

```
mxl @<username>
```

Now go read the man pages!
