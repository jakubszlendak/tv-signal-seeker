/* global database */
const mongodb = require('mongodb')

const config = require('../config')
const mocks = require('./mocks')
module.exports = {
    before: function(done) {
        let dbURL = config.MongoURI
        if (dbURL !== 'mongodb://localhost/test') {
            return done(new Error('Look out, it seems it is wrong DB for tests!'))
        }
        if (process.env.NODE_ENV !== 'e2e_testing') {
            return done(new Error('Wrong NODE_ENV. Run tests with npm run e2e.'))
        }

        mongodb.connect(dbURL, config.MongoConf, (err, DB) => {
            if (err) return done(err)
            database = DB //eslint-disable-line
            DB.collection('antennas').insert(mocks, (err)=> {
                if(err) return done(err)
                DB.collection('antennas').createIndex({'coverage': '2dsphere'}, (err)=>{
                    if(err) return done(err)
                    console.log('Connected to test DB:', config.MongoURI) //eslint-disable-line
                    return done()
                })
            })
        })
    },
    after: function(done) {
        database.collection('antennas').remove({}, (err)=>{
            if (err) return done(err)
            database.close(() => {
                console.log("Mongo test db closed") //eslint-disable-line
                done()
            })
        })
        
    }
}