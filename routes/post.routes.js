
const Router = require('express')
const router = new Router()
const postController = require('../controllers/post.controller')

router.post('/postproperties_m', postController.createPost_m) 
router.post('/postpropertiesflap_m', postController.createPost_flap_m) 
router.post('/post_properties_trim', postController.createPost_trim) 

router.get('/filed', postController.filed_to_good) 
router.post('/key', postController.key_DiffieHellman)
router.post('/roll', postController.record_roll)
router.get('/changeLinkGlobal', postController.changeLinkGlobal)
router.get('/changeLinkLocal', postController.changeLinkLocal)
router.get('/changeLinkGlobalt4', postController.changeLinkGlobalt4)
router.get('/changeLinkLocalt4', postController.changeLinkLocalt4)

module.exports = router