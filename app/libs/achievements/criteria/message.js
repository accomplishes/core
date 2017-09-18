'use strict'

// Load requirements
const queue = require('pubsub-js')

// Load module requirements
const i18n = require('../../locale')
const logger = require('../../log')
const utils = require('../../utils')

// Handle sent messages
module.exports = {

  // Criteria details
  slug: 'message',
  name: i18n.t('criteria.general.message.name'),
  description: i18n.t('criteria.general.message.description'),

  // The events to listen to
  events: [
    'message',
    'message.channels',
    'message.groups',
    'message.im',
    'message.mpim'
  ],

  // Run when message is recieved
  process: function (self, options, topic, event) {
    // Variables
    const message = event.message
    const user = event.user

    // Run any filters to perform checks
    if (options.filters.length > 0) {
      let valid = options.filters.every((filter) => {
        // Ensure this filter exists
        if (!self.filters[filter.method]) {
          return logger.error('Filter method {red:%s} does not exist in {magenta:%s}', filter.method, self.slug)
        }

        // Run the filter
        return self.filters[filter.method](message, filter.args)
      })

      // Not a valid command, stop here
      if (!valid) {
        return logger.verbose('Skipping {cyan:%s}, filter conditions not matched', options.original)
      }
    }

    // Update the criteria for this user and get their history
    const history = utils.writeHistory(user, options.original)

    // Let the achievement tracker know
    queue.publish('criteria ' + options.original, {
      type: self.slug,
      message: message,
      user: user,
      history: history
    })

    // DEBUG
    return logger.verbose('Handed {cyan:%s} to achievement tracker', options.original)
  },

  // Conditional assignments
  filters: {

    // Check a message includes the required value
    includes: function (message, args) {
      return args.some((match) => { return message.text.includes(match) })
    }
  }
}
