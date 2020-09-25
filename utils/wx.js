import { getParams, setParams } from './url'
import { ajax } from './ajax'
import { session } from './storage'

/**
 * 微信授权 code
 * @param {object} options {redirect_uri?, scope?, state?}
 */
export function authorize(options = {}) {
  options.redirect_uri = options.redirect_uri || location.href
  // 去掉code参数
  options.redirect_uri = setParams(options.redirect_uri, {
    code: undefined,
    state: undefined,
  })

  if (process.env.NODE_ENV === 'development') {
    options.redirect_uri = `https://wx.wit-learn.com/subProg/weChat/h5Seed/code.html?redirect_uri=${encodeURIComponent(
      options.redirect_uri
    )}`
  }

  // 202008 注意： 参数顺序不可调换，特别是 微信pc版 appid 须放第一位
  var url = `
		https://open.weixin.qq.com/connect/oauth2/authorize
		?appid=${authorize.appid}
		&redirect_uri=${encodeURIComponent(options.redirect_uri)}
		&response_type=code
		&scope=${options.scope || 'snsapi_base' || 'snsapi_userinfo'}
		&state=${options.state || 'STATE'}
		#wechat_redirect
  `
    .replace(/\s/g, '')
    .replace(/&style=STATE/, '')
  session.authorizeUrl = url

  // fuck weixin webview
  // location.replace 没有去掉历史
  // console.log(url)
  if (
    navigator.userAgent.match(/MicroMessenger/i) &&
    !navigator.userAgent.match(/wechatdevtools/i)
  ) {
    history.back()
    setTimeout(() => {
      location.href = url
    }, 0)
  } else {
    location.replace(url)
  }
}
authorize.appid = 'config rewrite'

/**
 * 微信 code 登录
 * url
 *   login()
 *     if param('code')
 *       ajax('wxLogin', {code})
 *     else
 *       location.replace('authorize?redirect_uri=url')
 *         url?code
 *           login()
 * @param {object?} options authorize(options)
 * @returns {object} user
 */
export async function login(options = {}) {
  console.log('[login] url', location.href)
  // code
  var code = getParams().code

  // code once: -- url?code
  // 这行会影响识别二维码和分享文案！！！
  // history.replaceState('', '', setParams({ code: undefined }))

  // dev test
  if (!navigator.userAgent.match(/MicroMessenger/i)) {
    let data = {
      openId: 'dev test',
    }
    console.warn('[login]', data)
    return data
  }

  // cache?
  var user = session.user
  if (user && user.openId && user.unionId) {
    console.log('[login] cache', { ...user })
    return user
  }

  // !code authorize
  if (!code) {
    authorize(options)
    return Promise.reject('[login] !code')
  }

  // login
  var { data } = await ajax
    .get('/weChatApi/sr/rmk/xqbg/login', { code })
    .catch(res => {
      console.error('[login]', res)
      return Promise.reject('[login] error')
    })

  // cache
  session.user = data

  return data
}

// console
window.authorize = authorize
window.login = login
