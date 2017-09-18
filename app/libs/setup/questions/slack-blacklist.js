'use strict'

// Load requirements
const slack = require('slack')
const path = require('path')
const fs = require('fs')

// Load module requirements
const utils = require('../../utils')
const i18n = require('../../locale')

// Define the data directory
const dataDir = path.join(__dirname, '../../../../data/')

// Get and validate a slack token
module.exports = {
  type: 'checkbox',
  name: 'slack_blacklist',
  message: i18n.t('setup.questions.blacklist.message'),
  pageSize: (process.stdout.rows - 2),
  when: () => {
    // Only run when blacklist doesn't exist
    return !fs.existsSync(path.join(dataDir, 'blacklist.json'))
  },
  choices: (answers) => {
    return new Promise((resolve, reject) => {
      // Get the user list from Slack
      slack.users.list({token: answers.slack_token || process.env.SLACK_TOKEN}, (err, data) => {
        // Check for errors
        if (err !== null) {
          return reject(new Error(i18n.t('setup.questions.blacklist.errors.slack', err.message)))
        }

        // Check for a response
        if (data.ok !== true) {
          return reject(new Error(i18n.t('setup.questions.blacklist.errors.invalid')))
        }

        // Loop members and add them to the list
        return resolve(data.members.filter((user) => user.real_name).map((user) => {
          return utils.formatString('{magenta:@%s} {italic,gray:(%s)}', user.name, user.real_name)
        }))
      })
    })
  },
  filter: (answer) => {
    // Clean formatting and @ from names
    return utils.cleanAnsi(answer).map((value) => { return value.replace('@', '') })
  }
}
