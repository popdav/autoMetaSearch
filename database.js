let mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'carDB';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true })
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
      
  }
}

module.exports = new Database()