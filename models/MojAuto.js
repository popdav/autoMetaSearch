let mongoose = require('mongoose')

let mojSchema = new mongoose.Schema({
    "cena": Number,
    "slika": String,
    "Vozilo:":String,
    "Marka": String,
    "Model": String,
    "Godište": Number,
    "Kilometraža": Number,
    "Karoserija": String,
    "Gorivo": String,
    "Kubikaža": Number,
    "Snaga motora": Number,
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
mojSchema.index({link: 1})

module.exports = mongoose.model('MojAuto', mojSchema)