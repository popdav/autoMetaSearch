const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Mongo = require('mongodb')
const MongoService = require('./services/dbServices/mongo-select-service')
const DbUniqueContent = require('./services/dbServices/db-unique-content-service')

const app = express()

const port = process.env.PORT || 5001

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use(bodyParser.json({ limit: '100gb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '100gb', extended: true }))
app.use(methodOverride())

const DB = require('./database')
const polovniModel = require('./models/PolovniAutomobili')
const mojModel = require('./models/MojAuto')
const mongoService = new MongoService();
const dbUniqueContent = new DbUniqueContent();


app.post('/smartSearch', async (req, res) => {

    //"sportski,biznis"

    // const tags = req.body.tags.split(',');
    console.log(req.body.tags);

    let result = await mongoService.smartSearch(req.body.tags, req.body.chunkNumber);
    res.send(result);

});

app.post('/findPolovni', async (req, res) => {
    console.log(req.body);

    let result = await mongoService.select(req.body.findQuery, req.body.chunkNumber);
    res.send(result);

});

app.post('/makeUnique', async (req, res) => {
    const result = await dbUniqueContent.makeUniqe();
    res.send(result.sort());
});

app.post('/modelUnique', async (req, res) => {
    console.log(req.body.model)
    const result = await dbUniqueContent.modelUnique(req.body.model);
    res.send(result.sort());
});



const server = app.listen(port, () => console.log(`Listening on port ${port}`))

