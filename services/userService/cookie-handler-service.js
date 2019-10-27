const CookieService = require('../userService/cookie-service');
const uuid = require('uuid/v4');

class CookieHandler {
    constructor(){
        this.cookieService = new CookieService();
    }

    async handle(req) {
        let userId = req.cookies['user'];
        if (userId) {
            await this.cookieService.updateSearch(userId, req.body.findQuery);
        } else {
            userId = uuid();
            await this.cookieService.insertUser(userId);
        }
        return userId;
    }
}

module.exports = CookieHandler;