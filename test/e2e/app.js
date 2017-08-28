/* global expect, sinon*/
const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../app')
const config = require('../../config')

describe('[E2E] query.js', () => {
    it('should return 401 when no token at all', (done)=>{
        request(app)
            .get('/query')
            .expect('Content-Type', /json/)
            .expect(401, {
                error: 'Unauthorized',
                message: 'Invalid authorization token',
                name: 'UnauthorizedError',
            })
            .end(done)
    })
    it('should return 403 when invalid scope', (done)=>{
        let token = jwt.sign({
            id: 11,
            name: 'Jakub Szlendak',
            secret_msg: 'Ptaki lataja kluczem',
            scope: 'xxx'
          }, config.auth.jwtSecret)

        
        request(app)
            .get('/query')
            .set({ authorization: 'Bearer ' + token })
            .expect('Content-Type', /json/)
            .expect(403, {
                error: 'Forbidden',
                name: 'APIError',
                message: 'You are not allowed to access this resource',
            })
            .end(done)
    })
    it('should return Authorization Error when invalid token', (done)=>{
        let token = jwt.sign({
            id: 11,
            name: 'Jakub Szlendak',
            secret_msg: 'Ptaki lataja kluczem',
            scope: 'query'
          }, 'ptakikluczem')

        
        request(app)
            .get('/query')
            .set({ authorization: 'Bearer ' + token })
            .expect('Content-Type', /json/)
            .expect(401, {
                error: 'Unauthorized',
                message: 'Invalid authorization token',
                name: 'UnauthorizedError',
            })
            .end(done)
    })

    it('should return 404 when invalid route', (done)=>{
        let token = jwt.sign({
            id: 11,
            name: 'Jakub Szlendak',
            secret_msg: 'Ptaki lataja kluczem',
            scope: 'xxx'
          }, config.auth.jwtSecret)

        
        request(app)
            .get('/nowhere')
            .set({ authorization: 'Bearer ' + token })
            .expect('Content-Type', /json/)
            .expect(404, {
                error: 'Not Found',
                message: 'Resource not found',
                name: 'APIError'
            })
            .end(done)
    })
    
})
    