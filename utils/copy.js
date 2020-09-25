/**
 * 复制文本到剪贴板
 * @param {string} value 复制的文本
 * @param {function?} callback 复制回调
 * @returns {boolean} result 是否复制成功
 * @callback
 * @param {boolean} result
 * @param {string} value
 */
export function copy(value, callback = copy.callback) {
  var textarea = document.createElement('textarea')
  document.body.appendChild(textarea)
  textarea.value = value
  textarea.readOnly = true
  textarea.select()
  var result = false
  try {
    result = document.execCommand('copy')
  } catch (_) {}
  document.body.removeChild(textarea)

  callback(result, value)
  return result
}

copy.callback = function(result, value) {
  var msg = result ? '复制成功' : '复制失败'
  alert(msg)
}

export default copy
