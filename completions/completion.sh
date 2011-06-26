#!/usr/bin/env bash

# intervals(1) completion

__intervals_comp()
{
  local cur="${COMP_WORDS[COMP_CWORD]}"
  COMPREPLY=($(compgen -W "$1" -- "$cur"))
  return 0
}

_intervals_noop()
{
    return 0
}

__intervals_get_list_projects()
{
    local PROJECTS="$(cat ~/.config/intervals | grep name | sed "s/name: '\(.*\)'$/\1/")"
    __intervals_comp "$PROJECTS"
}

_intervals_add_time()
{
    INTERVALS_OPTS='\
    --date\
    --project\
    --hours\
    --description\
    --billable'

    local prev=${COMP_WORDS[COMP_CWORD-1]}
    case "${prev}" in
          --date*) _intervals_noop ;;
          --project*) __intervals_get_list_projects ;;
          --description*) _intervals_noop ;;
          *) __intervals_comp "$INTERVALS_OPTS"
    esac
}

_intervals_ls()
{
    local prev=${COMP_WORDS[COMP_CWORD-1]}
    case "${prev}" in
          --date*) _intervals_noop ;;
          *) __intervals_comp " --date "
    esac
}

_intervals_commands()
{
  local cur=${COMP_WORDS[COMP_CWORD]}
  COMMANDS='\
        version help list-projects ls add-time list-timers\
        start-timer get-timer delete-timer completion'
  case "${cur}" in
  *)  __intervals_comp "$COMMANDS" ;;
  esac
}

_intervals()
{
  local first=${COMP_WORDS[1]}

  case "${first}" in
  add-time)      _intervals_add_time ;;
  ls)            _intervals_ls ;;
  list-projects) _intervals_noop ;;
  help)          _intervals_noop ;;
  version)       _intervals_noop ;;
  start-timer)   _intervals_noop ;;
  completion)    _intervals_noop ;;
  *)             _intervals_commands ;;
  esac

  return 0
}

complete -F _intervals intervals

# Local variables:
# mode: shell-script
# sh-basic-offset: 4
# sh-indent-comment: t
# indent-tabs-mode: nil
# End:
# ex: ts=4 sw=4 et filetype=sh
