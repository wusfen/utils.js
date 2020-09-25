// blur body position
if (/iphone|ipod|ipad/i.test(navigator.appVersion)) {
  addEventListener(
    'blur',
    function() {
      document.documentElement.scrollTop--
      document.documentElement.scrollTop++
    },
    true
  )
}

// ios :active
document.body.addEventListener('touchstart', function(e) {})

// document.title
if (Object.defineProperty) {
  Object.defineProperty(document, 'title', {
    set(title) {
      // console.log('document.title =', title)
      // raw
      document.querySelector('title').innerText = title

      // if: wechatdevtools
      if (/wechatdevtools/i.test(navigator.userAgent)) {
        // trigger onload
        var iframe = document.createElement('iframe')
        iframe.src = 'data:text/html,1'
        iframe.style.display = 'none'
        iframe.onload = function(e) {
          document.body.removeChild(iframe)
        }
        document.body.appendChild(iframe)
      }

      // if: dingding
      if (/DingTalk/i.test(navigator.userAgent)) {
        try {
          window.WebViewJavascriptBridge.callHandler(
            'biz.navigation.setTitle',
            { title }
          )
        } catch (_) {}
      }
    },
    get() {
      return document.querySelector('title').innerText
    },
  })
}

// history.replaceState 影响微信浏览器长按识别二维码
if (/MicroMessenger/i.test(navigator.userAgent)) {
  var _replaceState = history.replaceState
  if (!/location/.test(_replaceState)) {
    history.replaceState = function replaceState() {
      _replaceState.apply(history, arguments)
      location.replace(location.href.replace(/#(.*)|$/, '#$1')) // #?
    }
  }
}
