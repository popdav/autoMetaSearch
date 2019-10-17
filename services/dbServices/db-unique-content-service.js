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

                result.concat(tmpResult);
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }

        return new Set(result);
    }
    async modelUnique(model) {
        let result = [];

        try {
            for(let dbModel of this.models) {
                let tmpResult = await dbModel
                    .find({Model: model})
                    .distinct('Model');

                result.concat(tmpResult);
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }

        return new Set(result);
    }
}

module.exports = DbUniqueContent;