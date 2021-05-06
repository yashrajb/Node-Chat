var expect = require('expect');
var {generateMessages,generateLocationMessages} = require('./message.js');


describe('should generate message',() => {
    it('should return the messages',() => {
        var from = 'basanyash627@gmail.com';
        var text = 'hello bro hii';
        var result = generateMessages(from,text);
            expect(result).toInclude({
                from,
                text
            });
        expect(result.createdAt).toBeA('number');
    });
    it('should return url with coordinates',() => {
        var from = 'basanyash627@gmail.com';
        var latitude = 22.299680199999997
        var longitude = 73.2315801;
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;

        var result = generateLocationMessages(from,latitude,longitude);

        expect(result.url).toEqual(url);
        expect(result.from).toEqual(from);
        expect(result.createdAt).toBeA('number');


    });
});