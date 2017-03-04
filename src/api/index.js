var express = require('express')
var async = require('async')
var cookieParser = require('cookie-parser')
var cors = require('cors')
var bodyParser = require('body-parser')
var session = require('express-session')
var expressLogger = require('morgan')
var MemoryStore = require('session-memory-store')(session)
var http = require('http')
var https = require('https')
var fs = require('fs')

var camadasAPI = require('./api_layers')

var app = express()

var sessionDuration = 1000 * 60 * 60 * 24 * 30 // 30 dias
var sessionOptions = {
  secret: CONFIG.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: sessionDuration},
  store: new MemoryStore({
    expires: sessionDuration
  })
}

if (process.env.NODE_ENV === 'development') {
  app.use(expressLogger('dev'))
}

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(session(sessionOptions))
app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
  var compression = require('compression')
  var minify = require('express-minify')
  var shortid = require('shortid')

  shortid.worker(666)

  app.use(compression())
  app.use((req, res, next) => {
    if (/(angular|\.min)\.(css|js)/.test(req.url)) {
      res._no_minify = true
      res._uglifyCompress = false
    }
    res._uglifyMangle = false
    next()
  })
  app.use(minify({
    js_match: /javascript/,
    css_match: /css/
  }))
}

app.use(camadasAPI.servicoIndisponivel)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(CONFIG.gui_root))
app.use(cors({
  origin: true,
  credentials: true
}))
app.use('/api/v1', require('./routes'))
app.use('/', require('./gui_routes'))
app.use(camadasAPI.erroInesperado)
app.use(camadasAPI.rotaNaoEncontrada)

module.exports = (callback) => {
  async.series([
    (cb) => {
      if (!CONFIG.https.active) return cb()
      var credentials = {
        pfx: fs.readFileSync(CONFIG.https.pfx)
      }
      https.createServer(credentials, app).listen(CONFIG.https.port, cb)
    },
    (cb) => {
      if (CONFIG.https.active) {
        http.createServer((req, res) => {
          res.writeHead(301, {'Local': 'https://' + req.headers.host + req.url})
          res.end()
        }).listen(CONFIG.api.port, cb)
      } else {
        http.createServer(app).listen(CONFIG.api.port, cb)
      }
    }
  ], callback)
}
