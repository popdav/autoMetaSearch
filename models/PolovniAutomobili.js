let mongoose = require('mongoose')

let polovniSchema = new mongoose.Schema({
    "cena": String,
    "slika": String,
    "Vozilo:":String,
    "Marka": String,
    "Model": String,
    "Godište": String,
    "Kilometraža": String,
    "Karoserija": String,
    "Gorivo": String,
    "Kubikaža": String,
    "Snaga motora": String,
    "Fiksna cena": String,
    "Zamena: ": String,
    "Broj oglasa: ": Number,
    "Emisiona klasa motora": String,
    "Pogon": String,
    "Menjač": String,
    "Broj vrata": String,
    "Broj sedišta": String,
    "Strana volana": String,
    "Klima": String,
    "Boja": String,
    "Materijal enterijera": String,
    "Boja enterijera": String,
    "Registrovan do": String,
    "Poreklo vozila": String,
    "Oštećenje": String,
    "Zemlja uvoza": String,
    "safetyAttributes": Array,
    "gearAttributes": Array,
    "link" : String,
    "logo" : String

})

polovniSchema.statics.getCars = function() {
    return new Promise((res, rej) => {
        this.model('PolovniAutomobili').find((err, docs) => {
            if(err){
                console.error(err)
                return rej(err)
            }

            res(docs)
        })
    })
}

polovniSchema.methods.getByBrand = function(cb) {
    // return this.model('PolovniAutomobili').find({brand: this.brand}, cb)
    return new Promise((res, rej) => {
        this.model('PolovniAutomobili').find({brand: this.brand}, (err, docs) => {
            if(err){
                console.error(err)
                return rej(err)
            }

            res(docs)
        })
    })
}

module.exports = mongoose.model('PolovniAutomobili', polovniSchema)