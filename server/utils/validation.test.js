const {isRealString} = require('./validation');
const expect = require('expect');


describe('should return true or false on passing string',() => {

    it('should return true',() => {
        const result = isRealString("testing");
        expect(result).toBe(true);
    });

    it('should return false',() => {
        const result = isRealString(100);
        expect(result).toBe(false);
    });

    it('should return false',() => {
        const result = isRealString("    ");
        expect(result).toBe(false);
    });
})

