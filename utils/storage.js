/**
 * 本地存储
 * 自动序列化
 * 自动解析
 *
 * @example
 * session.key = 'value'
 * local.key = {k:'v'}
 */
export var session = create(sessionStorage)
export var local = create(localStorage)
export var storage = local
export default storage

function create(storage) {
  var obj = {
    traces: '',
    isShowLog: false,
  }
  var traces = []

  // load
  for (var key in storage) {
    try {
      var value = storage.getItem(key)
      obj[key] = JSON.parse(value)
    } catch (e) {}
  }

  function save(key, value, type) {
    obj[key] = value

    // save
    setTimeout(() => {
      // remove
      if (value === undefined) {
        storage.removeItem(key)
        return
      }
      try {
        storage.setItem(key, JSON.stringify(value, 0, '  '))
      } catch (e) {
        try {
          storage.clear()
          storage.setItem(key, JSON.stringify(value, 0, '  '))
        } catch (e) {}
      }
    }, 0)

    // traces
    try {
      throw Error(`[storage log] ${type} ${key} = ${value}`)
    } catch (e) {
      var stacks = e.stack.split('\n')
      var stack = `${stacks[0]}\n${stacks[3]}`
      traces.unshift(stack)
      if (obj.isShowLog) {
        console.warn(stack)
      }
      traces.length = Math.min(traces.length, 20)
    }
  }

  var proxy = new Proxy(obj, {
    get(obj, key) {
      if (key === 'traces') {
        return traces.join('\n')
      }
      var value = obj[key]
      save(key, value, 'get')
      return value
    },
    set(obj, key, value) {
      save(key, value, 'set')
      return true
    },
  })

  return proxy
}

// console
window.session = session
window.local = local
window.storage = storage
