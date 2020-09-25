/**
 * 发送 get 请求
 * @param {string} url
 * @param {object} params
 */
async function get(url, params) {
  var search = new URLSearchParams(params).toString()
  if (search) {
    search = (url.match('[?]') ? '&' : '?') + search
  }
  return ajax({
    url: `${url}${search}`,
  })
}

/**
 * 发送 post 请求
 * @param {string} url
 * @param {object} data
 */
async function post(url, data) {
  return ajax({
    method: 'POST',
    url,
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

/**
 * 发送 ajax
 * @param {object} options
 * @param {string?} options.type http method: GET, POST, ..
 * @param {string} options.url
 * @param {object?} options.headers
 * @param {object?} options.data
 */
async function ajax(options) {
  var url = options.url
  url = url.match(/^https?:/) ? url : `${ajax.base}/${url}`

  ajax.count += 1
  ajax.onloading()
  document.body.style.pointerEvents = 'none'

  return fetch(url, {
    method: options.method || options.type || 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
    body:
      typeof options.data === 'object'
        ? JSON.stringify(options.data)
        : options.data,
  })
    .catch(e => {
      ajax.onerror('*', { options, e })
      // alert(url)
      return Promise.reject(e)
    })
    .then(res => res.json())
    .then(res => {
      // console.info('[ajax]', url, options, res)

      // returnObject 别名 data
      res.data = res.data || res.returnObject

      // error
      if (res.errorCode !== '00') {
        // var msg = `[${res.errorCode}] ${res.errorMsg}`
        var msg = `${res.errorMsg}`
        ajax.onerror(msg, { options, res })

        return Promise.reject(res)
      }

      return res
    })
    .finally(res => {
      ajax.count -= 1
      if (ajax.count === 0) {
        document.body.style.pointerEvents = ''
        ajax.onloadend()
      }
    })
}

// 外部配置
ajax.base = ''
ajax.count = 0
ajax.onloading = function() {
  if (document.title !== 'loading...') {
    ajax.title = document.title
    document.title = 'loading...'
  }
}
ajax.onloadend = function() {
  if (document.title === 'loading...') {
    document.title = ajax.title
  }
}
ajax.onerror = function(msg, e) {
  alert(msg)
}

ajax.get = get
ajax.post = post
export {get, post, ajax}
export default ajax

// console
window.get = get
window.post = post
window.ajax = ajax
