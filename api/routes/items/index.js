const router = require('express').Router()

router.use('/add', require('./addItem.js'))
router.use('/remove', require('./removeItem.js'))
module.exports = router
