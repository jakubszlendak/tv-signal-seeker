const isTesting = process.env.NODE_ENV == 'e2e_testing'


let testDbURI =  process.env.TV_TESTING_MONGODB_URI || `mongodb://localhost/test`

module.exports = {
    // If testing env, connect to test DB, otherwise use URI from env
    MongoURI: isTesting? testDbURI : process.env.TV_MONGODB_URI || `mongodb://localhost/tv`,
    MongoConfig: {},
    auth: {
        jwtSecret: process.env.TV_JWT_SECRET || 'secretsecret'
    }
}