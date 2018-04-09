// 判断登录状态
module.exports = {
    ifLogined(req,res,next){
        if(req.session.user && req.session.user.account && req.session.user.password){
            next();
        }else{
            res.json({result:'failed',messages:'未登录'});
        }
    },
    ifNotLogined(req,res,next){
        if(req.baseUrl == '/LZFWX/login'){
            if(req.session.user){
                if(req.session.user.account==req.query.account && req.session.user.password==req.query.password){
                    res.json({
                        result:'success', 
                        messages: {
                            userId: req.session.user.userId
                        }
                    });
                }else {
                    res.json({
                        result:'failed',
                        messages:'已有其它帐号登录，请先注销再登录'
                    });
                }
            }else{
                next();
            }
        }
    }
}