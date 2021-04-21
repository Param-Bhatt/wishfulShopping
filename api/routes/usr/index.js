const router = require('express').Router()

router.use('/profile', require('./profile.js'))
router.use('/cart', require('./cart.js'))
module.exports = router
