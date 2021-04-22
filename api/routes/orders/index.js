const router = require('express').Router()

router.use('/place', require('./placeOrder.js'))
router.use('/cancel', require('./cancelOrder.js'))
module.exports = router
