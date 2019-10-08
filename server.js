const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Mongo = require('mongodb')

const app = express()

const port = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use(bodyParser.json({ limit: '100gb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '100gb', extended: true }))
app.use(methodOverride())

let DB = require('./database')
let polovniModel = require('./models/PolovniAutomobili')

const PolovniScrap = require('./scrapers/PolovniScrap')
const url = 'https://www.polovniautomobili.com/auto-oglasi/pretraga?page=1&sort=basic&brand=bmw&city_distance=0&showOldNew=all&without_price=1'
//'https://www.polovniautomobili.com/auto-oglasi/pretraga?page=1&sort=basic&brand=audi&city_distance=0&showOldNew=all&without_price=1'
//'https://www.polovniautomobili.com/auto-oglasi/pretraga?brand=bmw&price_to=&year_from=&year_to=&showOldNew=all&submit_1=&without_price=1'
let instancaPolovniScrap = new PolovniScrap(url)
instancaPolovniScrap.scrapeLoop()


app.post('/findPolovni', (req, res) => {
    let body = req.body.findQuery
    console.log(req.body)
    polovniModel
    .find(body)
    .skip(100 * (req.body.chunkNumber-1))
    .limit(100)
    .then(doc => {
        res.send(doc)
    })
    .catch(err => {
        console.error(err)
        throw err
    })
})

app.post('/markUnique', (req, res) => {
    polovniModel
    .find()
    .distinct('Marka', (error, marks) => {
        res.send(marks)
    });
})

app.post('/modelUniqueAudi', (req, res) => {
    polovniModel
    .find({Marka : 'Audi'})
    .distinct('Model', (error, models) => {
        res.send(models)
    });
})

app.post('/modelUniqueBMW', (req, res) => {
    polovniModel
    .find({Marka : 'BMW'})
    .distinct('Model', (error, models) => {
        res.send(models)
    });
})


const server = app.listen(port, () => console.log(`Listening on port ${port}`))

