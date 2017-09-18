'use strict'

// Load requirements
const slack = require('slack')

// Check for and validate a Slack token
module.exports = function (token, permissions) {
  return new Promise((resolve, reject) => {
    // Do we have a token at all
    if (!token) {
      return resolve('No token provided')
    }

    // Ensure the token we have is valid
    slack.auth.test({token}, (err, data) => {
      if (err !== null) { return resolve('Invalid token provided') }
      return resolve(true)
    })
  })
}
