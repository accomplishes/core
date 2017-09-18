'use strict'

// Load requirements
const slack = require('slack')

// Load module requirements
const utils = require('../../utils')
const i18n = require('../../locale')

// Get and validate a slack token
module.exports = {
  type: 'list',
  name: 'slack_channel',
  message: i18n.t('setup.questions.channel.message'),
  pageSize: (process.stdout.rows - 2),
  when: () => {
    // Only run when we don't have a channel
    return !process.env.SLACK_CHANNEL
  },
  choices: (answers) => {
    return new Promise((resolve, reject) => {
      // Get the channel list from Slack
      slack.groups.list({token: answers.slack_token || process.env.SLACK_TOKEN}, (err, data) => {
        // Check for errors
        if (err !== null) {
          console.log(err)
          return reject(new Error(i18n.t('setup.questions.channel.errors.slack', err.message)))
        }

        // Check for a response
        if (data.ok !== true) {
          return reject(new Error(i18n.t('setup.questions.channel.errors.invalid')))
        }

        // Loop channels and add them to the list
        return resolve(data.groups
                 .filter((channel) => !channel.is_archived)
                 .map((channel) => utils.formatString('{magenta:%s} {italic,gray:(%s)}', channel.id, channel.name)))
      })
    })
  },
  filter: (answer) => {
    return utils.cleanAnsi([answer])
  }
}
