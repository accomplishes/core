'use strict'

// Load requirements
// const slack = require('slack')

// Load module requirements
// const utils = require('../utils')
// const users = require('../users')

// Handle commands and response to users
module.exports = {

  // Syntax of commands
  syntax: /^!accomplish /i,

  // The events to listen to
  events: [
    'message',
    'message.channels',
    'message.groups',
    'message.im',
    'message.mpim'
  ],

  // Attach the bindings
  load: function (client) {
    return new Promise((resolve, reject) => {
      // Bind each event to task runner
      this.events.forEach((event) => { client[event]((message) => { this.run(this, message) }) })

      // Resolve bound client
      return resolve(this.commands.length)
    })
  },

  // Run the commands
  run: function (self, message) {
    if (self.syntax.test(message.text)) {
      let command = message.text.replace(self.syntax, '')
      return self.commands[command](message)
    }
  },

  // List of the available commands
  commands: {
    points: require('./actions/points')
  }

}
