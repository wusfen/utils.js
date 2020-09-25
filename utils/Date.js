/**
 * Date 增强版
 * 增加链式加减和格式化
 * @example
 * import Date from '../Date'
 * new Date()
 *  .add('FullYear', +1)
 *  .add('Month', -1)
 *  .format('yyyy-MM-dd')
 */
class Date extends global.Date {
  constructor(...args) {
    var string = args[0]
    if (typeof string === 'string') {
      args[0] = string
        .replace(/-/g, '/') // fix ios: 'yyyy-MM-dd' => 'yyyy/MM/dd'
        .replace(/^\d{4}\/\d{1,2}$/, '$&/01') // fix ios: 'yyyy/MM' => 'yyyy/MM/01'
    }
    super(...args)
  }

  /**
   * 日期格式化
   * @param {string} pattern y:年, M:月, d:日, E:星期 H:时, m:分, s:秒, S:毫秒
   */
  format(pattern = 'yyyy-MM-dd HH:mm:ss') {
    var date = this
    var map = {
      y: date.getFullYear(),
      M: date.getMonth() + 1,
      d: date.getDate(),
      H: date.getHours(),
      h: (function() {
        var h = date.getHours()
        return h > 12 ? h - 12 : h
      })(),
      m: date.getMinutes(),
      s: date.getSeconds(),
      S: date.getMilliseconds(),
    }
    for (var key in map) {
      pattern = pattern.replace(RegExp(key + '+', 'g'), function($) {
        var v = map[key] + ''
        var x = (Array($.length).join(0) + v).slice(-$.length)
        return v.length > x.length ? v : x
      })
    }

    return pattern.replace(/E+/g, function() {
      return String(date).match('中国')
        ? '星期' + '日一二三四五六'.charAt(date.getDay())
        : 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')[date.getDay()]
    })
  }

  /**
   * 链式加减日期
   * @param {string} name FullYear Month Date Hours Minutes Seconds Milliseconds
   * @param {number} n +1, -1
   */
  add(name, n) {
    this['set' + name](this['get' + name]() + n)
    return this
  }
}

export default Date