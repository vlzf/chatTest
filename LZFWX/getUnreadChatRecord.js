var express = require('express');
var router = express.Router();
var logined = require('../lib/check-account').ifLogined;
var mdb = require('../lib/method-MDB');

//获取未读消息
//请求体
// 无
router.get('/',logined,function(req,res){
    var updMessageCode = ()=>{
        mdb.upd({
            connect: 'WeChat',
            site: 'messages',
            sel: {
                receiver: req.session.user.id,
                receiverLook: 0
            },
            upd: {
                $set: {
                    receiverLook: true
                }
            },
            callback: (result)=>{
                console.log('已读标记完成');
            }
        });
    }

    mdb.sel({
        connect: 'WeChat',
        site: 'messages',
        sel: {
            receiver: req.session.user.id,
            receiverLook: false
        },
        callback: (result)=>{
            console.log(result);
            res.json({
                result: 'success',
                messages: result
            });
            updMessageCode();
        }
    });
});

module.exports = router;