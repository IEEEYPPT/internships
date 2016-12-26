const Moment = require('moment');

module.exports = function (timestamp){
    return Moment(new Date(timestamp)).format('DD-MM-YY');
}

