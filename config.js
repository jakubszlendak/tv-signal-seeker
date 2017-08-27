var isDev = process.env.NODE_ENV == "development" ?
    true :
    false



module.exports = {
    isDev,
    MongoURI: (isDev) ? `mongodb://localhost/tv` : process.env.TV_MONGODB_URI,


    testing: {
        MongoURI: "mongodb://localhost/test-db"
    },
    auth: {

    },
    session: {
        secret: process.env.SESSION_SECRET || 'aldsfncxvxocugsdfgnssdflkjh'
    }
}