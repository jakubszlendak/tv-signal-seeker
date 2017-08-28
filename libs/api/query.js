const validator = require('validator')
const debug = require('debug')('tv:api:query')
const APIError = require('../APIError')


module.exports = {
    queryTVAntennas: function queryTVAntennas(req, res, next) {
        debug('queryTVAntennas()')
        return Promise.resolve()
            .then(() => {
                // validate input
                let lat = req.query.lat
                let lon = req.query.lon

                if (!validator.isFloat('' + lat, {
                        min: -90,
                        max: +90
                    })) throw new APIError('Invalid Query', 'Invalid latitude value', 400)
                if (!validator.isFloat('' + lon, {
                        min: -180,
                        max: +180
                    })) throw new APIError('Invalid Query', 'Invalid longitude value', 400)


                let query = {
                    coverage: {
                        $geoIntersects: {
                            $geometry: {
                                type: 'Point',
                                coordinates: [+lon, +lat]
                            }
                        }
                    }
                }

                // supress coverage contour from DB response to save time&bandwith
                let projection = {
                    _id: 0,
                    coverage: 0
                }

                return req.DB.collection('antennas').find(query, projection).toArray()
            })
            .then((queryResults) => {
                debug('queryResult=', queryResults)

                let response = {
                    stations: queryResults
                }

                return Promise.resolve(response)
            })
    }
}