/* global expect, sinon*/
const APIError = require('../../libs/APIError')

describe('libs/APIError.js', () => {
    it('should convert to json response', () => {
        let err = new APIError('Invalid developer', 'Developer is a teapot', 418)
        let response = err.toResponse()
        expect(response).to.be.deep.equal({
            error: 'Invalid developer',
            message: 'Developer is a teapot',
            name: 'APIError'
        })
    })

    it('should default status to 500', () => {
        let err = new APIError('Invalid developer', 'Developer is a teapot')
        expect(err.code).to.be.equal(500)
    })

})