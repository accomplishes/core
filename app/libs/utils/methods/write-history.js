'use strict'

// Load modules requirements
const storage = require('../../storage')

// Load, update, write and return a users history
module.exports = function (user, criteria, history) {
  // User what we're given or load it for them
  history = history || storage.read(user)

  // Ensure we got a criteria to update
  if (criteria !== undefined) {
    // Check user has this criteria already
    let index = history.achievements.criteria.indexOf(criteria)

    // Create new criteria reference
    if (index < 0) {
      history.achievements.criteria.push(criteria)
      history.achievements.criteriaQuantity.push(1)
      history.achievements.criteriaCreated.push(Math.floor(Date.now() / 1000))
      history.achievements.criteriaTimestamp.push(Math.floor(Date.now() / 1000))

    // Otherwise just update
    } else {
      history.achievements.criteriaQuantity[index] += 1
      history.achievements.criteriaTimestamp[index] = Math.floor(Date.now() / 1000)
    }
  }

  // Update the users record
  storage.write(user, history)

  // Return history
  return history
}
