'use strict'

// Load requirements
const slack = require('slack')

// Load module requirements
const i18n = require('../../locale')
const logger = require('../../log')

// Send notification to specified channel
module.exports = function (achievement, user, history) {
  // Variables
  // let index = history.achievements.completed.indexOf(achievement.id)

  // Send notification
  slack.chat.postMessage({
    token: process.env.SLACK_TOKEN,
    channel: process.env.SLACK_CHANNEL,
    username: 'Accomplish',
    icon_emoji: ':' + achievement.icon + ':',
    text: 'Congratulations <@' + user.id + '>!',
    attachments: [{
      color: '#36a64f',
      title: achievement.name.includes(' ') ? achievement.name : i18n.t(achievement.name),
      title_link: 'https://accomplish.es/' + achievement.id,
      text: achievement.description.includes(' ') ? achievement.description : i18n.t(achievement.description)
    }]
  }, (err, data) => {
    if (err) { return logger.error(err.message) }
    logger.verbose('Sent congratulations to {yellow:@%s} for getting {green:%s}', user.name, i18n.t(achievement.name))
  })
}
