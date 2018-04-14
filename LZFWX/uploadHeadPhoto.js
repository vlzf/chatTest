var router = require('express').Router();
var urlencodeParser = require('body-parser').urlencoded({extended: false});
var ifLogined = require('../lib/check-account').ifLogined;
var fs = require('fs');
var path = require('path');
var mdb = require('../lib/method-MDB');

/* 
    file
*/
router.post('/', ifLogined, urlencodeParser, function(req,res){
    var image = req.files[0];
    if(!image){
        res.json({
            result: 'failed',
            message: '文件为空'
        });
        return;
    }else if(!(/.(jpg|JPG|png)/.test(image.originalname))){
        res.json({
            result: 'failed',
            message: '只允许 .jpg|.JPG|.png 三种格式'
        });
        return;
    }else if(image.filesize > 1024000){
        res.json({
            result: 'failed',
            message: '图片大小不能超过 1M'
        });
        return;
    }

    var htmlPath = '../userData/userHeadPhoto/' + req.session.user.userId;
    var savePath = path.join(__dirname, '../public/userData/userHeadPhoto/'+ req.session.user.userId);


    fs.readFile(image.path, function(err,d){
        if(err){
            res.json({
                result: 'failed',
                message: '失败'
            });
            return;
        }

        return fs.writeFile(savePath,d,function(err){
            if(err){
                res.json({
                    result: 'failed',
                    message: '失败'   
                });
                return;
            }
            return dealPhoto();
        })
    });



    function dealPhoto(){
        mdb.chain({
            chain: [
                {
                    connect: 'WeChat',
                    site: 'users',
                    type: 'upd',
                    sel: {
                        userId: req.session.user.userId
                    },
                    upd: {
                        $set: {
                            userPhoto: htmlPath
                        }
                    },
                    next(r,a,i){
                        res.json({
                            result: 'success',
                            message: {
                                userPhoto: htmlPath
                            }
                        });
                        return [];
                    }
                }
            ]
        })
    }

})



module.exports = router;