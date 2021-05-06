const axios = require('axios');
const moment = require('moment');
var generateMessages = function(from,text){
    return {
        from,
        text,
        createdAt:moment().valueOf()
    }
}

var generateLocationMessages = function(from,latitude,longitude){
    return {
        from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt:moment().valueOf()
    }
}

module.exports = {
    generateMessages,
    generateLocationMessages
}