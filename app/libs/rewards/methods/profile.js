'use strict'

// Load requirements
const slack = require('slack')

// Load module requirements
const users = require('../../users')

// Updates a users profile, and update users object
module.exports = function (user, values) {
  return new Promise((resolve, reject) => {
    slack.users.profile.set({
      token: process.env.SLACK_TOKEN,
      user: user.id,
      profile: values
    }, (err, data) => {
      // Handle any errors
      if (err !== null) { return reject(err) }

      // Update user tracking
      users.users[user.id].profile = data.profile

      // Seems okay, resolve it
      return resolve(users.users[user.id])
    })
  })
}
