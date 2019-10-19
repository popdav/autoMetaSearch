let mongoose = require('mongoose')

let SearchSchema = new mongoose.Schema({
    'address' : String,
    'searches' : Array,
    'tags' : Array,
});

module.exports = mongoose.model('SearchAnalytics', SearchSchema)