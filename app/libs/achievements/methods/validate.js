'use strict'

// Load module requirements
const users = require('../../users')
const i18n = require('../../locale')
const logger = require('../../log')

// Validation of incoming events
module.exports = function (user, event) {
  // Variables
  const name = user.real_name.split(' ')[0]

  // Check for blacklisted user
  if (users.blacklisted(user)) {
    logger.warn(i18n.t('bot.triggers.' + event + '.blacklisted', name))
    return false
  }

  // Check for restricted user
  if (users.restricted(user)) {
    logger.warn(i18n.t('bot.triggers.' + event + '.restricted', name))
    return false
  }

  // Not in the system, add them now
  if (!users.users[user.id]) {
    users.add(user)
  }

  // Proceed
  return true
}
