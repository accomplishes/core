'use strict'

// Load requirements
const emoji = require('node-emoji')

module.exports = function (str) {
  // Variables
  let obj = { name: str, original: str, filters: [] }

  // Basic trigger, no processing needed
  if (!str.includes('|')) { return obj }

  // Parse the string
  let parts = str.split('|')
  obj.name = parts.shift().trim()

  // Run through the remaining parts and create filters
  parts.forEach((filter) => {
    let args = filter.match(/(\\.|[^:])+/g)
    obj.filters.push({
      method: args.shift().trim(),
      args: args.map((val) => { return emoji.unemojify(val).replace(/\\:/g, ':').trim() })
    })
  })

  // Return for handling
  return obj
}
