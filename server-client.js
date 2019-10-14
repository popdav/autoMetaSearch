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

const DB = require('./database')
const polovniModel = require('./models/PolovniAutomobili')
const mojModel = require('./models/MojAuto')


app.post('/merge', (req, res) => {

    let arr1 = [1, 1, 1, 1, 1, 1, 1, 1, 1]
    let arr2 = [2, 2, 2, 2, 2, 2, 2, 2]

    let mergedArr = []

    let first_out = 0
    let second_out = 0

    let order = 0

    while(first_out < arr1.length || second_out < arr2.length) {

        let rand = Math.floor(Math.random() * 3) + 1;

        if(order === 0) {
            if(first_out + rand < arr1.length) {
                mergedArr = mergedArr.concat(arr1.slice(first_out, first_out + rand))
                first_out = first_out + rand
            }
            else {
                mergedArr = mergedArr.concat(arr1.slice(first_out, arr1.length))
                mergedArr = mergedArr.concat(arr2.slice(second_out, arr2.length))
                break
            }
        }
        else {
            if(second_out + rand < arr2.length) {
                mergedArr = mergedArr.concat(arr2.slice(second_out, second_out + rand))
                second_out = second_out + rand
            }
            else {
                mergedArr = mergedArr.concat(arr2.slice(second_out, arr2.length))
                mergedArr = mergedArr.concat(arr1.slice(first_out, arr1.length))
                break
            }
        }

        order = (order + 1) % 2
    }

    res.send(mergedArr)
});

app.post('/findPolovni', (req, res) => {
    let body = req.body.findQuery
    console.log(req.body)
    let data = []
    polovniModel
    .find(body)
    .skip(100 * (req.body.chunkNumber-1))
    .limit(100)
    .then(doc => {
        console.log(doc)
        data = [...data, ...doc]
    })
    .then(() => {
        mojModel
        .find(body)
        .skip(100 * (req.body.chunkNumber-1))
        .limit(100)
        .then(doc => {
            console.log(doc)
            data = [...data, ...doc]
            res.send(data)
        })

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

