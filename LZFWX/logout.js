var express = require('express');
var router = express.Router();
var logined = require('../lib/check-account').ifLogined;

//登出
router.get('/',logined,function(req,res){
    req.session.user = null;
    res.json({result:'success'});
    //res.render('weixin');
});

module.exports = router;