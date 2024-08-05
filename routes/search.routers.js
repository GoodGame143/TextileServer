const Router = require('express')
const router = new Router()
const searchController = require('../controllers/search.controller')

router.post('/roll', searchController.searchr)


module.exports = router