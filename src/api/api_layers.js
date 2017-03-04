var toobusy = require('toobusy-js')

module.exports.servicoIndisponivel = (req, res, next) => {
  if (!toobusy()) return next()
  res.status(503).send('Serviço temporariamente indisponível.')
}

module.exports.erroInesperado = (err, req, res, next) => {
  res.status(500).send(err.message)
}

module.exports.rotaNaoEncontrada = (req, res, next) => {
  res.status(404).send('Rota não encontrada.')
}
