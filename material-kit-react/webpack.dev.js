/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-01-06 10:55:55
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-01-14 16:58:03
 * @content: edit your page content
 */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const Dotenv = require('dotenv-webpack');
var proxy = require('http-proxy-middleware');
module.exports = env => {
  return merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
      publicPath: '/',
      filename: "js/[name].js",
    },
    plugins: [
      new Dotenv({
        path: path.resolve(__dirname, `.env.development`)
      }),
    ],
    cache: {
      type: 'filesystem',
      // 可选配置
      buildDependencies: {
        config: [__filename],  // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
      },
      name: 'development-cache',  // 配置以name为隔离，创建不同的缓存文件，如生成PC或mobile不同的配置缓存
    },
    devServer: {
      host: '0.0.0.0',
      port: 8080,
      contentBase: path.resolve(__dirname, "dist/"),
      historyApiFallback: {
        disableDotRule: true,
      },
      hot: true,
      proxy: {
        '/api': {
          target: 'http://10.217.2.232:31007',
          pathRewrite: { '^/api': '' },
          changeOrigin: true,
          secure: false,
          headers: {
            host: "http://10.217.2.232:31007",
            origin: "http://10.217.2.232:31007"
          }
        },
        '/dm':{
          target: 'http://10.217.2.232:31041',
          pathRewrite: { '^/dm': '' },
          changeOrigin: true,
          secure: false,
          headers: {
            host: "http://10.217.2.232:31041",
            origin: "http://10.217.2.232:31041"
          }
        },
        '/fs': {
          target: 'http://10.217.2.232:31011',
          pathRewrite: { '^/fs': '' },
          changeOrigin: true,
          secure: false,
          headers: {
            host: "http://10.217.2.232:31011",
            origin: "http://10.217.2.232:31011"
          }
        },
        '/cnt': {
          target: 'http://10.217.2.232:31013',
          pathRewrite: { '^/cnt': '' },
          changeOrigin: true,
          secure: false,
          headers: {
            host: "http://10.217.2.232:31013",
            origin: "http://10.217.2.232:31013"
          }
        }
      }
    },

    optimization: {
      moduleIds: "deterministic",
    },
  });
}
