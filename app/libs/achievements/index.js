'use strict'

// Load requirements
const slack = require('slack')
const queue = require('pubsub-js')
const path = require('path')
const glob = require('glob')

// Load module requirements
const utils = require('../utils')
const users = require('../users')
const i18n = require('../locale')
const logger = require('../log')

// Configure achievements path
const achieveDir = path.join(__dirname, '../../../data/achievements/')

// Handle tracking and creation of achievement progress
module.exports = {

  // Create a slack client
  client: slack.rtm.client(),

  // Achievements to be tracked
  achievementList: [],

  // Criteria to be matched
  criteriaList: [],

  // Events from Slack to be watched
  eventList: [],

  // Bind criteria to Slack events
  load: function () {
    return new Promise((resolve, reject) => {
      // Setup events and binds
      this.achievements()
          .criteria()
          .events()

      // Resolve back to main thread with Slack client
      return resolve([this.achievementList, this.client])
    })
  },

  // Bind achievements to criteria events
  achievements: function () {
    // Load all achievement config files
    let items = glob.sync(achieveDir + '**/*.json').reduce((i, file) => i.concat(require(file)), [])

    // Load the achievements file and run through them
    items.forEach((achievement) => {
      this.achievementList.push(achievement.id)
      logger.verbose('Loaded {green:%s}', i18n.t(achievement.name))

      // Run through the criteria requirements
      achievement.criteria.forEach((criteria) => {
        // Add criteria to those being loaded
        if (!this.criteriaList.includes(criteria.type)) { this.criteriaList.push(criteria.type) }

        // Bind the criteria listener
        queue.subscribe('criteria ' + criteria.type, require('./methods/track').bind(null, this.client, achievement))
        logger.verbose('Subscribed to {cyan:%s} for {green:%s}', criteria.type, i18n.t(achievement.name))
      })
    })

    return this
  },

  // Bind criteria to listen for Slack events
  criteria: function () {
    // Load and run through the listeners for criteria tracking
    this.criteriaList.forEach((item) => {
      // Format the criteria string
      item = utils.formatCriteria(item)

      // Load the handler
      let criteria = require('./criteria/' + item.name)
      logger.verbose('Loaded {magenta:%s}', criteria.name)

      // Bind events
      criteria.events.forEach((event) => {
        // Add event to those being triggered
        if (!this.eventList.includes(event)) { this.eventList.push(event) }

        // Add listener to queue
        queue.subscribe('slack ' + event, criteria.process.bind(null, criteria, item))
        logger.verbose('Subscribed to {cyan:%s} for {magenta:%s}', event, criteria.name)
      })
    })

    return this
  },

  // Bind the Slack events required by criteria
  events: function () {
    this.eventList.forEach((event) => {
      logger.verbose('Bound {cyan:%s} to Slack client', event)

      // Add the callback and emiiter to Slack
      this.client[event]((message) => {
        logger.verbose('{cyan:%s} event recieved from Slack', event)

        // Get the user that triggered the event
        let user = typeof message.user === 'object' ? message.user : (users.users[message.user] || undefined)

        // Skip without a user to attribute the event to
        if (!user) { return }

        // Run validation on this event
        if (!require('./methods/validate')(user, event)) {
          return logger.verbose('Ignored {cyan:' + event + '} for {yellow:@' + user.name || 'unknown' + '}')
        }

        // Send to everyone that wants it
        return queue.publish('slack ' + event, {message: message, user: user})
      })
    })

    return this
  }
}
