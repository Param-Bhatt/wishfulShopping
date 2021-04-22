const router = require('express').Router()

router.use('/place', require('./placeOrder.js'))
module.exports = router
