var express = require('express');
var router = express.Router();
var logined = require('../lib/check-account').ifLogined;
var mdb = require('../lib/method-MDB');

//获取个人信息
//请求体
// {
//     无
// }
// 成功
// {
//     result: 'success',
//     messages: {
//         address : '广州大学城',//字符串
//         mailbox : "123@qq.com",//字符串，用户的email
//         introduction : "我是王尼玛",//字符串，用户设置的自我介绍
//         nickname : "群主",//字符串，用户的昵称
//         age : ""//字符，用户的年龄
//         sex: 0 | 1,   // 性别
//     }
// }
// 失败
// {
//     result:"failed",//字符串，表示失败状态，下同
//     messages:"asdasd"//字符串，提示信息
// }
router.get('/',logined,function(req,res){
    mdb.sel({
        connect: 'WeChat',
        site: 'users',
        sel: {
            id: req.session.user.userId
        },
        callback: (result)=>{
            console.log(result);
            res.json({
                result: 'success',
                messages: {
                    address: result[0].address,//字符串
                    mailbox: result[0].mailbox,//字符串，用户的email
                    introduction: result[0].introduction,//字符串，用户设置的自我介绍
                    nickName: result[0].nickName,//字符串，用户的昵称
                    age: result[0].age,//字符，用户的年龄
                    userPhoto: result[0].userPhoto,     // 头像
                    sex: result[0].sex           // 性别
                }
            })
        }
    });
});

module.exports = router;