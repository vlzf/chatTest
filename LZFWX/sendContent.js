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

    var sel = ()=>{
        mdb.sel({
            connect: 'WeChat',
            site: 'users',
            sel: {
                $or: [
                    {
                        userId: receiverId,
                    },
                    {
                        userId: req.session.user.userId,
                    }
                ],
            },
            callback: (result = [])=>{
                if(result.length !== 2) {
                    res.json({
                        result: 'failed',
                        messages: '联系人不存在',
                    });
                    return;
                }
                var s, r, k = false;
                result.forEach((e,i)=>{
                    if(e.userId === req.session.user.userId) s = e;  // 发送者
                    else if(e.userId === receiverId) r = e;          // 接收者
                });
                s.friends.forEach((e,i)=>{
                    if(e === receiverId) k = true;  // 为好友关系
                });
                if(k) {
                    return add(s,r); 
                }else {
                    res.json({
                        result: 'failed',
                        messages: '非好友关系'
                    })
                }
            }
        })
    }

    var add = (s,r)=>{
        mdb.add({
            connect: 'WeChat',
            site: 'messages',
            add: {
                messageType: 1, // "0": 无效信息; "1": 普通消息; "2": 好友申请; "3": 更新好友列表消息
                messageId: cR(s.userId),  // 信息 id
                createTime: cT(), // 创建时间
                sender: {
                    userId: s.userId,          // 发送人id
                    nickName: s.nickName,    // 发送人昵称
                    userPhoto: s.userPhoto,       // 发送人头像
                },
                receiver: {
                    userId: r.userId,        // 接收人id
                    nickName: r.nickName,  // 接收人昵称
                    userPhoto: r.userPhoto,     // 接收人头像
                },
                content: content,               // 内容
            
                receiverLook: false,  // 是否已被接收
                senderLook: false,  // 是否已被接收
            },
            callback: (result)=>{
                console.log(result);
                res.json({
                    result: 'success'
                })
            }
        });
    }
    
    sel();

});

module.exports = router;