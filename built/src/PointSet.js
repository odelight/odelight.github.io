export class PointSet {
    constructor() {
        this.innerSet = new Set();
    }
    add(point) {
        this.innerSet.add(point.hash());
    }
    has(point) {
        return this.innerSet.has(point.hash());
    }
}
