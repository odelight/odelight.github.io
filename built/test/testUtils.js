export class TestUtils {
    static assertEquals(a, b) {
        if (a != b) {
            throw ("Expected to be equal, but weren't: " + a + ", " + b);
        }
    }
    static assertTrue(a) {
        if (!a) {
            throw ("Expected true, was false");
        }
    }
    static assertNotNull(a) {
        if (a == null) {
            throw ("Expected not null");
        }
    }
}
