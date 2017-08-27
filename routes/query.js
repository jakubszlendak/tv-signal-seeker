const router = require('express').Router()
const queryAPI = require('../libs/api/query')
const guardScope = require('../libs/auth').guardScope


router.use(guardScope('query'))
router.get('/', queryAPI.queryTVAntennas)

module.exports = router
