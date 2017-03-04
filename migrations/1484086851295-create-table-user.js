var async = require('async')
var execSql = require('../src/db/connection_factory').executeSql

module.exports.up = (next) => {
  async.eachSeries([
    `
    CREATE TABLE authentication (
      handle serial PRIMARY KEY,
      user VARCHAR(100) NOT NULL,
      password VARCHAR(150) NOT NULL,
      identification VARCHAR(200) NOT NULL,
      CONSTRAINT unique_user UNIQUE (user)
    );
    `
  ], execSql, next)
}

module.exports.down = (next) => {
  async.eachSeries(
    [
      `
      DROP TABLE authentication CASCADE;
      `
    ],
    (sql, cb) => {
      execSql(sql, () => cb())
    },
    next
  )
}
