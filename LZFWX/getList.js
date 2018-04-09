var express = require('express');
var router = express.Router();
var logined = require('../lib/check-account').ifLogined;
var mdb = require('../lib/method-MDB');

//获取好友信息
//请求体
// 无
// 成功
// {
//     result: 'success',
//     list:[
//         {
//             "id":"2db72f3e46",//字符串，用户的id，类似于QQ号
//             "nickname":'asdasd'//用户名称
//         },
//         {
//             "id":"asdjelncke",//字符串，用户的id，类似于QQ号
//             "nickname":"asdasd"//用户名称
//         }
//     ]
// }
// 失败
// {
//     result: "failed"
// }
router.get('/',logined,function(req,res){
    var sel = ()=>{
        mdb.sel({
            connect: 'WeChat',
            site: 'users',
            sel: {
                id: req.session.user.userId
            },
            callback: (result)=>{
                console.log(result);
                return get(result);
            }
        });
    }

    var get = (list = [])=>{
        var a = [];
        list.forEach((e,i)=>{
            a.push({
                userId: e,
            })
        });
        mdb.sel({
            connect: 'WeChat',
            site: 'users',
            sel: {
                $or: a,
            },
            callback: (result)=>{
                var a = [];
                result.forEach((e,i)=>{
                    a.push({
                        userId: e.userId,
                        nickName: e.nickName,
                        userPhoto: e.userPhoto,
                    })
                });
                res.json({
                    result: 'success',
                    messages: a,
                })
            }
        })
    }
    
    sel();

});

module.exports = router;