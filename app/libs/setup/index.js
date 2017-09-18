'use strict'

// Load requirements
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')

// Load utilities
const utils = require('../utils')

// Variables
const rootDir = path.join(__dirname, '../../../')
const dataDir = path.join(rootDir, 'data/')

// Get required data from users
module.exports = new Promise((resolve, reject) => {
  // Load the available questions
  const questions = [
    require('./questions/slack-key'),
    require('./questions/slack-channel'),
    require('./questions/slack-blacklist')
  ]

  // Start asking the user questions if required
  inquirer.prompt(questions).then((answers) => {
    // Create env file if new slack token was provided
    if (answers.slack_token || answers.slack_channel) {
      // Add to env for use this run
      process.env.SLACK_TOKEN = answers.slack_token || process.env.SLACK_TOKEN
      process.env.SLACK_CHANNEL = answers.slack_channel || process.env.SLACK_CHANNEL

      // Write out for future use
      fs.writeFileSync(path.join(rootDir, '.env'), 'SLACK_TOKEN=' + process.env.SLACK_TOKEN + '\n' +
                                                   'SLACK_CHANNEL=' + process.env.SLACK_CHANNEL + '\n')
    }

    // Save the blacklist file
    if (answers.slack_blacklist) {
      fs.writeFileSync(path.join(dataDir, 'blacklist.json'), utils.json(answers.slack_blacklist))
    }

    // Ready to start up
    return resolve()

  // Something went wrong
  }).catch((err) => {
    return reject(err)
  })
})
