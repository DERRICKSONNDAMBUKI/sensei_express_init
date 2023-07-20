const { signup, signin, signout } = require('../../controllers/user/auth.controller')
const router = require('express').Router()

router.post('/signup', signup)
router.post('/signin',signin)
router.get('/signout',signout)

module.exports = router