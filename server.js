var express = require('express');
var ejs = require('ejs');
var session = require('express-session');
var ms = require('connect-mongo')(session);
var flash = require('connect-flash');
var cors = require('cors');
var multer = require('multer');


var routes = require('./LZFWX/index');

var app = express();

/* 端口号 */
app.listen(process.env.PORT||8000,function(){
    console.log('server start');
});


// 图片处理
app.use(multer({ dest: './public/userData/IMG'}).array('file'));  // 文件参数名为 "file"



// 跨域
app.use(cors())

/* 静态资源 */
app.use(express.static('public'));

/* 模板 */
app.set('view engine','ejs');
app.set('views',__dirname +'/public/views');

/* session设置 */
app.use(session({
    name: 'LZFWX',
    secret: 'LZFWX',
    resave: true,
    saveUninitiallized: false,
    cookie: {
        maxAge: 36000
    },
    store: new ms({
        url: 'mongodb://localhost:27017/WeChat'
    })
}));
app.use(flash());


/* 挂载路由 */
routes(app);



/* 数据库 */
// url: 'localhost:27017',
// connect: 'WeChat',
// site: 'users',
// site: 'messages',