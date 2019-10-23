class CookieHandler {

    constructor() {

    }
    updateInformation(tags, previousState) {

        let arr = [];
        previousState.map((tag) => {
            let kv = tag.split(':');
            if(kv.length > 0)
                arr.push({key : kv[0], value : parseInt(kv[1])})
        });

        const map = new Map();
        for(let o of arr) {
            map.set(o.key, o.value)
        }

        for(const tag of tags) {
            let v = map.get(tag);
            if(v === undefined) {
                map.set(tag, 1);
            }
            else {
                map.set(tag, v+1);
            }
        }
        arr = [];
        for (const [key, val] of map.entries()) {
            arr.push(key + ':' + val);
        }

        return arr;
    }
    getMostSearched(status) {
        let arr = [];
        status.map((tag) => {
            let kv = tag.split(':');
            if(kv.length > 0)
                arr.push({key : kv[0], value : kv[1]})
        });
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