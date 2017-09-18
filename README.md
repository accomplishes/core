# accomplish [![NPM version](https://badge.fury.io/js/accomplish.svg)](https://npmjs.org/package/accomplish)

🌟 Slack achievement and reward tracking for your team and its members

## Prerequisites
Before getting started you will need to have [nodejs](https://nodejs.org/en/) *(>=6)* & [npm](https://github.com/npm/npm). You will also need to get a [Slack API](https://api.slack.com/custom-integrations/legacy-tokens) key for your team.

> **Why a legacy token?** These allow you to interact with the Slack Realtime API with the required permissions to correctly track events.

## Installation

```sh
$ npm i -g accomplish
```

> **Note:** On first run a .env file, data directory and config files will be created, as well as downloading the required emoji data and then closing. Please add your Slack/Pushover keys to the .env file before running again.

## Usage
**accomplish** is fire-and-forget - designed to sit and quietly do its thing, and as such once configured and run there isn't any further input from the user.

```sh
$ accomplish
```

Once run, the tool will run *setup*, *get team users* before moving on to waiting for incoming events from Slack.

> **Note:** You can add either a `-v` or `--verbose` flag to the command to get more detailed information.

## Configuration
There are two types of configuration files located in the `data` directory in the root of this project - `achievements/*.json` and `blacklist.json`. Additionally another directory, `storage` will be created called which contains the achievement progress of team members.

### achievements/*.json
> Documentation coming soon

### blacklist.json
Blacklist contains a list of `ids` or `usernames` you would like to be immune  run this list against; some poeple may not want to be included. Any time a trigger is about to be run the incoming data is validated and one of the checks will be to ensure the user is not `restricted` or on the `blacklist`.

``` json
[
  "jholdroyd",
  "U32N242K3"
]
```

## Built With

* [Grunt](https://github.com/gruntjs/grunt) - Task runner
* [Slack](https://github.com/smallwins/slack) - Third-party Slack client
* [Chalk](https://github.com/chalk/chalk) - Terminal output formatting
* [Winston](https://github.com/winstonjs/winston) - Logging

## Contributing

Please read [CONTRIBUTING.md](https://github.com/accomplishes/core/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [semver](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/accomplishes/core/tags).

## Authors

* **Jamie Holdroyd** - [Moltin](https://moltin.com)

See also the list of [contributors](https://github.com/accomplishes/core/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/accomplishes/core/blob/master/LICENSE.md) file for details
