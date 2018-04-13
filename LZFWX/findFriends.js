var ifLogined =  require('../lib/check-account').ifLogined;
var mdb = require('../lib/method-MDB');


var express = require('express');
var router = express.Router();


/* 
请求
{
    account: '',
}
成功
{
    result: 'success',
    messages: [
        {
            account: '',
            id: ''
        },
    ]
}
失败
{
    result: 'failed',
    messages: "找不到该联系人"
}

*/
router.get('/', ifLogined, function(req,res){
    var {account} = req.query;

    var dealArray = (a=[])=>{
        var a2 = [];
        a.forEach((e,i)=>{
            a2.push({
                account: e.account,
                userId: e.userId,
                nickName: e.nickName,
                sex: e.sex,
                userPhoto: e.userPhoto,
            })
        });
        return a2;
    }

    var findPerson = ()=>{
        mdb.sel({
            connect: 'WeChat',
            site: 'users',
            sel: {
                account: account
            },
            callback: (result=[])=>{
                // res.status(200);
                console.log(result);
                if(result.length){
                    res.json({
                        result: 'success',
                        message: dealArray(result),
                    })
                }else{
                    res.json({
                        result: 'failed',
                        message: 'Not Found'
                    })
                }
            }
        });
    }
    

    if((account+'').replace(/ /g,'')){
        findPerson();
    }else{
        res.json({
            result: 'failed',
            message: '未输入联系人',
        });
    }
})


module.exports = router
