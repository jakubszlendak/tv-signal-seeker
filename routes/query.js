const router = require('express').Router()
const queryAPI = require('../libs/api/query')

router.get('/', queryAPI.queryTVAntennas)

module.exports = router
