const DB = require('../../database')
const polovniModel = require('../../models/PolovniAutomobili')
const mojModel = require('../../models/MojAuto')
const Mongo = require('mongodb')

class DbUniqueContent {

    constructor() {
        this.models = [polovniModel, mojModel];
    }

    async makeUniqe() {
        let result = [];
        try {
            for(let dbModel of this.models) {
                let tmpResult = await dbModel
                    .find()
                    .distinct('Marka');
                result = result.concat(tmpResult);
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        let resultSet = new Set(result)
        return [...resultSet];
    }


    async modelUnique(model) {
        let result = [];

        try {
            for(let dbModel of this.models) {
                let tmpResult = await dbModel
                    .find({'Marka': model})
                    .distinct('Model');

                result = result.concat(tmpResult);
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }

        let resultSet = new Set(result)
        return [...resultSet];
    }
}

module.exports = DbUniqueContent;