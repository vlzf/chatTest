var cRI = (params = '')=>{
    var str = (Math.random()+new Date()+'').replace(/[^0-9]/g,'')+params;
    return str;
}

module.exports = {
    createRandomInt: cRI
}