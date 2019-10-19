const SearchAnalytics = require('../../models/SearchAnalytics');

class SearchAnalyticsService {

    constructor() {
        this.smartSearchMap = new Map();
        this.smartSearchMap.set('sportski', [{'Marka' : 'Audi', 'Model' : 'A4'}, {'Marka' : 'Fiat', 'Model' : 'Punto'}]);
        this.smartSearchMap.set('biznis', [{'Marka' : 'Audi', 'Model' : 'A6'}, {'Marka' : 'Fiat', 'Model' : 'Bravo'}]);
    }

    async selectUsersStatus(clientAddress) {
        return await SearchAnalytics.find({ address : clientAddress }, {tags : 1, _id : 0});
    }

    // async updateUserStatus(clientAddress, tag) {
    //     let user = await SearchAnalytics.countDocuments({address : clientAddress});
    //     if(user === 0) {
    //         let newUser = new
    //     }
    //     else {
    //
    //     }
    // }
}

module.exports = SearchAnalyticsService;