//Min heap
export class Heap {
    constructor(comparisonFunction) {
        this.comparisonFunction = comparisonFunction;
        this.size = 0;
        this.tree = [];
    }
    push(object) {
        var insertIndex = this.size;
        this.size = this.size + 1;
        this.tree[insertIndex] = object;
        while (insertIndex > 0 && this.isSmaller(this.tree[insertIndex], this.tree[this.parentIndex(insertIndex)])) {
            this.swap(insertIndex, this.parentIndex(insertIndex));
            insertIndex = this.parentIndex(insertIndex);
        }
    }
    empty() {
        return this.size == 0;
    }
    pop() {
        var ret = this.tree[0];
        var lastLeaf = this.tree.pop();
        if (lastLeaf == null) {
            throw "Expected non-empty tree!";
        }
        this.tree[0] = lastLeaf;
        this.size = this.size - 1;
        var currentIndex = 0;
        while (!this.isSorted(currentIndex)) {
            var swappingIndex = this.minimum(this.childIndices(currentIndex));
            this.swap(currentIndex, swappingIndex);
            currentIndex = swappingIndex;
        }
        return ret;
    }
    swap(indexA, indexB) {
        var temp = this.tree[indexA];
        this.tree[indexA] = this.tree[indexB];
        this.tree[indexB] = temp;
    }
    minimum(nums) {
        if (nums.length == 0) {
            throw "Can't find minimum of zero length array";
        }
        var ret = nums[0];
        for (var i = 1; i < nums.length; i++) {
            if (this.isSmaller(this.tree[nums[i]], this.tree[ret])) {
                ret = nums[i];
            }
        }
        return ret;
    }
    isSorted(i) {
        var children = this.childIndices(i);
        for (var j = 0; j < children.length; j++) {
            if (this.isSmaller(this.tree[children[j]], this.tree[i])) {
                return false;
            }
        }
        return true;
    }
    isSmaller(a, b) {
        return this.comparisonFunction(a, b) < 0;
    }
    childIndices(i) {
        var ret = [];
        if (2 * i + 2 < this.size) {
            ret[0] = 2 * i + 1;
            ret[1] = 2 * i + 2;
        }
        else if (2 * i + 1 < this.size) {
            ret[0] = 2 * i + 1;
        }
        return ret;
    }
    parentIndex(i) {
        return Math.floor((i - 1) / 2);
    }
}
