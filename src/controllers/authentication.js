var connectionFactory = require('../db/connection_factory')

module.exports.login = (req, res, next) => {  
  if (req.session.user) {
    return res.send('Já possui uma sessão em andamento, por favor faça logout!')
  }

  if (!req.body.user) {
    return res.status(400).send('Não foi informado o usuário.')
  }

  if (!req.body.password) {
    return res.status(400).send('Não foi informado a senha.')
  }

  var sql = `
    SELECT handle
    FROM authentication
    WHERE
      user=$1::varchar AND
      password=$2::varchar
    LIMIT 1`

  connectionFactory.executeSql(sql, [req.body.user, req.body.password], (err, result) => {
    if (err) return next(err)
    if (!result.rows[0]) return res.status(403).send('Acesso negado.')
    req.session.user = req.body.user
    res.send('Autenticado com sucesso!')
  })  
}

module.exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err)

    // Recarregar para tela inicial
    res.send('Você saiu!')
  })
}
