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
  }
}

module.exports = utils
