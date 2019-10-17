const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Mongo = require('mongodb')
const MongoService = require('./services/dbServices/mongo-select-service')

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
const mongoService = new MongoService();


app.post('/smartSearch', async (req, res) => {

    const body = req.body.tags;
    console.log(body);

    let result = await mongoService.smartSearch(object, req.body.chunkNumber);
    res.send(result);

});

app.post('/findPolovni', async (req, res) => {
    let body = req.body.findQuery;
    console.log(req.body);

    let result = await mongoService.select(body, req.body.chunkNumber);

    res.send(result);

    // let arr1 = []
    // let arr2 = []
    // let promiseArr = []
    // promiseArr.push(new Promise((resolve, reject) => {
    //     polovniModel
    //     .find(body)
    //     .skip(20 * (req.body.chunkNumber-1))
    //     .limit(20)
    //     .then(doc => {
    //         arr1 = doc
    //         resolve()
    //     })
    //     .catch(err => {
    //         console.error(err)
    //         throw err
    //     })
    // })
    // )
    //
    // promiseArr.push(new Promise((resolve, reject) => {
    //     mojModel
    //     .find(body)
    //     .skip(20 * (req.body.chunkNumber-1))
    //     .limit(20)
    //     .then(doc => {
    //         arr2 = doc
    //         resolve()
    //     })
    //     .catch(err => {
    //         console.error(err)
    //         throw err
    //     })
    // })
    // )
    //
    // Promise.all(promiseArr)
    // .then(() => {
    //     let mergedArr = []
    //
    //     let first_out = 0
    //     let second_out = 0
    //
    //     let order = Math.random() > 0.5 ? 1 : 0
    //
    //     while(first_out < arr1.length || second_out < arr2.length) {
    //
    //         let rand = Math.floor(Math.random() * 3) + 1;
    //
    //         if(order === 0) {
    //             if(first_out + rand < arr1.length) {
    //                 mergedArr = mergedArr.concat(arr1.slice(first_out, first_out + rand))
    //                 first_out = first_out + rand
    //             }
    //             else {
    //                 mergedArr = mergedArr.concat(arr1.slice(first_out, arr1.length))
    //                 mergedArr = mergedArr.concat(arr2.slice(second_out, arr2.length))
    //                 break
    //             }
    //         }
    //         else {
    //             if(second_out + rand < arr2.length) {
    //                 mergedArr = mergedArr.concat(arr2.slice(second_out, second_out + rand))
    //                 second_out = second_out + rand
    //             }
    //             else {
    //                 mergedArr = mergedArr.concat(arr2.slice(second_out, arr2.length))
    //                 mergedArr = mergedArr.concat(arr1.slice(first_out, arr1.length))
    //                 break
    //             }
    //         }
    //
    //         order = (order + 1) % 2
    //     }
    //
    //     res.send(mergedArr)
    //
    // })

});

app.post('/markUnique', (req, res) => {
    let promiseArr = []
    let data = []
    promiseArr.push(
        new Promise((resolve, reject) => {
            polovniModel
            .find()
            .distinct('Marka', (error, marks) => {
                if(error) throw error

                data = [...data, ...marks]
                resolve()
            })
        })
    );

    promiseArr.push(
        new Promise((resolve, reject) => {
            mojModel
            .find()
            .distinct('Marka', (error, marks) => {
                if(error) throw error

                data = [...data, ...marks]
                resolve()
            })
        })
    );
    
    Promise.all(promiseArr)
    .then(() => {
        data = [...new Set(data)]
        data.sort()
        res.send(data)
    })
   
})

app.post('/modelUnique', (req, res) => {
    let promiseArr = []
    let data = []
    promiseArr.push(
        new Promise((resolve, reject) => {
            polovniModel
            .find({Marka : req.body.model})
            .distinct('Model', (error, models) => {
                if(error) throw error

                data = [...data, ...models]
                resolve()
            });
        })
    )

    promiseArr.push(
        new Promise((resolve, reject) => {
            mojModel
            .find({Marka : req.body.model})
            .distinct('Model', (error, models) => {
                if(error) throw error

                data = [...data, ...models]
                resolve()
            });
        })
    )
    
    Promise.all(promiseArr)
    .then(() => {
        data = [...new Set(data)]
        data.sort()
        res.send(data)
    })
})



const server = app.listen(port, () => console.log(`Listening on port ${port}`))

