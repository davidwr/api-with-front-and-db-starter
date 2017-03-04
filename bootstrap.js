var winston = require('winston')
global._ = require('lodash')

String.prototype.replaceAll = (search, replacement) => { // eslint-disable-line
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

var CONFIG = global.CONFIG = require('./config')
global.log = new (winston.Logger)({transports: [
  new (winston.transports.Console)({
    colorize: true,
    timestamp: true
  })
]})
