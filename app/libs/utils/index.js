'use strict'

module.exports = {

  // Format a string for terminal ouptut
  formatString: require('./methods/format-string'),

  // JSON pretty print
  json: require('./methods/json'),

  // Gets a random array item
  getRandom: require('./methods/get-random'),

  // List available class methods
  getMethods: require('./methods/get-methods'),

  // Check for and vaidate a Slack token
  validateToken: require('./methods/validate-token'),

  // Cleans the ANSI from styled inquirer options
  cleanAnsi: require('./methods/clean-ansi'),

  // Shortcut to perform create, update, and write of a users history
  writeHistory: require('./methods/write-history'),

  // Formats a criteria string into name and filters
  formatCriteria: require('./methods/format-criteria')
}
