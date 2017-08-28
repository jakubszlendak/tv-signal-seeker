/* global expect, sinon*/
const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../app')
const config = require('../../config')
const hooks = require('../hooks')

describe('[E2E] app.js', () => {

    before(hooks.before)
    after(hooks.after)

    const validToken = jwt.sign({
        id: 11,
        name: 'Jakub Szlendak',
        secret_msg: 'Ptaki lataja kluczem',
        scope: 'query'
    }, config.auth.jwtSecret)


    it('should return APIError when invalid query', (done) => {
        let token = jwt.sign({
            id: 11,
            name: 'Jakub Szlendak',
            secret_msg: 'Ptaki lataja kluczem',
            scope: 'query'
        }, config.auth.jwtSecret)


        request(app)
            .get('/query')
            .query({ lat: 'xxx', lon: 'zzz' })
            .set({ authorization: 'Bearer ' + token })
            .expect('Content-Type', /json/)
            .expect(400, {
                name: 'APIError',
                error: 'InvalidQueryError',
                message: 'Invalid latitude value',
            })
            .end(done)
    })

    it('should return empty list when asked for middle of nowhere', (done) => {
        request(app)
            .get('/query')
            .query({ lat: '0', lon: '0' }) //there are no stations at 0,0 for sure...
            .set({ authorization: 'Bearer ' + validToken })
            .expect('Content-Type', /json/)
            .expect(200, {
                stations: []
            })
            .end(done)
    })

    it('should return empty list when asked for middle of nowhere', (done) => {
        request(app)
            .get('/query')
            .query({ lat: '0', lon: '0' }) //there are no stations at 0,0 for sure...
            .set({ authorization: 'Bearer ' + validToken })
            .expect('Content-Type', /json/)
            .expect(200, {
                stations: []
            })
            .end(done)
    })

    it('should return proper stations for location near Portland, Maine', (done) => {
        request(app)
            .get('/query')
            .query({ lon: '-70.3347255', lat: '43.8835463' }) //there are no stations at 0,0 for sure...
            .set({ authorization: 'Bearer ' + validToken })
            .expect('Content-Type', /json/)
            .expect(200, {
                stations: [{
                        description: "WPME BLCDT-20081103ADE             ",
                        id: 1275483,
                        service: "DT",
                        station: {
                            coordinates: [-70.32727,
                                43.85174,
                            ]
                        }
                    },
                    {
                        id: 1139004,
                        service: "LD",
                        description: "NEW BSFDTL-20060630DBG             ",
                        station: {
                            coordinates: [-70.00977,
                                44.15424
                            ]
                        }
                    }

                ]
            })
            .end(done)
    })

})