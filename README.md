# Intervals

NodeJS wrapper of [Intervals](http://www.myintervals.com) [API](http://www.myintervals.com/api/).

*Work in progress.*

## Install

    npm install intervals

## Dependencies

* node-spore
* node-optimist
* yaml
* futures

## Command line usage

`intervals --date 2011-03-14 [--hours 4] [--billable]`

### Options

*  date: date in ISO 8601 format (YYYY-MM-DD)
*  hours
*  billable
*  description

## API

### Get Spore description

    var desc = require('invervals').description;

### Get client

    var client = require('intervals').createClient('secret token');

## Config

An API key is needed. Go to https://xx.timetask.com/account/api/ and generate one.
The config file is written in ~/.intervals in yaml format.

## Changelog

* **0.0.2**

  Add description param.

* **0.0.1**

  Initial release with basic intervals bin.

## License

AGPL v3.
