var express = require('express');
var router = express.Router();
var mdb = require('../lib/method-MDB');
var notLogined = require('../lib/check-account').ifNotLogined;
var cT = require('../lib/createTime').createCurrentTime;
//登录
//请求体
// {
//     account:'admin',//字符串，用户名
//     password:'123123'//字符串，密码
// }
// 成功
// {
//     result :"success",//字符串，表示成功状态，下同
//     userId :"asdkhasldk123123" //字符串，服务器会返回用户的id，类似于QQ号
// }
// 失败
// {
//     result:"failed",//字符串，表示失败状态，下同
//     reason:""//字符串，提示信息，如未设置密码
// }
router.get('/',notLogined,function(req,res){
    var {account, password} = req.query;

    var selInf = ()=>{
        mdb.sel({
            connect: 'WeChat',
            site: 'users',
            sel: {
                account: account,
                password: password
            },
            callback: (result)=>{
                console.log(result);
                if(result.length==0){   // 找不到用户信息
                    res.json({result:'failed',reason:"帐号或密码错误"});
                }else if(result.length==1){  // 找到用户
                    req.session.user = {
                        account: result[0].account,
                        userId: result[0].userId,
                        password: result[0].password
                    }
                    res.json({result: 'success', userId: result[0].userId});
                    updInf(result[0].userId);
                }else{   // 出错
                    res.json({result:'failed',reason:'服务器错误'});
                }
            }
        })
    }

    var updInf = (userId)=>{
        mdb.upd({
            connect: 'WeChat',
            site: 'users',
            sel: {
                userId: userId
            },
            upd: {
                $set: {
                    lastLoginTime: cT()
                }
            },
            callback: (result)=>{
                console.log(result);
            }
        })
    }

    //验证
    if(account && password){
        selInf();
    }else{
        res.json({result:'failed',reason:'账号或密码未填写'});
    }
});

module.exports = router;