var express = require('express');
var router = express.Router();

//首页
router.get('/',function(req,res){
    res.status(200);
    res.render('weixin');
    //res.render('weixin');
});

module.exports = router;



