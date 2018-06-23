export class PointMap {
    constructor() {
        this.innerMap = new Map();
    }
    put(key, value) {
        this.innerMap.set(key.hash(), value);
    }
    get(key) {
        var value = this.innerMap.get(key.hash());
        if (value == null) {
            throw "Attempted to get value not in map";
        }
        return value;
    }
    has(key) {
        return this.innerMap.has(key.hash());
    }
}
