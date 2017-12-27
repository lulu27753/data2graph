require('./check-versions')();

// 配置文件
const config = require('../config');

// 如果 Node 的环境无法判断当前是 dev / product 环境
// 使用 config.dev.env.NODE_ENV 作为当前的环境
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}
// 可以强制打开浏览器并跳转到指定 url 的插件
// https://github.com/sindresorhus/opn
const opn = require('opn');
const chalk = require('chalk');
const path = require('path');// node自带的文件路径工具
const express = require('express');// express框架
const webpack = require('webpack');
// 测试环境，使用的配置与生产环境的配置一样
// 非测试环境，即为开发环境，因为此文件只有测试环境和开发环境使用
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');// 开发环境配置文件

// 端口号为命令行输入的PORT参数或者配置文件中的默认值
const port = process.env.PORT || config.dev.port;
// 配置文件中是否自动打开浏览器，如果没有设置，则返回false
const autoOpenBrowser = !!config.dev.autoOpenBrowser;
// // 配置文件中 http代理配置
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;

// 启动 express 服务
const app = express();
const compiler = webpack(webpackConfig);// 启动 webpack 编译

// 可以将编译后的文件暂存到内存中的插件
// https://github.com/webpack/webpack-dev-middleware
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath, // 公共路径，与webpack的publicPath一样
    quiet: true // 不打印
});

// Hot-reload 热加载插件
// https://github.com/glenjamin/webpack-hot-middleware
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
});

// enable gzip in development
app.use(require('compression')());

// 将 proxyTable 中的请求配置挂在到启动的 express 服务上
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    // 如果options的数据类型为string，则表示只设置了url，
    // 所以需要将url设置为对象中的 target的值
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
// 使用 connect-history-api-fallback 匹配资源
// 如果不匹配就可以重定向到指定地址
// https://github.com/bripkens/connect-history-api-fallback
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
// 将暂存到内存中的 webpack 编译后的文件挂在到 express 服务上
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
// 将 Hot-reload 挂在到 express 服务上
app.use(hotMiddleware);

// serve pure static assets
// 拼接 static 文件夹的静态资源路径
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
// 静态文件服务
app.use(staticPath, express.static('./static'));

const uri = 'http://localhost:' + port;
const ip = 'http://' + require('ip').address() + ':' + port;

// 编译成功后打印网址信息
devMiddleware.waitUntilValid(function () {
    console.log(chalk.cyan('- Local: ' + uri + '\n'));
    console.log(chalk.cyan('- On your Network: ' + ip + '\n'));
});

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    // when env is testing, don't need open it
    // 如果配置了自动打开浏览器，且不是测试环境，则自动打开浏览器并跳到我们的开发地址
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    };
});
