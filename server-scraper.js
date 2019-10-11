const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Mongo = require('mongodb')

const app = express()

const port = process.env.PORT || 5001

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use(bodyParser.json({ limit: '100gb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '100gb', extended: true }))
app.use(methodOverride())

let DB = require('./database')
let polovniModel = require('./models/PolovniAutomobili')

const PolovniScrap = require('./scrapers/PolovniScrap')
const urlPolovni = 'https://www.polovniautomobili.com/auto-oglasi/pretraga?page=1&sort=basic&brand=bmw&city_distance=0&showOldNew=all&without_price=1'
//'https://www.polovniautomobili.com/auto-oglasi/pretraga?page=1&sort=basic&brand=audi&city_distance=0&showOldNew=all&without_price=1'
//'https://www.polovniautomobili.com/auto-oglasi/pretraga?brand=bmw&price_to=&year_from=&year_to=&showOldNew=all&submit_1=&without_price=1'
let instancaPolovniScrap = new PolovniScrap(urlPolovni)
instancaPolovniScrap.scrapeLoop()

const urlMoj = 'https://www.mojauto.rs/rezultat/status/automobili/vozilo_je/polovan/poredjaj-po/oglas_najnoviji/po_stranici/20/prikazi_kao/lista/'
const MojScrap = require('./scrapers/MojAutoScrap')
let instanceMojScrap = new MojScrap(urlMoj)
// instanceMojScrap.scrapeLoop()


const server = app.listen(port, () => console.log(`Listening on port ${port}`))

