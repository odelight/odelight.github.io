import { TestPathing } from "./testPathing.js";
import { TestHeap } from "./TestHeap.js";
import { TestCombo } from "./TestCombo.js";
runTests();
function runTests() {
    var testsPassed = "";
    try {
        testsPassed += TestHeap.testHeap();
        testsPassed += TestPathing.testPathing();
        testsPassed += TestCombo.testCombo();
    }
    catch (err) {
        alert(err);
        throw (err);
    }
    alert("Tests passed: " + testsPassed);
}
