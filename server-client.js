const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Mongo = require('mongodb')
const MongoService = require('./services/dbServices/mongo-select-service')
const DbUniqueContent = require('./services/dbServices/db-unique-content-service')
const SearchAnalyticsService = require('./services/dbServices/db-search-analytics-service');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');

const app = express()

const port = process.env.PORT || 5001

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use(bodyParser.json({ limit: '100gb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100gb', extended: true }));
app.use(methodOverride());
app.use(cookieParser());

const DB = require('./database')
const polovniModel = require('./models/PolovniAutomobili')
const mojModel = require('./models/MojAuto')
const mongoService = new MongoService();
const dbUniqueContent = new DbUniqueContent();
const searchAnalytics = new SearchAnalyticsService();

app.get('/getCarsForMe', (req, res) => {
    let status = req.cookies['status'];
    if(status) {
        res.send(status);
    }
    else {
        res.send([]);
    }
});

app.post('/smartSearch', async (req, res) => {

    res.cookie('status', req.body.tags);
    let result = await mongoService.smartSearch(req.body.tags, req.body.chunkNumber);
    console.log('Cookie set');
    res.send(result);

});

app.post('/personalizedSearch', async (req, res) => {
    const clientIp = requestIp.getClientIp(req);

    let tags = await searchAnalytics.selectUsersStatus(clientIp);
    let result = await mongoService.smartSearch(tags, req.body.chunkNumber);
    res.send(result);
});

app.post('/findPolovni', async (req, res) => {
    // console.log(req.body);
    const clientIp = requestIp.getClientIp(req);
    console.log('ADRESA JE : ' + clientIp);

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

