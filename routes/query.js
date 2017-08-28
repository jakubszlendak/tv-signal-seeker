const router = require('express').Router()
const queryAPI = require('../libs/api/query')
const guardScope = require('../libs/auth').guardScope


// apply scope guard on every route in this router
router.use(guardScope('query'))

// get TV antennas for given localization
router.get('/', (req, res, next) => {
    queryAPI.queryTVAntennas(req)
        .then((results) => {
            return res.json(results)
        })
        .catch(next)
})

module.exports = router