var utils = {}
![
  'fix',
  'error',
  'Vue.mixin',
  'url',
  'ajax',
  'copy',
  'storage',
  'validate',
].forEach(item => {
  var m = require('./' + item)
  Object.assign(utils, m)
})

delete utils.default
module.exports = utils

// console
window.utils = utils
