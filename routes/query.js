const router = require('express').Router()
const queryAPI = require('../libs/api/query')
const guardScope = require('../libs/auth').guardScope


router.use(guardScope('query'))
router.get('/', (req, res, next) => {
    queryAPI.queryTVAntennas(req)
        .then((results) => {
            return res.json(results)
        })
        .catch(next)
})

module.exports = router