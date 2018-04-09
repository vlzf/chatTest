var MongoClient = require('mongodb').MongoClient;




//插入数据   
// 返回结果
// 成功
// {
//     result: {ok: 1, n: number},
//     ops: [
//         { 插入的数据 },
//         { 插入的数据 }
//     ],
//     insertedCount: number,
//     insertedIds: [ 字符串 ]
// }
function mdbAdd({
    url = 'localhost:27017', //服务器
    connect = 'myData',      //数据区
    site = 'mySite',         //表格名
    add = [],                //数据
    callback = ()=>{}        //回调函数
}){  
    var insertData = function(db, callback) {  
        db.db(connect).collection(site).insert(add, function(err, result) { 
            if(err){
                throw err;
            }
            db.close();     
            return callback(result);
        });
    }
    
    MongoClient.connect('mongodb://'+ url +'/', function(err, db) {
        if(err){
            throw err;
        }
        console.log("连接成功！");
        return insertData(db, callback);
    });
};








//查数据    
// 返回数据
// 成功
// []
function mdbSelect({
    url = 'localhost:27017', //服务器
    connect = 'myData',      //数据区
    site = 'mySite',         //表格名
    sel = {},                //查询数据
    callback = ()=>{}        //回调函数
}){
    var selectData = function(db, callback) {  
        db.db(connect).collection(site).find(sel).toArray(function(err, result) {
            if(err){
                throw err;
            }
            db.close();   
            return callback(result);
        });
    };
    
    MongoClient.connect('mongodb://'+ url +'/', function(err, db) {
        if(err){
            throw err;
        }
        console.log("连接成功！");
        return selectData(db, callback);
    });    
};




// 更新数据
// 返回数据过于复杂
// 不用管
function mdbUpdate({
    url = 'localhost:27017', //服务器
    connect = 'myData',      //数据区
    site = 'mySite',         //表格名
    sel = {},                //查询数据
    upd = {},                //更新数据
    dealAll = false,  //更新数量
    callback = ()=>{}        //回调函数
}){
    var updateData = function(db, callback) {
        db.db(connect).collection(site)[dealAll?'updateMany':'update'](sel, upd, function(err, result) {
            if(err){
                throw err;
            } 
            db.close();    
            return callback(result);
        });
    }
    
    MongoClient.connect('mongodb://'+ url +'/', function(err, db) {
        if(err){
            throw err;
        }
        console.log("连接成功！");
        return updateData(db, callback);
    });
}



//删除数据
function mdbDelete({
    url = 'localhost:27017', //服务器
    connect = 'myData',      //数据区
    site = 'mySite',         //表格名
    del = {},                //删除数据
    dealAll = false,         //处理数量
    callback = ()=>{}        //回调函数
}){
    var delData = function(db, callback) {  
        db.db(connect).collection(site)[dealAll?'deleteMany':'deleteOne'](del, function(err, result) {
            if(err){
                throw err;
            } 
            db.close();    
            return callback(result);
        });
    }
 
    MongoClient.connect('mongodb://'+ url +'/', function(err, db) {
        if(err){
            throw err;
        }
        console.log("连接成功！");
        return delData(db, callback);
    });
}



// 连续操作
function chain({
    url = 'localhost:27017',
    chain = [
        {
            connect: 'myData',
            site: 'mySite',
            type: 'add | sel | upd | del',
            add: [],
            sel: {},
            upd: {},
            del: {},
            dealAll: false,
            next:  (result, array, i)=>{}
        },
    ],
}){
    if(!(chain instanceof Array)) {
        console.log("param: chain is not a array");
        return;
    }

    MongoClient.connect('mongodb://'+ url +'/', function(err, db) {
        if(err)  throw err;
        console.log("连接成功！");
        return deal(db, chain, 0);
    });
}


function deal(db, chain, i = 0, result = ''){
    if(!(chain instanceof Array)) {
        console.log('chain is changed with a not array');
        return db.close();
    }
    if(i >= chain.length) return db.close();
    switch(chain[i].type){
        case 'add': return _add(db, chain, i);
        case 'sel': return _sel(db, chain, i);
        case 'upd': return _upd(db, chain, i);
        case 'del': return _del(db, chain, i);
        default: console.log(i + '：错误条件'); return db.close();
    }
}

function _add(db, chain, i){
    var {connect, site, add, next} = chain[i];
    db.db(connect).collection(site).insert(add,function(err, result){
        if(err) throw err;
        return deal(db, next(result, chain, i) || chain, i+1);
    });
}

function _sel(db, chain, i){
    var {connect, site, sel, next} = chain[i];
    db.db(connect).collection(site).find(sel).toArray(function(err, result){
        if(err) throw err;
        return deal(db, next(result, chain, i) || chain, i+1);
    });
}

function _upd(db, chain, i){
    var {connect, site, sel, upd, dealAll, next} = chain[i];
    db.db(connect).collection(site)[dealAll?'updateMany':'updateOne'](sel, upd, function(err, result){
        if(err) throw err;
        return deal(db, next(result, chain, i) || chain, i+1);
    });
}

function _del(db, chain, i){
    var {connect, site, sel, upd, dealAll, next} = chain[i];
    db.db(connect).collection(site)[dealAll?'deleteMany':'deleteOne'](sel, upd, function(err, result){
        if(err) throw err;
        return deal(db, next(result, chain, i) || chain, i+1);
    });
}






module.exports = {
    add : mdbAdd,
    sel : mdbSelect,
    upd : mdbUpdate,
    del : mdbDelete,
    chain: chain,
};
    














