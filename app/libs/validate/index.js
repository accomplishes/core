'use strict'

// Load requirements
const ajv = require('ajv')({allErrors: true})

// Load our schemas
ajv.addSchema(require('./schema/achievements.json'), 'achievements')

// Build the module structure
module.exports = {

  // Handle error formatting
  error: function (errors) {
    return {
      status: false,
      errors: (Array.isArray(errors) ? errors : []).map((err) => {
        return {path: err.dataPath || '', message: err.message || ''}
      })
    }
  },

  // Validate an achievement config file
  achievements: function (obj) {
    if (!ajv.validate('achievements', obj)) {
      return this.error(ajv.errors)
    }

    return {status: true, errors: []}
  }

}
