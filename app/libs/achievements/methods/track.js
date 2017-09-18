'use strict'

// Load module requirements
const i18n = require('../../locale')
const logger = require('../../log')
const storage = require('../../storage')
const rewards = require('../../rewards')

// Track completion status for achievements
module.exports = function (client, achievement, topic, event) {
  // Variables
  const user = event.user
  const history = event.history

  // Check achievement hasn't already been completed
  if (history.achievements.completed.includes(achievement.id)) {
    return logger.verbose('Skipping {green:%s} for {yellow:@%s}, already completed', i18n.t(achievement.name), user.name)
  }

  // Track status of completion
  let complete = achievement.criteria.every((criteria) => {
    let index = history.achievements.criteria.indexOf(criteria.type)
    return history.achievements.criteriaQuantity[index] >= criteria.required
  })

  // Not complete, stop here
  if (!complete) { return }

  // Omg, grats!
  history.points += achievement.points
  history.achievements.completed.push(achievement.id)
  history.achievements.completedTimestamp.push(Math.floor(Date.now() / 1000))

  // Write the history file
  storage.write(user, history)

  // DEBUG
  logger.info('{yellow:@%s} has earned the achievement {green:%s %s}', user.name, ':' + achievement.icon + ':', i18n.t(achievement.name))

  // Give out any rewards
  if (achievement.reward !== false) {
    achievement.rewardItems.forEach((item) => {
      // Hand off to reward service
      return rewards[item.type](user, item)
    })
  }

  // Send message to them/slack channel
  return require('./notification')(achievement, user, history)
}
