let mongoose = require('mongoose');

let cookieUserSchema = new mongoose.Schema({
    cookieID: String,
    searches: Array,
    smartSearches: Array,
});

module.exports = mongoose.model('CookieUser', cookieUserSchema);