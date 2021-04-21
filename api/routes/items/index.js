const router = require('express').Router()

router.use('/add', require('./addItem.js'))
router.use('/remove', require('./removeItem.js'))
router.use('/display', require('./displayItems.js'))
router.use('/info', require('./itemInfo.js'))
router.use('/review', require('./reviews.js'))

module.exports = router
