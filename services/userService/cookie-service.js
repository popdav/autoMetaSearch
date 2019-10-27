const cookieUserModel = require('../../models/userModels/cookie-user-model');
const mongoSelectService = require('../dbServices/mongo-select-service');

class CookieService {
    constructor(){
        this.mongoService = new mongoSelectService();
    };

    async insertUser(cookieUuid) {
        //Kada user udje prvi put na sajt pokazu se random automobili tako da uvek query bude prazan
        const userObj = { cookieID: cookieUuid, searches: [], smartSearches: []};
        const newUser = new cookieUserModel(userObj);
        await newUser.save();
    }

    async updateUser(user) {
        await cookieUserModel.updateOne({ cookieID: user.cookieID}, user);
    }

    async findUser(cookieId) {
        return cookieUserModel.findOne({ cookieID: cookieId});
    }

    async findUsersSearch(cookieId, searchQuery) {
        return cookieUserModel.findOne(
            { cookieID: cookieId, searches: {$elemMatch: {Model: searchQuery.Model, Marka: searchQuery.Marka }}}
            );
    }

    async findUsersSmartSearch(cookieId, tag) {
        return cookieUserModel.findOne(
            { cookieID: cookieId, smartSearches: [tag]}
            );
    }

    async updateSearch(cookieUuid, searchQuery) {
        if (searchQuery === null || searchQuery === undefined) {
            return;
        }
        let user = await this.findUsersSearch(cookieUuid, searchQuery);
        if (user === null) {
            user = await this.findUser(cookieUuid);
            user.searches.push(searchQuery);
            await this.updateUser(user);
        }
        else {
            console.log('Ovo je vec trazio');
        }
    }

    async updateUserSmart(cookieUuid, tags) {
        if (tags === null || tags === undefined) {
            return;
        }
        let user = this.findUser(cookieUuid);
        let foundTags = [];
        for (let tag of tags) {
            let found = this.findUsersSmartSearch(cookieUuid, tag);
            foundTags.push(found);
        }
        for (let i=0;i<foundTags.length;i++) {
            if (foundTags[i] === null) {
                user.smartSearches.push(tags[i]);
                await this.updateUser(user);
            }
        }
    }

    async getUserCars(cookieUuid) {
        let user = await cookieUserModel.findOne({ cookieID: cookieUuid }, function(err,obj) {});
        console.log(user.searches);
        let num;
        let query = [];
        let arr = [];
        if (user.searches.length < 3) {
            num = user.searches.length;
        }
        else {
            num = 3;
        }
        for (let i=0;i<num;i++) {
            let randSearchQuery = Math.floor(Math.random() * user.searches.length);
            arr.push(... await this.mongoService.select(user.searches[randSearchQuery], 1));
            query.push(user.searches[randSearchQuery]);
        }
        arr.sort(() => Math.random() - 0.5);
        console.log(query);
        return { arr, query };
    }
}


module.exports = CookieService;