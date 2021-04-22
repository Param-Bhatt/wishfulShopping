const router = require('express').Router()

router.use('/place', require('./placeOrder.js'))
router.use('/cancel', require('./cancelOrder.js'))
router.use('/display', require('./displayOrder.js'))
module.exports = router
