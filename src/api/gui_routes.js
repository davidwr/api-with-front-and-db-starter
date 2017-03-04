var main = module.exports = require('express').Router()

var view = require('../controllers/view')

main.get('/', view.index)
