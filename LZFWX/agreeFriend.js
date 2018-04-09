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

    var check = ()=>{
        mdb.sel({
            connect: 'WeChat',
            site: 'messages',
            sel: {
                messageType: 2,
                messageId: messageId,
            },
            callback: (result)=>{
                console.log(result);
                if(result.length === 1){
                    if(result[0].receiver.userId === req.session.user.userId){
                        if(agree){
                            return addFriend(result[0].sender.userId, result[0].receiver.userId);
                        }
                    }else{
                        res.json({
                            result: 'failed',
                            messages: '非接收方',
                        })
                    }
                }else{
                    res.json({
                        result: 'failed',
                        messages: '申请已失效',
                    });
                }
            }
        })
    };



    var addFriend = (senderId,receiverId)=>{
        mdb.sel({
            connect: 'WeChat',
            site: 'users',
            sel: {
                $or: [
                    {
                        userId: receiverId,
                    },
                    {
                        userId: senderId,
                    }
                ]
            },
            callback: (result)=>{
                if(result.length === 2){
                    var s, r;
                    result.forEach((e,i)=>{
                        if(e.userId === senderId){
                            s = e;
                        }else if(e.userId === receiverId){
                            r = e;
                        }
                    });
                    s.friends.push(receiverId);
                    r.friends.push(senderId);
                    return updFriend(s,r);
                }
            }
        })
    }


    var updFriend = (s,r)=>{
        mdb.upd({
            connect: 'WeChat',
            site: 'users',
            sel: {
                userId: s.userId,
            },
            upd: {
                $set:{
                    friends: s.friends,
                },
            },
            callback: ()=>{
                return mdb.upd({
                    connect: 'WeChat',
                    site: 'users',
                    sel: {
                        userId: r.userId,
                    },
                    upd: {
                        $set: {
                            friends: r.friends,
                        }
                    },
                    callback: ()=>{
                        res.json({
                            result: 'success',
                            messages: '成功',
                        });
                        return systemMessage(s,r);
                    }
                })
            }
        })
    }


    var systemMessage = (s,r)=>{
        mdb.add({
            connect: 'WeChat',
            site: 'messages',
            add: {
                messageType: 3, // "0": 无效信息; "1": 普通消息; "2": 好友申请; "3": 更新好友列表消息
                messageId: cR('system'),  // 信息 id
                createTime: cT(), // 创建时间
                sender: {
                    userId: s.userId,          // 发送人id
                    nickName: '',    // 发送人昵称
                    userPhoto: '',       // 发送人头像
                },
                receiver: {
                    userId: r.userId,        // 接收人id
                    nickName: '',  // 接收人昵称
                    userPhoto: '',     // 接收人头像
                },
                content: '',               // 内容

                receiverLook: false,  // 是否已被接收
                senderLook: false,  // 是否已被接收
            },
            callback: ()=>{
                console.log('system: ok');
            }
        });
    }


    check();
});

module.exports = router;