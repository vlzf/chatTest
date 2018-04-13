var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser'); 
var urlencodeParser = bodyParser.urlencoded({extended:false});

var mdb = require('../lib/method-MDB');
var cT = require('../lib/createTime').createCurrentTime;

// 请求体
// {
//     account:"LZF",
//     password:"123"
// }
// 成功
// {
//     result: "success",
//     account: "dfgtsgsdg"
// }
// 失败
// {
//     result:"failed",
//     reason: ""
// }
//发消息
router.post('/',urlencodeParser,function(req,res){
    var {
        account='',
        password=''
    } = req.body;


    function chain(){
        var userCount;
        mdb.chain({
            chain: [
                {
                    connect: 'WeChat',
                    site: 'users',
                    type: 'sel',
                    sel: {
                        account: account
                    },
                    next(result,array,i){
                        console.log(result);

                        if(!result.find((e,i)=>{
                            return e.account === account;
                        })){    //不存在，则注册
                            return;
                        }else{       //存在，注册失败
                            res.json({result:'failed',reason:'用户已存在'});
                            return [];  // 清空操作链
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
                        ({userCount}=r[0]);
                        a[i+1].add.userId = ++userCount;
                        a[i+2].upd.$set.userCount = userCount;
                        return;
                    },
                },
                {
                    connect: 'WeChat',
                    site: 'users',
                    type: 'add',
                    add: {
                        userId: null,          // 由上一个决定
                        account: account,
                        password: password,
                        nickname: '',          //字符串，用户的昵称
                        age : null,                 //整型，用户的年龄
                        sex: 1,              // 性别
                        address : '',             //字符串，表示地址
                        introduction : '',        //字符串，用户的自我介绍
                        mailbox: '',              //字符串，用户的email  
                        friends: [],            //好友
                        createTime : cT(),          //创建时间
                        lastLoginTime: ""         //最近一次登录时间
                    },
                    next(result){
                        console.log(result);
                        res.json({
                            result:'success',
                            message: {
                                account: result.ops[0].account
                            }
                        });    // 成功，则返回 account
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
                            userCount: 1,
                        }
                    },
                    next(r,a,i){
                        console.log(r);
                    }
                }
            ]
        })
    }

    if(account&&password){   // 判断是否符合 注册要求
        chain();
    }else{
        res.json({
            result:'failed',
            message:'帐号或密码未输入'
        });
    }
});




module.exports = router;