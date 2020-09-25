/**
 * <div bi="action"></div>
 */
addEventListener('click', function(e) {
  var path = e.path || []
  path.forEach(el => {
    if (!el.getAttribute) return
    var biAttr = el.getAttribute('bi')
    if (biAttr !== null) {
      bi(biAttr || el.innerText)
    }
  })
})

/**
 * @example
 * bi('action')
 * @param {string} action
 */
export function bi(action) {
  var data = {
    action,
  }

  console.info('[bi todo]', action, data)
}

// ip
var script = document.createElement('script')
script.src = 'https://pv.sohu.com/cityjson?ie=utf-8'
document.head.appendChild(script)

export default bi
