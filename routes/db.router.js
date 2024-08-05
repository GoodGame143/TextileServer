const Router = require('express')
const router = new Router()
const dbController = require('../controllers/db.controller')

//statistics
router.get('/d/:search_date', dbController.getInfoByDate)
router.get('/t/:search_time', dbController.getInfoByTime)
router.post('/sql', dbController.all_SQL_request)


module.exports = router