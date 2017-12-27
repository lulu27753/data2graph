var express = require('express');// 引入express模块
var apiRoutes = require('./apiRouters');// 引入路由


var app = express(); // 实例化express

app.use(apiRoutes);

// 监听3000端口
app.listen(3000, function() {
	console.log('app listening at http://localhost:3000')
});

/*为app添加中间件处理跨域请求*/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});