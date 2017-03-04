var fs = require('fs')

var cachedViews = {}

function renderView (res, viewName) {
  if (process.env.NODE_ENV === 'production') {
    if (!cachedViews[viewName]) {
      cachedViews[viewName] = fs.readFileSync(CONFIG.gui_root + '/' + viewName + '.html')
        .toString()
        .replace(/(?:\r\n|\r|\n)/g, '')
        .replace(/>\s+</g, '><')
    }
    res.type('html')
    res.send(cachedViews[viewName])
  } else {
    res.sendFile(CONFIG.gui_root + '/' + viewName + '.html')
  }
}

module.exports.index = (req, res) => {
  renderView(res, 'main')
}
