#Setup
## Data import 
Use script `tools/import-data.js`
```
 $ node tools/import-data.js --source [path to data file] -f

```

The script will read and parse the file, then insert to MongoDB collection 'antennas' and ensure geospatial index on fields.
Option `-f` will flush all documents from collection. This script is made for offline use so you have to be patient until it finishes ;)

## Server setup
Basically install deps with `npm i`. 