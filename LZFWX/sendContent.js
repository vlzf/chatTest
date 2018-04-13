var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser'); 
var urlencodeParser = bodyParser.urlencoded({extended:false});
var logined = require('../lib/check-account').ifLogined;
var mdb = require('../lib/method-MDB');
var cT = require('../lib/createTime').createCurrentTime;
var cR = require('../lib/createRandom').createRandomInt;


//请求体
// {
//     receiverId:"asdjlaskdjasd",//被接收者的userid
//     content:"终于写好发送消息的接口啦？"//字符串，消息内容
// }
// 成功
// {
//     result: 'success',
// }
// 失败
// {
//     result: 'failed',
//     reason: ''
// }
//发消息
router.post('/',logined,urlencodeParser,function(req,res){
    var {
        receiverId='',
        content=''
    } = req.body;

    if(receiverId&&content){
        send();
    }else{
        res.json({
            result: 'failed',
            message: '接受方或信息内容为空'
        })
    }


    function send(){
        mdb.chain({
            chain: [
                {
                    connect: 'WeChat',
                    site: 'users',
                    type: 'sel',
                    sel: {
                        $or: [
                            {
                                userId: receiverId,
                            },
                            {
                                userId: req.session.user.userId
                            }
                        ]
                    },
                    next(r,a,i){
                        if(r.length !== 2){
                            res.json({
                                result: 'failed',
                                message: '联系人不存在',
                            });
                            return [];
                        }
                        var sr, rr, k = false;
                        r.forEach((e,i)=>{
                            if(e.userId === req.session.user.userId) sr = e;  // 发送者
                            else if(e.userId === receiverId) rr = e;          // 接收者
                        });
                        for(let i = 0;i< sr.friends.length;i++){
                            if(sr.friends[i] === receiverId) {
                                k = true;     // 为好友关系
                                break;
                            }
                        }
                        if(k) {
                            i += 2;
                            a[i].add.sender = {
                                userId: sr.userId,
                                nickName: sr.nickName,    // 发送人昵称
                                userPhoto: sr.userPhoto,       // 发送人头像 
                            };
                            a[i].add.receiver = {
                                userId: rr.userId,        // 接收人id
                                nickName: rr.nickName,  // 接收人昵称
                                userPhoto: rr.userPhoto,     // 接收人头像
                            }
                            return;
                        }else {
                            res.json({
                                result: 'failed',
                                message: '非好友关系'
                            });
                            return [];
                        }
                    }
                },

                {
                    connect: 'WeChat',
                    site: 'count',
                    type: 'sel',
                    sel: {
                        countName: 'WeChat',
                    },
                    next(r,a,i){
                        a[i++].add.messageId = r[0].messageCount + 1;
                        return;
                    }
                },

                {
                    connect: 'WeChat',
                    site: 'messages',
                    type: 'add',
                    add: {
                        messageType: 1, // "0": 无效信息; "1": 普通消息; "2": 好友申请; "3": 更新好友列表消息
                        messageId: null,  // 信息 id
                        createTime: cT(), // 创建时间
                        sender: {},
                        receiver: {},
                        content: content,               // 内容
                    
                        receiverLook: false,  // 是否已被接收
                        senderLook: false,  // 是否已被接收
                    },
                    next(r,a,i){
                        res.json({
                            result: 'success',
                            message: '成功'
                        });
                        return;
                    }
                },

                {
                    connect: 'WeChat',
                    site: 'count',
                    type: 'upd',
                    sel: {
                        countName: 'WeChat',
                    },
                    upd: {
                        $inc: {
                            messageCount: 1
                        }
                    }
                }
            ]
        })
    }

});

module.exports = router;