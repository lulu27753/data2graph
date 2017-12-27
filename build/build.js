// https://github.com/shelljs/shelljs
require('./check-versions')();

process.env.NODE_ENV = 'production';// 设置当前环境为生产环境

const chalkAnimation = require('chalk-animation');// 字体打印机插件 //https://github.com/xingjialei/chalk-animation
const path = require('path');// node自带的文件路径工具
const chalk = require('chalk');// 在终端输出带颜色的文字  // https://github.com/chalk/chalk
const shell = require('shelljs');// 可以在Node上使用Shell命令的工具 // https://github.com/shelljs/shelljs
const webpack = require('webpack');
const config = require('../config');// 配置文件
const webpackConfig = require('./webpack.prod.conf');

// 在终端显示loading效果，并输出提示
const animation = chalkAnimation.rainbow('building for production...');
animation.start();

const assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
shell.rm('-rf', assetsPath); // 删除文件夹
shell.mkdir('-p', assetsPath);
shell.config.silent = true;// 中断所有命令的输出，除了 echo()，默认是 false. // http://documentup.com/shelljs/shelljs#command-reference
shell.cp('-R', 'static/*', assetsPath);// 将文件从assetsPath拷贝到static目录下
shell.config.silent = false;


// 构建
webpack(webpackConfig, function (err, stats) {
    // 构建成功
    animation.stop();// 停止 loading动画
    if (err) throw err;
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');

    // 打印提示
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ));
});
