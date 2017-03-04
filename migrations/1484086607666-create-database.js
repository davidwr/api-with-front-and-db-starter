require('../bootstrap')
var pgtools = require('pgtools')
var dbConfig = _.clone(CONFIG.db)
var database = dbConfig.database
delete dbConfig.database

module.exports.up = (next) => {
  pgtools.createdb(dbConfig, database, function (err, res) {
    if (err) return next(err.pgErr.toString())
    next()
  })
}

module.exports.down = (next) => {
  var poll = require('../src/db/connection_factory').getPool
  poll.end()
  pgtools.dropdb(dbConfig, database, function (err, res) {
    if (err) return next(err.pgErr.toString())
    next()
  })
}
