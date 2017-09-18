'use strict'

// Load module requirements
const utils = require('../../utils')
const i18n = require('../../locale')

// Get and validate a slack token
module.exports = {
  type: 'input',
  name: 'slack_token',
  message: i18n.t('setup.questions.token.message'),
  default: process.env.SLACK_TOKEN || false,
  validate: (val) => {
    return utils.validateToken(val, [])
  },
  when: (answers) => {
    return new Promise((resolve, reject) => {
      utils.validateToken(process.env.SLACK_TOKEN, []).then((result) => {
        return resolve(typeof result === 'string' ? result : !result)
      })
    })
  }
}
