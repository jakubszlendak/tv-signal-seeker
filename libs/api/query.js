const validator = require('validator')
const debug = require('debug')('tv:api:query')
const APIError = require('../APIError')


module.exports = {
    /**
     * Return list of antennas which cover given location
     * @param req - express request
     * @return Promise{Object} Promise for query result. 
     * @throws APIError when invalid query parameter
     */
    queryTVAntennas: function queryTVAntennas(req) {
        debug('queryTVAntennas()')
        return Promise.resolve()
            .then(() => {
                // validate input
                let lat = req.query.lat
                let lon = req.query.lon
                debug(lat, lon, validator.isFloat('' + lat, {
                    min: -90,
                    max: +90
                }))
                if (!validator.isFloat('' + lat, {
                        min: -90,
                        max: +90
                    })) {
                    throw new APIError('InvalidQueryError', 'Invalid latitude value', 400)
                }
                if (!validator.isFloat('' + lon, {
                        min: -180,
                        max: +180
                    })) {
                    throw new APIError('InvalidQueryError', 'Invalid longitude value', 400)
                }


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
                    coverage: 0,
                    'station.type':0
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