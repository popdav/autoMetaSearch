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
let mojModel = require('./models/MojAuto')

const PolovniScrap = require('./scrapers/PolovniScrap')
const url = 'https://www.polovniautomobili.com/auto-oglasi/pretraga?page=1&sort=basic&brand=audi&city_distance=0&showOldNew=all&without_price=1'
let instancaPolovniScrap = new PolovniScrap(url)
instancaPolovniScrap.scrapeLoop()


app.post('/findPolovni', (req, res) => {
    polovniModel
    .find()
    .then(doc => {
        res.send(doc)
    })
    .catch(err => {
        console.error(err)
        throw err
    })
})

const server = app.listen(port, () => console.log(`Listening on port ${port}`))

