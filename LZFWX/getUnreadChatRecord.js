var express = require('express');
var router = express.Router();
var logined = require('../lib/check-account').ifLogined;
var mdb = require('../lib/method-MDB');

//获取未读消息
//请求体
// 无
router.get('/',logined,function(req,res){
    mdb.chain({
        chain: [
            {
                connect: 'WeCaht',
                site: 'messages',
                type: 'sel',
                sel: {
                    $or: [
                        {
                            messageType: 1
                        },
                        {
                            messageType: 2
                        },
                        {
                            messageType: 3
                        }
                    ],
                    $or: [
                        {
                            receiver: {
                                userId: req.session.user.userId
                            },
                            receiverLook: false
                        },
                        {
                            sender: {
                                userId: req.session.user.userId
                            },
                            senderLook: false
                        }
                    ],
                },
                next(r,a,i){
                    res.json({
                        result: 'success',
                        message: r,
                    });
                    if(r.length===0){
                        return [];
                    }
                },
            },

            {
                connect: 'WeCaht',
                site: 'messages',
                type: 'upd',
                sel: {
                    $or: [
                        {
                            messageType: 1
                        },
                        {
                            messageType: 2
                        },
                        {
                            messageType: 3
                        },
                        
                    ],
                    receiver: {
                        userId: req.session.user.userId
                    },
                    receiverLook: false
                },
                upd: {
                    $set: {
                        receiverLook: true
                    }
                }
            },
            {
                connect: 'WeCaht',
                site: 'messages',
                type: 'upd',
                sel: {
                    $or: [
                        {
                            messageType: 1
                        },
                        {
                            messageType: 2
                        },
                        {
                            messageType: 3
                        },
                        
                    ],
                    sender: {
                        userId: req.session.user.userId
                    },
                    senderLook: false
                },
                upd: {
                    $set: {
                        senderLook: true
                    }
                }
            }
        ]
    })
});

module.exports = router;