var express = require('express');
var app = express(); //top-level函数，因为index.js里面module.exports的是require到的其他模块，必须实例化。若为具体内容，则正常使用。即index.js内仅有module.exports = require('./lib/express');时，需要实例化。

/*
var Hello=require('./hello');//因为路径是js文件，且其中module.exports是具体的内容(对象，函数，成员变量)
Hello('jone','28','10000');//module.exports的是函数则不用new；若module.exports的是对象则要new。
*/

// 设置 handlebars 视图引擎。默认创建view文件夹、layouts文件夹。
var handlebars = require('express3-handlebars')
    .create({
        partialsDir: "views/partials/",
        layoutsDir: "views/layouts/",
        defaultLayout: 'main',
        //extname: '.hbs',
        helpers: {
            noop: function(options) { return options.fn(this); }, //return options.fn(this); 块级helper：只是执行一下跟没有一样
            section: function(name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });
app.engine('handlebars', handlebars.engine); //将模板引擎扩展名设置为第一个参数
app.set('view engine', 'handlebars'); //第二个参数与上面扩展名对应
//var path  = require('path');   app.set('views', path.join(__dirname, 'views'));

//设置保存静态资源的public文件夹
app.use(express.static(__dirname + '/public'));

//设置访问端口
app.set('port', process.env.PORT || 3000);

//设置中间件
function getWeatherData() {
    return {
        locations: [{
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.use(function(req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});


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

//mytest
app.get('/mytest', function(req, res) {
    //handlebars.registerHelper('noop', function(options) {   return options.fn(this); });
    res.render('mytest');
});

app.get('/jquerytest', function(req, res) {
    
    res.render('jquerytest');
});

app.get('/front_end/login', function(req, res) {
    
    res.sendFile(__dirname + '/front_end/login.html');
});

var bodyParser = require('body-parser');
//multipart/form-data 文件提交
//text/xml 提交xml格式的数据
app.use(bodyParser.json());//application/json 提交json格式的数据
// 请求头中包含这样的信息： Content-Type: application/x-www-form-urlencoded ,即对form提交的编码解析。
// bodyParser.urlencoded 模块用于解析req.body的数据，解析成功后覆盖原来的req.body，如果解析失败则为 {}。
app.use(bodyParser.urlencoded({ extended: false }));//或者 var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/process', function (req, res) {         //app.post('/process', urlencodedParser, function (req, res){}

   // 输出 JSON 格式
   response = {
       first_name:req.body.usename,
       last_name:req.body.password
   };
   console.log(response);
   //res.send({ "success": true });
   res.status(200);
   res.send(JSON.stringify(response));//JSON.stringify()【从一个对象中解析出字符串】   //JSON.parse()【从一个字符串中解析出json对象】
   //res.end();
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