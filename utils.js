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

    function loopValue(parentKey, value){
      if(value && (value.constructor==Object || value instanceof Array)){
        for(var k in value){
          if (!value.hasOwnProperty(k)) continue
          var key = !parentKey? k: '[' + (isNaN(k)?k:'') + ']'
          key = parentKey + key
          loopValue(key, value[k])
        }
      } else {
        if(value !== undefined){
          if(value === null) value = ''
          if(typeof value ==='function') value = value()
          var kv = encodeURIComponent(parentKey).replace(/%20/g, '+')	+ '='
            + encodeURIComponent(value).replace(/%20/g, '+')
          //kv = parentKey + '=' + value
          params += (params? '&': '') + kv
        }
      }
    }
    loopValue('', value)

    return params
  }
}

module.exports = utils
