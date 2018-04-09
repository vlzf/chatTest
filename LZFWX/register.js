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

    var userCount = 0;

    var selInf = ()=>{     // 检查用户是否存在
        mdb.sel({
            connect: 'WeChat',
            site: 'users',
            sel: {},
            callback: (result)=>{
                console.log(result);

                userCount = result.length;      // 记录用户数量

                if(!result.find((e,i)=>{
                    return e.account === account;
                })){    //不存在，则注册
                    return addInf();
                }else{       //存在，注册失败
                    result = null;
                    res.json({result:'failed',reason:'用户已存在'});
                }
            }
        })
    }

    var addInf = ()=>{         // 添加用户账号
        mdb.add({
            connect: 'WeChat',
            site: 'users',
            add: {
                userId: userCount+1+'',
                account: account,
                password: password,
                nickname: '',          //字符串，用户的昵称
                age : '',                 //整型，用户的年龄
                sex: 1,              // 性别
                address : '',             //字符串，表示地址
                introduction : '',        //字符串，用户的自我介绍
                mailbox: '',              //字符串，用户的email  
                friends: [],            //好友
                createTime : cT(),          //创建时间
                lastLoginTime: ""         //最近一次登录时间
            },
            callback: (result)=>{
                console.log(result);
                res.json({result:'success',account: result.ops[0].account});    // 成功，则返回 account
            }
        });
    }

    if(account&&password){   // 判断是否符合 注册要求
        selInf();
    }else{
        res.json({result:'failed',reason:'帐号或密码未输入'});
    }
});




module.exports = router;