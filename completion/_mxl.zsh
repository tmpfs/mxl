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
  'run:Launch configuration files (source-file)'
  'alias:Manage aliases'
  'ls:List configuration files'
  'help:Show man pages'
)

_arguments -C -- \
	'*:: :->args' \
  && return 0;

_describe -t commands "mxl subcommand" commands && return 0;
_files && return 0;

