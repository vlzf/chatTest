var express = require('express');
var router = express.Router();
var logined = require('../lib/check-account').ifLogined;
var mdb = require('../lib/method-MDB');

//获取聊天记录
//请求体
// {
//     userId:"1asdasd",//字符串，表示你要获取谁发给你的未读消息
// }
// 成功
// {
//     result: 'success',
//     messages: []
// }
// 失败
// {
//     result: 'failed',
//     messages: ''
// }
router.get('/',logined,function(req,res){
    var { userId } = req.query;

    mdb.sel({
        connect: 'WeChat',
        site: 'messages',
        sel: {
            $or:[
                {
                    messageType: 1,
                    sender: {
                        userId: req.session.user.userId
                    },
                    receiver: {
                        userId: userId
                    },
                },
                {
                    messageType: 1,
                    sender: {
                        userId: userId
                    },
                    receiver: {
                        userId: req.session.user.userId
                    },
                    
                }
            ]
        },
        callback: (result)=>{
            console.log(result);
            res.json({
                result: 'success',
                messages: result
            });
        }
    })
});

module.exports = router;