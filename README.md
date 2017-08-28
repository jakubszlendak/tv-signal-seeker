## Data import 
Use script `tools/import-data.js`
```
 $ node tools/import-data.js --source [path to data file] -f
```

The script will read and parse the file, then insert to MongoDB collection 'antennas' and ensure geospatial index on fields.
Option `-f` will flush all documents from collection. This script is made for offline use so you have to be patient until it finishes ;)

## Server setup
Basically install deps with

```
npm i
```

## Running app
Application needs a MongoDB connection at URI configured with env variable `TV_MONGODB_URI`. Database should have collection `antennas` filled with antenna data using script in `tools/import-data.js`. 

Start app in development mode (port 3000):
```
npm start
```
Application will be launched through nodemon, thus restarting on every file change.

To run on port 80 application needs elevated privileges. It's better to use reverse proxy like nginx and run node app on higher port. 
In production, its convinient to ensure app ressurection on crash with process manager. Process spawn using pm2 can be done with:
```
npm run start.prod
```
To specify server port use environment variable `PORT`.


## Running tests:
To run unit test:
```
npm t
```

To run E2E tests, you need a MongoDB server running at URI described with `TV_TESTING_MONGODB_URI` env variable. Default value is `mongodb://localhost/test`. Be careful, all documents from collection `antennas` in test DB will be removed!
Running tests when DB is up:
```
npm run e2e
```

You can run istanbul coverage with:
```
npm run coverage
```

## App configuration variables

All used variables are listed in `config.js` file. All of them have default values.

* `PORT` - server port. Default is 3000. Using port below 1024 will require running node with elevated privileges, which may create security risk. 
* `NODE_ENV` - node environment, should be `development` for deving, `e2e_testing` when running tests,  `production` in production. When in production, no stack traces on error will leak to user.
* `TV_TESTING_MONGODB_URI` - test DB URI, described in 'Running tests' section. 
* `TV_MONGODB_URI` - main database URI
* `TV_JWT_SECRET` - JWT authentication secret phrase