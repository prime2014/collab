const foo = require("./Users")
jest.mock("./Users")


test("mocks implementation details", ()=> {
    foo.mockImplementation(()=> 42);
    // foo();
    expect(foo()).toBe(42)
})

