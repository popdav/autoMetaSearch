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

        await Promise.all(this.models.map(async (dbModel) => {
            const tmpRes = await dbModel
                .find()
                .distinct('Marka');
            // console.log(tmpRes)
            result = result.concat(tmpRes);
        }));

        let resultSet = new Set(result)
        return [...resultSet];
    }


    async modelUnique(model) {
        let result = [];

        await Promise.all(this.models.map(async (dbModel) => {
            const tmpRes = await dbModel
                .find({'Marka': model})
                .distinct('Model');
            // console.log(tmpRes)
            result = result.concat(tmpRes);
        }));

        let resultSet = new Set(result)
        return [...resultSet];
    }
}

module.exports = DbUniqueContent;