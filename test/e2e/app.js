/* global expect, sinon*/


describe('[E2E] app.js', () => {
    it('should return 404 for invalid route')
    it('should return 401 for invalid token')
    it('should return 403 for invalid token scope')
    it('should return 500 for internal error but not leak stack trace')
    it('should protect all endpoints with JWT token guard')
})
    