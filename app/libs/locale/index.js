'use strict'

// Load our requirements
const i18n = require('i18n')
const path = require('path')
const fs = require('fs')

// Variables
const localesDir = path.join(__dirname, '../../../locales')
const customDir = path.join(localesDir, '../data/achievements/custom/locales')

// Configure the localization engine
i18n.configure({
  locales: require('./available-locales')(localesDir),
  defaultLocale: 'en',
  objectNotation: true,
  directory: localesDir,
  multiDirectories: true,
  autoReload: true,
  register: i18n,
  api: {
    '__': 't',
    '__n': 'tn'
  }
})

// Add alias register helper
i18n.register = function (dir) {
  // Ensure directory is absolute
  /* istanbul ignore next */
  if (!path.isAbsolute(dir)) {
    dir = path.resolve(dir)
  }

  // Ensure directory exists
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
    return
  }

  // Register and return
  return i18n.configure({directory: dir})
}

// Auto register custom achievement locles
i18n.register(customDir)

// Export for future use
module.exports = i18n
