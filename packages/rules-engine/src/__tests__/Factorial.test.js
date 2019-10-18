import { factorial } from '@totalsoft/rules-engine'

describe("factorial tests", () => {
    it("should calculate factorial value", () => {
        expect(factorial(5)).toBe(120);
    })
})