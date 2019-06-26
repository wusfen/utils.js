var utils = {
  clone: function clone(obj, deep){
    if(deep === true) deep = 10
    var _obj = obj
    if(obj && (obj.constructor == Object || obj instanceof Array)){
      var _obj = obj instanceof Array? []: {}
      for(var key in obj){
        if(obj.hasOwnProperty(key)){
          _obj[key] = --deep? clone(obj[key], deep): obj[key]
        }
      }
    }
    return _obj
  },
  toUrlParams: function (value){
    var params = ''

    function loopValue(key, value){
      if(value && (value.constructor==Object || value instanceof Array)){
        for(var k in value){
          if (!value.hasOwnProperty(k)) continue
          var subKey = !key? k: '[' + k + ']' // obj[k]
          loopValue(key + subKey, value[k])
        }
      } else {
        if(value === undefined || value === null) value = ''
        if(typeof value ==='function') value = value()
        key = key.replace(/\[\d+?\]$/g, '[]') // obj[arr][0] => obj[arr][]
        key = encodeURIComponent(key)
        value = encodeURIComponent(value)
        params += (params?'&':'') + key + '=' + value // &obj[k][s]=value
      }
    }
    loopValue('', value)

    return params.replace(/%20/g, '+') // ' ' => '+'
  },
  getUrlParam: function (name) {
    return location.href.match(RegExp('[?&]' + name+ '=([^&]+)|$'))[1]
  },
  reg: function (name, string, flags) {
    if (!string) {
      return reg[name]
    }
    string = string.source || string

    for (var k in reg) {
      if (!reg.hasOwnProperty(k)) continue
      var n = RegExp('{' + k.replace(/[.(){}[\]]/g, '\\$&') + '}', 'g')
      var s = reg[k].source
      var v = s.match(/\|/) ? '(?:' + s + ')' : s
      string = string.replace(n, v)
    }

    var r = RegExp(string, flags)
    if (name !== null) {
      reg[name] = r
    }
    
    return r
  },
  /**
   * 补间函数
   * start{Nubmer}: 开始值
   * end{Number}: 结束值
   * callback(value): 过程回调
   *   value{Number}: 补间过程 start 到 end 间当前的值
   * return{Object}
   *   update(callback): 链式设置 callback
   */
  tween (start, end, callback) {
    let timeout = 250
    let timeGap = 16
    let times = timeout / timeGap
    let diff = end - start
    let step = diff / times
    let timer = setInterval(() => {
      start += step
      if ((step >= 0 && start >= end) || (step <= 0 && start <= end)) {
        start = end
        clearInterval(timer)
      }
      callback(start)
    }, timeGap)
    return {
      update (fn) {
        callback = fn
      }
    }
  },
}

module.exports = utils
