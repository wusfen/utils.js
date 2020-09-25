/**
 * 'http://domain.com/img.png' => await 'data:image/png;base64,'
 * @param {string} url img.src
 * @returns {promise} 'data:image/png;base64,'
 */
export default function imgUrl2DataUrl(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (/^(2..|304)/.test(xhr.status)) {
        var blob = this.response
        var fileReader = new FileReader()
        fileReader.onloadend = function(e) {
          var result = e.target.result
          resolve(result)
        }
        fileReader.readAsDataURL(blob)
      } else {
        reject()
      }
    }
    xhr.onerror = function() {
      reject()
    }
    xhr.send()
  })
}
