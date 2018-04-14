module.exports = function(app){
    app.use('/LZFWX/home',require('./home'));
    app.use('/LZFWX/register',require('./register'));
    app.use('/LZFWX/login',require('./login'));
    app.use('/LZFWX/logout',require('./logout'));
    app.use('/LZFWX/updateUserInfor',require('./updateUserInfor'));
    app.use('/LZFWX/getUserInfor',require('./getUserInfor'));
    app.use('/LZFWX/getList',require('./getList'));
    app.use('/LZFWX/sendContent',require('./sendContent'));
    app.use('/LZFWX/getUnreadChatRecord',require('./getUnreadChatRecord'));
    app.use('/LZFWX/getChatRecord',require('./getChatRecord'));
    app.use('/LZFWX/findFriends', require('./findFriends'));
    app.use('/LZFWX/makeFriend', require('./makeFriend'));
    app.use('/LZFWX/agreeFriend', require('./agreeFriend'));
    app.use('/LZFWX/uploadHeadPhoto', require('./uploadHeadPhoto'));

    app.use(function(req,res){
        res.status(404);
        res.send('404 - Not Found');
    })
}