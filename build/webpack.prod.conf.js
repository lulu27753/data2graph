const path = require('path');// node自带的文件路径工具
const utils = require('./utils');// 工具函数集合
const webpack = require('webpack');
const config = require('../config');// 配置文件
const merge = require('webpack-merge');// webpack 配置合并插件
const baseWebpackConfig = require('./webpack.base.conf');// webpack 基本配置
const CopyWebpackPlugin = require('copy-webpack-plugin');// webpack 复制文件和文件夹的插件 // https://github.com/kevlened/copy-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');// 自动生成 html 并且注入到 .html 文件中的插件 // https://github.com/ampedandwired/html-webpack-plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin');// 将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件 // https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/
const env = config.build.env;// 配置生产环境

let webpackConfig = merge(baseWebpackConfig, {
    module: {
        // styleLoaders
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,// 是否开启 sourceMap
    output: {
        path: config.build.assetsRoot,// 编译输出的静态资源根路径
        filename: utils.assetsPath('js/[name].[chunkhash].js'),// 编译输出的文件名
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')// 没有指定输出名的文件输出的文件名
    },
    plugins: [
        // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
        // 此处，插入适当的环境
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // 压缩 js
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false,
            sourceMap: true
        }),
        // extract css into its own file
        // 提取 css
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            allChunks: true
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        // 自动生成 html 并且注入到 .html 文件中的插件
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // 更多选项:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            // 必须通过 CommonsChunkPlugin一致地处理多个 chunks
            chunksSortMode: 'dependency'
        }),
        // split vendor js into its own file
        // 分割公共 js 到独立的文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                // node_modules中的任何所需模块都提取到vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                );
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        // 将webpack runtime 和模块清单 提取到独立的文件，以防止当 app包更新时导致公共 jsd hash也更新
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        // copy custom static assets
        // webpack 复制文件和文件夹的插
        // https://github.com/kevlened/copy-webpack-plugin
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        // webpack3 new feature
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
});

// 开启 gzip 的情况时，给 webpack plugins添加 compression-webpack-plugin 插件
if (config.build.productionGzip) {
    // webpack 压缩插件
    // https://github.com/webpack-contrib/compression-webpack-plugin
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    // 向webpackconfig.plugins中加入下方的插件
    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

// 开启包分析的情况时， 给 webpack plugins添加 webpack-bundle-analyzer 插件
if (config.build.bundleAnalyzerReport) {
    // https://github.com/th0r/webpack-bundle-analyzer
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
