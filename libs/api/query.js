const validator = require('validator')
const debug = require('debug')('tv:api:query')
const APIError = require('../APIError')


module.exports = {
    queryTVAntennas: function queryTVAntennas(req, res, next) {
        debug('queryTVAntennas()')
        Promise.resolve()
        // validate input
            .then(() => {
                let lat = req.query.lat
                let lon = req.query.lon

                // validator throws if param is not string
                try {
                    if (!validator.isFloat(lat, { min: -90, max: +90 })) throw new APIError('Invalid Query', 'Invalid latitude value', 400)
                    if (!validator.isFloat(lon, { min: -180, max: +180 })) throw new APIError('Invalid Query', 'Invalid longitude value', 400)
                } catch (error) {
                    throw error instanceof APIError? error : new APIError('Invalid Query', 'Query parameters are invalid', 400)
                }

                let query = {
                    coverage: {
                        $geoIntersects: {
                            $geometry: {
                                type: 'Point',
                                coordinates: [ +lon, +lat ]
                            }
                        }
                    }
                }

                let projection = {_id: 0, coverage: 0}

                return req.DB.collection('antennas').find(query, projection).toArray()
            })
            .then((queryResults)=>{
                debug('queryResult=', queryResults)
                
                let response = {
                    stations: queryResults
                }

                return res.json(response)
            })
            .catch(next)


        


    }
}