import { json } from './C:/Users/LZF/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/express';

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


    function makeFriend(){
        mdb.chain({
            chain: [
                {
                    connect: 'WeChat',
                    site: 'users',
                    type: 'sel',
                    sel: {
                        $or:[
                            {
                                userId: receiverId,
                            },
                            {
                                userId: req.session.user.userId,
                            }
                        ]
                    },
                    next(r,a,i){
                        if(r.length === 2){
                            var rr, sr;
                            if(r[0].userId === req.session.user.userId){
                                sr = r[0];
                                rr = r[1];
                            }else{
                                sr = r[1];
                                rr = r[0];
                            }
                            for(let index = 0; index< sr.friends.length; index++){
                                if(sr.friends[index] === rr.userId) {
                                    res.json({
                                        result: 'failed',
                                        messages: '已存在',
                                    });
                                    return [];   // 清空操作链
                                }
                            }
                            a[i+2].add.sender = {
                                userId: sr.userId,          // 发送人id
                                nickName: sr.nickName,    // 发送人昵称
                                userPhoto: sr.userPhoto,       // 发送人头像
                            };
                            a[i+2].add.receiver = {
                                userId: rr.userId,        // 接收人id
                                nickName: rr.nickName,  // 接收人昵称
                                userPhoto: rr.userPhoto,     // 接收人头像
                            }
                            return;    // 关系不存在，继续
                        }else{
                            res.json({
                                result: 'failed',
                                messages: '无'
                            });
                            return [];   // 清空操作链
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
                        if(r.length){
                            a[i+1].add.messageId = r[0].messageCount+1;
                        }else{
                            res.json({
                                result: 'failed',
                                messages: '失败'
                            })
                            return [];
                        }
                    }
                },

                {
                    connect: 'WeChat',
                    site: 'messages',
                    type: 'add',
                    add: {
                        messageType: 2,
                        messageId: null,     // 由上一个决定
                        createTime: cT(),
                        sender: {},         // 由前两个决定
                        receiver: {},      // 由前两个决定
                        content: content,               // 内容
                        receiverLook: false,  // 是否已被接收
                        senderLook: false,  // 是否已被接收
                    },
                    next(r,a,i){
                        res.json({
                            result: 'success',
                            messages: '成功'
                        });
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
                            messageCount: 1,
                        }
                    }
                }
            ]
        })
    }

    if(receiverId){
        makeFriend();
    }else{
        res.json({
            result: 'failed',
            messages: '对方不存在',
        })
    }
})



module.exports = router
