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

    function login(){
        mdb.chain({
            chain: [
                {
                    connect: 'WeChat',
                    site: 'users',
                    type: 'sel',
                    sel: {
                        account: account,
                        password: password
                    },
                    next(r,a,i){
                        if(r.length === 1){  // 找到
                            req.session.user = {
                                account: r[0].account,
                                userId: r[0].userId,
                                password: r[0].password
                            }
                            return;
                        }else{             // 找不到
                            res.json({
                                result: 'failed',
                                reason: '账号或密码错误'
                            });
                            return []; // 清空操作链
                        }
                    }
                },
                {
                    connect: 'WeChat',
                    site: 'users',
                    type: 'upd',
                    sel: {
                        account: account,
                        password: password
                    },
                    upd: {
                        $set: {
                            lastLoginTime: cT()
                        }
                    },
                    next(r,a,i){
                        console.log('登录时间更新成功');
                    }
                }
            ]
        })
    }


   

    //验证
    if(account && password){
        login();
    }else{
        res.json({result:'failed',reason:'账号或密码未填写'});
    }
});

module.exports = router;