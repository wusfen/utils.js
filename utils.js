var utils = {
  clone: function(obj, deep){
    var _obj = obj
    if(obj && (obj.constructor == Object || obj instanceof Array)){
      var _obj = obj instanceof Array? []: {}
      for(var key in obj){
        if(obj.hasOwnProperty(key)){
          _obj[key] = deep? clone(obj[key]): obj[key]
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
  }
}

module.exports = utils
