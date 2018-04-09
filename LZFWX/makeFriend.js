var ifLogined = require('../lib/check-account').ifLogined;
var urlencoded = require('body-parser').urlencoded;
var mdb = require('../lib/method-MDB');
var express = require('express');
var router = express.Router();
var urlencodeParser = urlencoded({extended: false});
var cR = require('../lib/createRandom').createRandomInt;
var cT = require('../lib/createTime').createCurrentTime;


/* 
请求体
{
    content: '',
    receiverId: '',
}
成功
{
    result: 'success',
}
失败
{
    result: 'failed',
}
*/
router.post('/', ifLogined, urlencodeParser, function(req,res){
    var {content, receiverId} = req.body;


    var check = ()=>{
        mdb.sel({
            connect: 'WeChat',
            site: 'users',
            sel: {
                $or:[
                    {
                        userId: receiverId
                    },
                    {
                        userId: req.session.user.userId
                    }
                ]
            },
            callback: (result)=>{
                console.log(result);
                if(result.length === 2){
                    var s, r;
                    result.forEach((e,i)=>{
                        if(e.userId === receiverId){
                            r = e;
                        }else if(e.userId === req.session.user.userId){
                            s = e;
                        }
                    });
                    if(s.friends.find((e,i)=>{
                        return e === receiverId;
                    })){
                        return sendMessage(s,r);
                    }else{
                        res.json({
                            result: 'failded',
                            messages: '已存在',
                        })
                    }
                }else{
                    res.json({
                        result: 'failed',
                        messages: '该联系人不存在',
                    })
                }
            }
        })
    };


    var sendMessage = (sender,receiver)=>{
        mdb.add({
            connect: 'WeChat',
            site: 'messages',
            add: {
                messageType: 2,
                messageId: cR(sender.userId),
                createTime: cT(),
                sender: {
                    userId: sender.userId,          // 发送人id
                    nickName: sender.nickName,    // 发送人昵称
                    userPhoto: sender.userPhoto,       // 发送人头像
                },
                receiver: {
                    userId: receiver.userId,        // 接收人id
                    nickName: receiver.nickName,  // 接收人昵称
                    userPhoto: receiver.userPhoto,     // 接收人头像
                },
                content: content,               // 内容
                receiverLook: false,  // 是否已被接收
                senderLook: false,  // 是否已被接收
            },
            callback: (result)=>{
                console.log(result);
                res.json({
                    result: 'success',
                })
            }
        })
    };

    check();
})



module.exports = router
