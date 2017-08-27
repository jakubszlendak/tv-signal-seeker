const mongodb = require('mongodb')
const argv = require('minimist')(process.argv)
const fs = require('fs')
const config = require('../config')

if (!argv.source) throw new Error('no source file given')


let DB = null
mongodb.connect(config.MongoURI)
    .then((db) => {
        DB = db
        if(argv.f) {
            console.log('Removing all documents...')
            return DB.collection('antennas').remove({})
        } else return Promise.resolve()
    })
    .then(() => {
        return new Promise((resolve, reject) => {
            console.log('Processing data...')
            fs.readFile(argv.source, 'utf8', (err, content) => {
                if (err) return reject(err)
                let entries = content.split('^')
                    .map(line => line.split('|'))
                    .filter(line => line.length === 365)
                    .map(line => {
                        let item =  {
                            id: +line[0],
                            service: line[1],
                            description: line[2],
                            station: {
                                type: "Point",
                                coordinates: line[3].split(',').map(x => +x).reverse()
                            },
                            coverage: {
                                type: 'Polygon',
                                coordinates: []
                            }
                        }

                        item.coverage.coordinates = line
                                    .slice(4)
                                    .map(
                                        coord => coord
                                        .split(',')
                                        .map(x => +x)
                                        .reverse()
                                    )
                                    .filter(x => x.length === 2)
                                    // a hack to deal with duplicate coords
                                    .map((x, i) => {
                                        /* Here we change contour a bit to make MongoDB geospatial indexing possible. 
                                         * Because Mongo doesnt allow duplicate vertices in contour, we enlarge contour a bit to avoid duplicate vertices.
                                         * Max error introduced with this operation is about 100 meters in equator which is acceptable in this use case.
                                         * */
                                            let xOffset = 0.0008*Math.sin((i/180)*Math.PI)
                                            let yOffset = 0.0008*Math.cos((i/180)*Math.PI)
                                            x[0]+=xOffset
                                            x[1]+=yOffset
                                        // }
                                        return x
                                    })
                                    .reverse()
                        item.coverage.coordinates.push(item.coverage.coordinates[0])
                        item.coverage.coordinates = [item.coverage.coordinates]
                        return item
                    })

                return resolve(entries)

            })
        })

    })
    .then((entries) => {
        console.log('Inserting to DB...')
        return DB.collection('antennas').insert(entries)
    })
    .then(()=>{
        console.log('Building index...')
        return DB.collection('antennas').createIndex({coverage:'2dsphere'})
    })


    .then(() => {
        DB.close()
    })
    .catch((e) => {
        console.error(e)
        DB && DB.close()
    })

    