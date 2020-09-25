/**
 * form validate
 *
 * @example
 * await validate(value, rule)
 * await validate({}, {key: rule})
 *
 * @example
 * var validated = validate(value, rule)
 * var validated = validate({}, {key: rule})
 * if (validated.pass) {
 *    console.log(validated.result)
 * }
 *
 * @example
 * rule: '*type.min-max/reg/:名称#提示'
 *   *:       required
 *   type:    string number boolean array object date regexp
 *            url email phone idcard
 *   min-max: number-number
 *   /reg/:   regexp
 *   :名称:    默认提示使用的名称
 *   #提示:    自定义提示
 * @example
 * validate('http://domain.com', '*url')
 * @example
 * validate({username:''}, {username:'*3-20'})
 * @example
 * validate(form, {
 *   key: '*',
 *   key: 'url',
 *   key: '*url:名称',
 *   key: '*string.10-20',
 *   key: '*10-20',
 *   key: '*11',
 *   key: '*number.100-200',
 *   key: /reg/,
 *   key: '/reg/#请输入正确的信息',
 * })
 * @example
 * // 覆盖默认提示方式
 * validate.tip = function(msg){ alert(msg) }
 * @example
 * // 覆盖默认提示消息
 * validate.tips = {
 *   required: '${name}需要填写',
 *   type: '${name}填写错误',
 *   min: '${name}长度不足',
 *   max: '${name}长度太长',
 *   reg: '${name}填写错误',
 * }
 * @param {object|string} form form|key
 * @param {object|string} rules rules|rule
 * @param {function?} callback
 * @returns {promise} validated.pass
 */
export function validate(form, rules, callback = validate.callback) {
  if (typeof form === 'string') form = { '': form }
  if (typeof rules === 'string') rules = { '': rules }
  var result = {}

  for (var key in form) {
    var value = form[key]
    var rule = String(rules[key])

    if (rule) {
      var required = !!rule.match(/^[*]/)
      var type = rule.match(/([a-z]+)|$/i)[1]
      var min = rule.match(/([0-9]+)|$/i)[1]
      var max = rule.match(/-([0-9]+)|$/i)[1]
      var reg = rule.match(/\/(.+?)\/|$/)[1]
      var name = rule.match(/[:：] *(.*?)(?=#|$)|$/)[1] || key || type
      var tips = rule.match(/# *(.*)|$/)[1]
      // console.log(required, type, min, max, reg, name)
      result[key] = {
        required: true,
        type: true,
        min: true,
        max: true,
        reg: true,
        name,
        tips,
      }

      // *
      if (required) {
        if (
          value === undefined ||
          value === null ||
          value === false ||
          value === ''
        ) {
          result[key].required = false
        }
      }
      // type
      if (type && (value || value === 0)) {
        if (
          type.match(/string|number|boolean|array|object|date|regexp/) &&
          !value.constructor.name.match(RegExp(type, 'i'))
        ) {
          result[key].type = false
        }
        if (type === 'url' && !value.match(/^\w+:\/\/.+$/)) {
          result[key].type = false
        }
        if (type === 'email' && !value.match(/^.+@.+$/)) {
          result[key].type = false
        }
        if (type === 'phone' && !value.match(/^[-+()（）0-9]{6,}$/)) {
          result[key].type = false
        }
        if (type === 'idcard') {
          result[key].type = (function(string) {
            var sum = 0
            var xs = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            var ms = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
            xs.map((item, i) => (sum += xs[i] * string[i]))
            return string[17].toUpperCase() === String(ms[sum % 11])
          })(value)
        }
      }
      // min-max
      if (min) {
        max = max || min
        var length = type === 'number' ? value : value.length
        if (length < min) {
          result[key].min = false
        }
        if (length > max) {
          result[key].max = false
        }
      }
      // reg
      if (reg) {
        var flags = rule.match(/\/([a-z]+)|$/)[1]
        if (!value.match(RegExp(reg, flags))) {
          result[key].reg = false
        }
      }
    }
  }
  var pass = !JSON.stringify(result).match('":false')

  var validated = new Promise((rs, rj) => {
    pass ? rs(result) : rj(result)
  })
  validated.pass = pass
  validated.result = result

  callback(pass, result)
  if (!pass) {
    console.warn('validate', pass, result)
  }
  return validated
}

/**
 * 默认提示消息，默认回调中使用
 */
validate.tips = {
  required: '{name}需要填写',
  type: '{name}填写错误',
  min: '{name}长度不足',
  max: '{name}长度太长',
  reg: '{name}填写错误',
}

/**
 * 默认校验回调
 * @param {boolean} pass 是否通过
 * @param {object} result 校验结果
 */
validate.callback = function(pass, result) {
  if (!pass) {
    for (var key in result) {
      var valid = result[key]
      for (var rule in validate.tips) {
        if (!valid[rule]) {
          var msg = valid.tips || validate.tips[rule]
          msg = msg.replace('{name}', valid.name)
          validate.onerror(msg)
          return
        }
      }
    }
  }
}

/**
 * 不通过时的默认提示方式，默认回调中使用
 * @param {string} msg 提示信息
 */
validate.onerror = function(msg) {
  alert(msg)
}

export default validate

// console
window.validate = validate
