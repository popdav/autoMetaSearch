const polovniModel = require('../../models/PolovniAutomobili');
const mojModel = require('../../models/MojAuto');

class MongoService {

    constructor() {
        this.smartSearchMap = new Map();
        this.smartSearchMap.set('sportski', [{'Marka' : 'Audi', 'Model' : 'A4'}, {'Marka' : 'Fiat', 'Model' : 'Punto'}]);
        this.smartSearchMap.set('biznis', [{'Marka' : 'Audi', 'Model' : 'A6'}, {'Marka' : 'Fiat', 'Model' : 'Bravo'}]);
        this.smartSearchMap.set("gradski", [{"Kubikaža": [1000,1800]} , {"Karoserija" : ["Hečbek", "Limuzina"]}]);
        this.smartSearchMap.set("porodicni", [{"Kubikaža": [1600,3000]}, {"Broj sedišta" : "5 sedišta"} , {"Karoserija" : ["Monovolumen (MiniVan)","Karavan", "Limuzina","Džip/SUV"]}]);
        this.smartSearchMap.set("studentski", [{"Kubikaža": [1000,1800]},  {"Karoserija" : ["Hečbek", "Limuzina"]}]);
    }

    mergeArrays(arr1, arr2) {
        let mergedArr = []

        let first_out = 0
        let second_out = 0

        let order = Math.random() > 0.5 ? 1 : 0

        while(first_out < arr1.length || second_out < arr2.length) {

            let rand = Math.floor(Math.random() * 3) + 1;

            if(order === 0) {
                if(first_out + rand < arr1.length) {
                    mergedArr = mergedArr.concat(arr1.slice(first_out, first_out + rand));
                    first_out = first_out + rand
                }
                else {
                    mergedArr = mergedArr.concat(arr1.slice(first_out, arr1.length));
                    mergedArr = mergedArr.concat(arr2.slice(second_out, arr2.length));
                    break
                }
            }
            else {
                if(second_out + rand < arr2.length) {
                    mergedArr = mergedArr.concat(arr2.slice(second_out, second_out + rand));
                    second_out = second_out + rand
                }
                else {
                    mergedArr = mergedArr.concat(arr2.slice(second_out, arr2.length));
                    mergedArr = mergedArr.concat(arr1.slice(first_out, arr1.length));
                    break
                }
            }

            order = (order + 1) % 2
        }

        return mergedArr;
    }

    async smartSearch(tags, chunkNumber) {

        let result = [];
        let queryObjects = [];
        let queryData = [];

        tags.forEach((tag) => {
            queryData.push(this.smartSearchMap.get(tag));
        });

        console.log(queryData)

        for(let data of queryData) {
            queryObjects = queryObjects.concat(data);
        }

        for(let queryObject of queryObjects) {
            let tmpRes = await this.select(queryObject, chunkNumber);
            result = result.concat(tmpRes);
        }
        return result;
    }

    async select(object, chunkNumber) {

        const [polovnArr, mojArr ] = [await this.selectPolovni(object, chunkNumber), await this.selectMoj(object, chunkNumber)];
        return  this.mergeArrays(polovnArr, mojArr);
    }

    async selectPolovni(object, chunkNumber) {
        let result = [];
        try {
            result = await polovniModel
                            .find(object)
                            .skip(20 * (chunkNumber-1))
                            .limit(20)
        }
        catch (err) {
            console.log(err);
            throw err;
        }

        return result;
    }

    async selectMoj(object, chunkNumber) {
        let result = [];
        try {
            result = await mojModel
                .find(object)
                .skip(20 * (chunkNumber-1))
                .limit(20)
        }
        catch (err) {
            console.log(err);
            throw err;
        }

        return result;
    }
}

module.exports = MongoService;