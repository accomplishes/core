'use strict'

// Load requirements
const path = require('path')
const rimraf = require('rimraf')

// Define the created files and directories
let created = [
  './coverage',
  './logs'
]

module.exports = function () {
  // Start with a clean slate
  created.forEach((dir) => {
    rimraf.sync(path.resolve(dir))
  })
}
