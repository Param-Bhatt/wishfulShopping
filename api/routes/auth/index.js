const router = require('express').Router()

//router.use('/', require('./auth.js'))
router.use('/signup/', require('./signup.js'))
router.use('/login/', require('./login.js'))
router.use('/register', require('./register.js'))
router.use('/reset', require('./resetPassword.js'))
router.use('/gLogin', require('./gLogin.js'))
module.exports = router
