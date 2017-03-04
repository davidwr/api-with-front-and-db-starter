var connectionFactory = require('../db/connection_factory')

module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send('Não autenticado!')
  }

  var sql = `
    SELECT handle
    FROM authentication
    WHERE
      user=$1::varchar
    LIMIT 1`

  connectionFactory.executeSql(sql, [req.session.user], (err, result) => {
    if (err) return next(err)
    if (!result.rows[0]) return res.status(403).send('Acesso negado.')
    return next()
  })
}
