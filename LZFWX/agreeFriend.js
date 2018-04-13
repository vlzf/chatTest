var router = require('express').Router();
var ifLogined = require('../lib/check-account').ifLogined;
var urlencodeParser = require('body-parser').urlencoded({extended: false});
var mdb = require('../lib/method-MDB');
var cR = require('../lib/createRandom').createRandomInt;
var cT = require('../lib/createTime').createCurrentTime;

/* 
请求体
{
    messageId: '',  // 同意的申请 id 
    agree: true | false,  // 是否同意 
}
成功
{
    result: "success",
    messages: {

    }
}
失败
{
    result: 'failed',
    messages: '申请已失效'
}
*/
router.post('/', ifLogined, urlencodeParser, function(req,res){
    var {messageId, agree} = req.body;


    if(messageId&&typeof agree == "boolean"){
        agreeFriend();
    }else {
        res.json({
            result: 'failed',
            message: '不存在'
        });
    }

    function agreeFriend(){
        var sr,rr;
        mdb.chain({
            chain: [
                {    // 0
                    connect: 'WeChat',
                    site: 'messages',
                    type: 'sel',
                    sel: {
                        messageId: messageId,
                        messageType: 2
                    },
                    next(r,a,i){
                        if(!r.length){
                            res.json({
                                result: 'failed',
                                message: '申请以失效',
                            });
                            return [];
                        }
                        sr = r[0].sender;
                        rr = r[0].receiver;
                        a[i+2].sel.userId = rr.userId;
                        a[i+2].upd.$push.friends = sr.userId;
                        a[i+3].sel.userId = sr.userId;
                        a[i+3].upd.$push.friends = rr.userId;

                        a[i+5].add.receiver = rr;
                        a[i+5].add.sender = sr;
                    }
                },

                {   // 1
                    connect: 'WeChat',
                    site: 'messages',
                    type: 'upd',
                    sel: {
                        messageId: messageId,
                        messageType: 2,
                    },
                    upd: {
                        $set: {
                            messageType: 0,
                        }
                    },
                    next(r,a,i){
                        if(!agree){//不同意
                            res.json({
                                result: 'success',
                                message: '已拒绝'
                            });
                            return [];
                        }
                        // 同意
                    }
                },
                
                {   // 2
                    connect: 'WeChat',
                    site: 'users',
                    type: 'upd',
                    sel: {
                        userId: null
                    },
                    upd: {
                        $push: {
                            friends: null
                        } 
                    }
                },

                {   // 3
                    connect: 'WeChat',
                    site: 'users',
                    type: 'upd',
                    sel: {
                        userId: null
                    },
                    upd: {
                        $push: {
                            friends: null
                        } 
                    },
                },

                {  // 4
                    connect: 'WeChat',
                    site: 'count',
                    type: 'sel',
                    sel: {
                        countName: 'WeChat',
                    },
                    next(r,a,i){
                        a[i+1].add.messageId = r[0].messageCount+1;
                    }
                },

                {// 5
                    connect: 'WeChat',
                    site: 'messages',
                    type: 'add',
                    add: {
                        messageType: 3, // "0": 无效信息; "1": 普通消息; "2": 好友申请; "3": 更新好友列表消息
                        messageId: null,  // 信息 id  由上一个决定
                        createTime: cT(), // 创建时间
                        sender: {},            // 由第 0 个决定
                        receiver: {},          // 由第 0 个决定
                        content: '通过验证',               // 内容

                        receiverLook: false,  // 是否已被接收
                        senderLook: false,  // 是否已被接收
                    },
                    next(r,a,i){
                        res.json({
                            result: 'success',
                            message: '已接受'
                        })
                    }
                },

                {// 6
                    connect: 'WeChat',
                    site: 'count',
                    type: 'upd',
                    sel: {
                        countName: 'WeChat',
                    },
                    upd: {
                        $inc: {
                            messageCount: 1,
                        }
                    },
                    next(r,a,i){
                        console.log('ok')
                    }
                }
            ]
        })
    }

    

});

module.exports = router;