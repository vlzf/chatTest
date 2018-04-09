var mdb = require('./lib/method-MDB');

//添加
mdb.add({
    connect: '',    //连接数据库名字
    site: '',       //连哪个表
    add: {},        //添加的数据
    callback: (result)=>{}//result是结果，失败则不会执行 callback
})

//查询
mdb.sel({
    connect: '',
    site: '',
    sel: {},       //选择的数据
    callback: (result)=>{}
})

//删除
mdb.del({
    connect: '',
    site: '',
    del: {},       //删除的数据
    callback: (result)=>{}
})

//更新
mdb.upd({
    connect: '',
    site: '',
    sel: {},      //需要更新的数据
    upd: {},      //新内容
    callback: (result)=>{}
})