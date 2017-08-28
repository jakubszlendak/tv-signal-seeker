/* global expect, sinon*/
const queryAPI = require('../../libs/api/query')


describe('libs/api/query.js', () => {

    describe('queryTVAntennas()', () => {

        let reqProto = {
            params: {},
            query: {},
            body: {},
            headers: {},
            DB: null
        }

        it('should deny invalid latitude (not present)',(done)=>{
            let req = Object.assign(reqProto, {
                query: {lon: '1'}
            })

            queryAPI.queryTVAntennas(req)
                .then((result)=>{
                    throw new Error('Function was supposed to fail! + ', result)
                })
                .catch((err)=>{
                    expect(err.name).to.be.equal('APIError')
                    expect(err.code).to.be.equal(400)
                    expect(err.error).to.be.equal('Invalid Query')
                    expect(err.message).to.be.equal('Invalid latitude value')
                    done()
                })
        })
        it('should deny invalid latitude (not a number, but string)',(done)=>{
            let req = Object.assign(reqProto, {
                query: {lon: '1', lat: 'wtf?'}
            })

            queryAPI.queryTVAntennas(req)
                .then((result)=>{
                    throw new Error('Function was supposed to fail! + ', result)
                })
                .catch((err)=>{
                    expect(err.name).to.be.equal('APIError')
                    expect(err.code).to.be.equal(400)
                    expect(err.error).to.be.equal('Invalid Query')
                    expect(err.message).to.be.equal('Invalid latitude value')
                    done()
                })
        })
        it('should deny invalid latitude (not even string)',(done)=>{
            let req = Object.assign(reqProto, {
                query: {lon: '1', lat: { wtf: 'wtf?'}}
            })

            queryAPI.queryTVAntennas(req)
                .then((result)=>{
                    throw new Error('Function was supposed to fail! + ', result)
                })
                .catch((err)=>{
                    expect(err.name).to.be.equal('APIError')
                    expect(err.code).to.be.equal(400)
                    expect(err.error).to.be.equal('Invalid Query')
                    expect(err.message).to.be.equal('Invalid latitude value')
                    done()
                })
        })
        it('should deny invalid longitude (not present)', (done)=>{
            let req = Object.assign(reqProto, {
                query: {lat: '1'}
            })

            queryAPI.queryTVAntennas(req)
                .then((result)=>{
                    throw new Error('Function was supposed to fail! + ', result)
                })
                .catch((err)=>{
                    expect(err.name).to.be.equal('APIError')
                    expect(err.code).to.be.equal(400)
                    expect(err.error).to.be.equal('Invalid Query')
                    expect(err.message).to.be.equal('Invalid longitude value')
                    done()
                })
        })
        it('should deny invalid longitude (not a number, but string)', (done)=>{
            let req = Object.assign(reqProto, {
                query: {lat: 'wtf?'}
            })

            queryAPI.queryTVAntennas(req)
                .then((result)=>{
                    throw new Error('Function was supposed to fail! + ', result)
                })
                .catch((err)=>{
                    expect(err.name).to.be.equal('APIError')
                    expect(err.code).to.be.equal(400)
                    expect(err.error).to.be.equal('Invalid Query')
                    expect(err.message).to.be.equal('Invalid latitude value')
                    done()
                })
        })
        it('should deny invalid longitude (not even string)', (done)=>{
            let req = Object.assign(reqProto, {
                query: {lat: {wtf: 'wtf?'}}
            })

            queryAPI.queryTVAntennas(req)
                .then((result)=>{
                    throw new Error('Function was supposed to fail! + ', result)
                })
                .catch((err)=>{
                    expect(err.name).to.be.equal('APIError')
                    expect(err.code).to.be.equal(400)
                    expect(err.error).to.be.equal('Invalid Query')
                    expect(err.message).to.be.equal('Invalid latitude value')
                    done()
                })
        })
        it('should call DB method with proper query and return result', (done)=>{
            let toArrayStub = sinon.stub().returns([])
            let findStub = sinon.stub().returns({toArray: toArrayStub})
            let collectionStub = sinon.stub().returns({find: findStub})
            let req = Object.assign(reqProto, {
                query: {lat: '12.1234', lon: '12.4321'},
                DB: {
                    collection: collectionStub
                }
            })

            queryAPI.queryTVAntennas(req)
                .then((result)=>{
                    let query = findStub.getCall(0).args[0]
                    let projection = findStub.getCall(0).args[1]
                    
                    // check query
                    expect(collectionStub.getCall(0).args[0]).to.be.equal('antennas')
                    expect(query.coverage.$geoIntersects.$geometry.type).to.be.equal('Point')
                    expect(query.coverage.$geoIntersects.$geometry.coordinates[0]).to.be.equal(12.4321)
                    expect(query.coverage.$geoIntersects.$geometry.coordinates[1]).to.be.equal(12.1234)
                    expect(projection).to.have.property('coverage', 0)
                    expect(projection).to.have.property('_id', 0)
                    
                    // check result
                    expect(result.stations).to.be.deep.equal([])

                    done()
                })
                .catch(done)
        })
        
    })
})
