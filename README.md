# Intervals

NodeJS wrapper of [Intervals](http://www.myintervals.com) [API](http://www.myintervals.com/api/).

## Install

The best way is to use npm:

    npm install -g intervals

You can also clone the repository and install dependencies with npm:

    git clone https://github.com/francois2metz/node-intervals.git
    cd node-intervals
    npm install

## Dependencies

* node-spore
* node-optimist
* yaml
* futures
* cli-table

## Command line usage

See doc/intervals.ronn.

## API

### Get Spore description

    var desc = require('invervals').description;

### Get client

    var client = require('intervals').createClient('secret token');

## Config

An API key is needed. Go to https://xx.timetask.com/account/api/ and generate one.
The config file is written in ~/.config/intervals or in $XDG_CONFIG_HOME/intervals in yaml format.

## Roadmap

Please submit features request :).

## Changelog

* **0.1.2** (not yet released)

  Add start-timer, get-timer and delete-timer methods.

  Remove dependency to base64.

* **0.1.1**

  Remove dependency to dateformat.

* **0.1.0**

  Date with a range. Like 2011-06-17..2011-06-14.

  List only user times with intervals ls (thanks [nono](https://github.com/nono/)).

* **0.0.10**

  Fix pager issue.

  Fix doc.

* **0.0.9**

  Use a pager if the number of results exceed the number of row in the tty.

  Show complete list of results when adding time in a project. We have an
  hardcoded value '42' but if the result contains more result, we made a new
  request.

* **0.0.8**

  List only active modules and workype.

* **0.0.7**

  Add `intervals ls` command.

  QuickFix bug when result list is too short.

* **0.0.6**

  Save project in config file and reuse it after with `--project` option.

  Add `intervals -v` and `intervals help` as shortcut of `intervals --help`.

  intervals without argument is an alias of `intervals add-time`.

  Add `intervals list-projects` command.

* **0.0.5**

  Add --version option.

  Add --help option.

  Add man page. `man intervals`.

* **0.0.4**

  Add short option *-b* for billable hours.

  Use XDG_CONFIG_HOME environment variable for storing config file.

  You can now set multiple date at once with multiple *--date* (thanks [oz](https://github.com/oz/)).

* **0.0.3**

  Options date is now optional. Default is *today*.

  Add missing base64 dependency.

* **0.0.2**

  Add description param.

* **0.0.1**

  Initial release with basic intervals bin.

## Authors

* François de Metz
* Arnaud Berthomier

## License

AGPL v3.
