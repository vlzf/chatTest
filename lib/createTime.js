var sd = require('silly-datetime');

var cT = ()=>{
    return sd.format(new Date(), 'YYYY-MM-DD HH:mm');
}

module.exports = {
    createCurrentTime: cT
}