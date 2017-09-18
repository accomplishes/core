'use strict'

// Load module requirements
const i18n = require('../../locale')
const logger = require('../../log')

// Give the user a shiny new title
module.exports = function (user, reward) {
  // Variables
  let update = {}

  // Push new value
  update[reward.field] = i18n.t(reward.value, user.profile[reward.field].split(',')[0])

  // Run the update
  require('../methods/profile')(user, update).then((result) => {
    logger.info('{yellow:@%s} has been awarded the title of {green:%s}', user.name, update[reward.field])

    // DEBUG
    console.log(result)

    // Send confirmation
    // TODO

  // Something went wrong
  }).catch((err) => {
    return logger.error(err.message)
  })
}
