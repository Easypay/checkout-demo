/**
 * Gets the iframeUrl if overridden by environment variables.
 * Only used in debugging.
 */
function getIframeUrl(callback) {
  const req = new XMLHttpRequest()
  req.onreadystatechange = (e) => {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        if (req.responseText) {
          sessionStorage.setItem('iframeUrl', req.responseText)
        } else {
          sessionStorage.removeItem('iframeUrl')
        }
        callback()
      } else {
        console.error(`Error ${req.status} ${req.statusText}`, req.responseText)
      }
    }
  }
  req.open('GET', 'iframeUrl')
  req.send()
}