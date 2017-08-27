var isDev = process.env.NODE_ENV == "development" ?
    true :
    false



module.exports = {
    isDev,
    MongoURI: process.env.TV_MONGODB_URI || `mongodb://localhost/tv`,
    MongoConfig: {},
    auth: {
        jwtSecret: process.env.TV_JWT_SECRET || 'secretsecret'
    },
    session: {
        secret: process.env.SESSION_SECRET || 'aldsfncxvxocugsdfgnssdflkjh'
    }
}