const router = require('express').Router()

router.use('/profile', require('./profile.js'))
module.exports = router
