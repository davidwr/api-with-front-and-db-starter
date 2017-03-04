var router = module.exports = require('express').Router()

var auth = require('../controllers/authentication')
var isAuthenticated = require('../policies/is_authenticated')

router.post('/login', auth.login)
router.get('/logout', isAuthenticated, auth.logout)
