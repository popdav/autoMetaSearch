class CookieHandler {

    constructor() {
        this.searchInfo = new Map();
    }
    updateInformation(tags) {
        for(let tag of tags) {
            let v = this.searchInfo.get(tag);
            if(v === undefined) {
                this.searchInfo.set(tag, 1);
            }
            else {
                this.searchInfo.set(tag, v + 1);
            }
        }
    }
    getMostSearched() {
        let arr = [];
        Array.from(this.searchInfo).map( ([key, value]) => arr.push({key, value}));
        arr.sort((a, b) => (a.value > b.value) ? -1 : 1);

        let keys = [];
        for(const elem of arr) {
            keys.push(elem.key)
        }
        if(keys.length < 3) {
            return keys;
        }
        else {
            return keys.slice(0, 3);
        }
    }
}
module.exports = CookieHandler;