var pg = require('pg')

var CONFIG = require('../../config')
var DataBase = new pg.Pool(CONFIG.db)

module.exports.executeSql = function (sql, interpolacoes, callback) {
  if (_.isFunction(interpolacoes)) {
    callback = interpolacoes
    interpolacoes = []
  }

  DataBase.connect(function (err, conexao, fecharConexao) {
    if (err) {
      DataBase.on('error', function () {
        log.error('Erro na conexão', err.message, err.stack)
      })
      return callback(err)
    }
    conexao.query(sql, interpolacoes, function (err, resultado) {
      fecharConexao()
      return callback(err, resultado)
    })
  })
}

module.exports.getPool = DataBase
