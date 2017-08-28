/* global expect, sinon*/

const guardScope = require('../../libs/auth').guardScope

describe('libs/auth.js', () => {

    describe('guardScope()', () => {

        it('should create guard function', () => {
            let fn = guardScope('test')
            expect(fn).to.be.a('function')
        })
        it('should not create guard function if no scope given', () => {
            try {
                guardScope('')
            } catch (error) {
                expect(error).to.be.an('Error')
                expect(error.message).to.be.equal('Invalid scope value: cannot be empty!')
            }
            // expect(fn).to.throw(Error)
        })
        it('should create guard function which rejects invalid scope', () => {
            let fn = guardScope('query')
            let next = sinon.spy()
            let req = {
                user: {
                    scope: 'admin'
                }
            }

            fn(req, {}, next)

            expect(next.called).to.be.true
            expect(next.getCall(0).args[0]).to.have.property('name', 'APIError')
            expect(next.getCall(0).args[0]).to.have.property('code', 403)

        })
        it('should create guard function which rejects when invalid user', () => {
            let fn = guardScope('query')
            let next = sinon.spy()
            let req = {
                user: {
                    scopeeee: 'admin'
                }
            }

            fn(req, {}, next)

            expect(next.called).to.be.true
            expect(next.getCall(0).args[0]).to.have.property('name', 'APIError')
            expect(next.getCall(0).args[0]).to.have.property('code', 403)

        })
        it('should create guard function which accepts valid scope', () => {
            let fn = guardScope('query')
            let next = sinon.spy()
            let req = {
                user: {
                    scope: 'query'
                }
            }

            fn(req, {}, next)

            expect(next.called).to.be.true
            expect(next.getCall(0).args[0]).to.be.undefined
        })
    })
})
