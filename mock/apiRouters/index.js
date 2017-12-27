var express = require('express')// 引入express模块
var routers = require('./routers')
var apiRouters = express.Router();

/**
 * 配置query路由
 * @param  {[type]} req  [客户端发过来的请求所带数据]
 * @param  {[type]} res  [服务端的相应对象，可使用res.send返回数据，res.json返回json数据，res.down返回下载文件]
 * 直接访问http://localhost:3000/query
 */

routers.map((router) => {
	apiRouters.get(router.url, function (req, res) {
	res.json(router.data);
	});
})


module.exports = apiRouters;
