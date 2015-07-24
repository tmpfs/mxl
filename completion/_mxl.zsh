#compdef mxl
# vim: ft=zsh sw=2 ts=2 et
# ------------------------------------------------------------------------------
# Description
# -----------
#
#  Completion script for mxl(1).
#
#  Source: https://github.com/freeformsystems/mxl
#
# ------------------------------------------------------------------------------
# Authors
# -------
#
#  * muji (https://github.com/freeformsystems)
#
# ------------------------------------------------------------------------------

local -a commands
commands=(
  'ls:List configuration files'
  'source:Source tmux configuration files'
  'alias:Manage file aliases'
  'remove:Remove aliases by pattern match'
  'prune:Remove stale aliases'
  'index:Generate alias index'
  'install:Install alias files'
  'kill:Kill sessions, windows and panes'
  'reshuffle:Reshuffle window indices to be sequential'
  'help:Show man pages'
)

_arguments -C -- \
	'*:: :->args' \
  && return 0;

_describe -t commands "mxl commands" commands && return 0;
_files && return 0;
