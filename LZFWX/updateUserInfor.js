var express = require('express');
var router = express.Router();

var urlencodeParser = require('body-parser').urlencoded({extended:false});
var ifLogined = require('../lib/check-account').ifLogined;
var mdb = require('../lib/method-MDB');




// 更改个人信息
//请求体
//{
//     nickname : '',       //字符串，用户的昵称
//     age : null,          //整型，用户的年龄
//     address : '',        //字符串，表示地址
//     introduction : '',   //字符串，用户的自我介绍
//     mailbox : ''         //字符串，用户的email
// }
// 成功
// {
//     result: 'success'
// }
// 失败
// {
//     result: 'failed',
//     reason: ''
// }
router.post('/',ifLogined,urlencodeParser,function(req,res){
    var {
        nickName = '',     //字符串，用户的昵称
        age = 0,                 //整型，用户的年龄
        address = '',             //字符串，表示地址
        introduction = '',        //字符串，用户的自我介绍
        mailbox = '',              //字符串，用户的email   
        sex = 1,                // 性别
    } = req.body;

    mdb.upd({
        connect: 'WeChat',
        site: 'users',
        sel: {
            userId: req.session.user.userId
        },
        upd: {
            $set:{
                nickName: nickName,          //字符串，用户的昵称
                age : age,                 //整型，用户的年龄
                address : address,             //字符串，表示地址
                introduction : introduction,        //字符串，用户的自我介绍
                mailbox : mailbox,              //字符串，用户的email 
                sex: sex                    // 性别
            }
        },
        callback: (result)=>{
            console.log(result);
            res.json({
                result:'success',
                message: '成功'
            });
        }
    })

});

module.exports = router;