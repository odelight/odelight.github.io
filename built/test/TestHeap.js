import { Heap } from "../src/Heap.js";
import { TestUtils } from "./testUtils.js";
export class TestHeap {
    static testHeap() {
        var heap = new Heap((a, b) => a - b);
        heap.push(3);
        heap.push(1);
        heap.push(2);
        heap.push(5);
        heap.push(4);
        TestUtils.assertEquals(false, heap.empty());
        TestUtils.assertEquals(1, heap.pop());
        TestUtils.assertEquals(false, heap.empty());
        TestUtils.assertEquals(2, heap.pop());
        TestUtils.assertEquals(false, heap.empty());
        TestUtils.assertEquals(3, heap.pop());
        TestUtils.assertEquals(false, heap.empty());
        TestUtils.assertEquals(4, heap.pop());
        TestUtils.assertEquals(false, heap.empty());
        TestUtils.assertEquals(5, heap.pop());
        TestUtils.assertEquals(true, heap.empty());
        return "Heap tests passed!";
    }
}
