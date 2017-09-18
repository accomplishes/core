'use strict'

// Load config
require('dotenv').config()

// Load requirements
const logger = require('./libs/log')
const i18n = require('./libs/locale')

// Create directories and ensure we have required data
require('./libs/setup').then(() => {
  logger.info(i18n.t('general.status.setup'))

  // Load the teams users
  return require('./libs/users').load()
}).then((users) => {
  logger.info(i18n.t('general.status.users', Object.keys(users).length))

  // Start loading achievements
  return require('./libs/achievements').load()
}).then((result) => {
  logger.info(i18n.t('general.status.achievements'), result[0].length)

  // Have Slack start listening for events
  result[1].listen({token: process.env.SLACK_TOKEN})

  // Ready and waiting
  logger.info(i18n.t('general.status.ready'))
}).catch((err) => {
  logger.error(err)
  return process.exit(1)
})
