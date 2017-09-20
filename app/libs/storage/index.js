'use strict'

// Load requirements
const path = require('path')
const fs = require('fs')

// Define storage directory
const storageDir = path.join(__dirname, '../../../data/storage')

// Ensure the directory exists
try { fs.mkdirSync(storageDir) } /* istanbul ignore next */ catch (e) { }

// Handle storage and addition of user progress
module.exports = {

  // Define the storage structure
  structure: {
    completed: [],
    completedTimestamp: [],
    criteria: [],
    criteriaCreated: [],
    criteriaQuantity: [],
    criteriaTimestamp: []
  },

  // Load a users file
  read: function (user) {
    // Variables
    let file = path.join(storageDir, user.id + '.json')

    // Create blank file if it doesn't exist
    if (!fs.existsSync(file)) {
      return this.create(user)
    }

    // Otherwise load and return it
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  },

  // Write a new or updated files
  write: function (user, data) {
    // Variables
    let file = path.join(storageDir, user.id + '.json')

    // Write the file
    fs.writeFileSync(file, require('../utils').json(data))

    // Send it back
    return data
  },

  // Creates a new blank user file
  create: function (user) {
    // Variables
    let data = {
      id: user.id,
      name: user.real_name,
      handle: user.name,
      team: user.team_id,
      points: 0,
      achievements: this.structure
    }

    // Write it
    return this.write(user, data)
  }

}
