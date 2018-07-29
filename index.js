var express = require('express');
var app = express();//top-level函数

// 设置 handlebars 视图引擎。默认创建view文件夹、layouts文件夹。
var handlebars = require('express3-handlebars')
    .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//设置保存静态资源的public文件夹
app.use(express.static(__dirname + '/public')); 

//设置访问端口
app.set('port', process.env.PORT || 3000);

//设置各个路由
app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    var fortunes = [
        "Conquer your fears or they will conquer you.",
        "Rivers need springs.",
        "Do not fear what you don't know.",
        "You will have a pleasant surprise.",
        "Whenever possible, keep it simple.",
    ];
    var randomFortune =
        fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', { fortune: randomFortune });
    //res.render('about');
});

// 404 catch-all 处理器（中间件）
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

// 500 错误处理器（中间件）
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
/*
app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('Meadowlark Travel');
});
app.get('/about', function(req, res) {
    res.type('text/plain');
    res.send('About Meadowlark Travel');
});

// 定制 404 页面
app.use(function(req, res, next) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
// 定制 500 页面
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});
*/
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});