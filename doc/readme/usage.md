## Usage

Start `tmux` and define commands in a `tmux` section of the package descriptor 
(`package.json`):

```json
"tmux": [
  "new-window -n mxl -c #{pane_current_path}",
  [
    "send-keys",
    "-t:",
    "vim .",
    "C-m"
  ],
  "split-window -h -t:",
  [
    "send-keys",
    "-t:",
    "git status",
    "C-m"
  ],
  "split-window -v -t:",
  [
    "send-keys",
    "-t:",
    "npm test",
    "C-m"
  ]
]
```

Run `mxl` in the directory containing the package descriptor.
