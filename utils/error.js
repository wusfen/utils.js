function handler(e) {
  if (e._hasHandler) return
  e._hasHandler = true

  var info = {
    message: e.message,
    title: document.title,
    url: location.href,
    target: (e.target && e.target.outerHTML) || e.target + '',
    path: [...(e.path || [])].map(el => el.className || el.tagName).join(),
    filename: e.filename,
    stack: e.error && e.error.stack,
    ua: navigator.userAgent,
  }
  info.json = JSON.stringify(info, null, '  ')
  info.e = e

  // <img src="">
  if (e.target instanceof Image && !e.target.getAttribute('src')) {
    return
  }

  console.info('%c[error]', 'color:red', info)
  var timer = setInterval(() => {
    if (window._hmt && window._hmt.id) {
      clearInterval(timer)
      if (!location.href.match('iandcode.com')) return
      window._hmt.push([
        '_trackEvent',
        `error: ${info.title} ${info.url}`,
        info.ua,
        info.stack || info.target + info.path,
      ])
    }
  }, 500)
}

addEventListener('error', handler, true)
var ce = console.error
console.error = function(e) {
  ce.apply(console, arguments)
  if (e instanceof Error) {
    handler(e)
  }
}

addEventListener('load', function() {
  if (!window._hmt) {
    window._hmt = []
    var hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?905187a6dfe554fe28168ec64a1908de'
    document.head.appendChild(hm)
    window._hmt.push(['_trackEvent', `view`, document.title, location.href])
  }
})
