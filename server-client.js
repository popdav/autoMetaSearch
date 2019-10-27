const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const MongoService = require('./services/dbServices/mongo-select-service')
const DbUniqueContent = require('./services/dbServices/db-unique-content-service')
const cookieParser = require('cookie-parser');
const CHandler = require('./services/userService/cookie-handler-service');
const CookieService = require('./services/userService/cookie-service');

const app = express();

const port = process.env.PORT || 5001;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '100gb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100gb', extended: true }));
app.use(methodOverride());
app.use(cookieParser());

const mongoService = new MongoService();
const dbUniqueContent = new DbUniqueContent();
const CookieHandler = new CHandler();
const cookieService = new CookieService();

app.get('/getCarsForMe', async (req, res) => {
    let user = req.cookies['user'];
    if (user) {
        const arr = await cookieService.getUserCars(user);
        res.send(arr);
    }
    else {
        console.log('trazi nesto');
    }
});

app.post('/smartSearch', async (req, res) => {
    let result = await mongoService.smartSearch(req.body.tags, req.body.chunkNumber);
    res.send(result);
});

app.post('/findPolovni', async (req, res) => {
    const userId = await CookieHandler.handle(req);
    let result = await mongoService.select(req.body.findQuery, req.body.chunkNumber);
    res.cookie('user', userId, {maxAge: 360000});
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

