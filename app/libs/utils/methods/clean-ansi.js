'use strict'

module.exports = function (answers) {
  return answers.map((value) => {
    return value.replace(/^\u001b\[[0-9]+m(.+?)\u001b\[[0-9]+m.+$/ig, '$1')
  })
}
