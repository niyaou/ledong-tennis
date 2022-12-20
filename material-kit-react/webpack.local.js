/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-23 11:44:46
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 11:19:42
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
    target: "web",
    output: {
      publicPath: '/',
      filename: "js/[name].js",
    },
    plugins: [
      new Dotenv({
        path: path.resolve(__dirname, `.env.development`)
      }),
    ],
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
        // '/api/pangoo-data-set':{
        //   // target: 'http://10.217.2.232:31041',
        //   target: 'http://localhost:51228',
        //   pathRewrite: { '^/api/pangoo-data-set': '' },
        //   changeOrigin: true,
        //   secure: false,
        //   headers: {
        //     host: "http://10.217.2.232:31041",
        //     origin: "http://10.217.2.232:31041"
        //   }
        // },
        //env prod
        // '/api': {
        //   target: 'http://10.133.34.120:31207',
        //   pathRewrite: { '^/api': '' },
        //   changeOrigin: true,
        //   secure: false,
        //   headers: {
        //     host: "http://10.133.34.120:31207",
        //     origin: "http://10.133.34.120:31207"
        //   }
        // },
        // env dev
        '/api': {
          target: 'http://localhost:9968',
          pathRewrite: { '^/api': '' },
          changeOrigin: true,
          secure: false,
          headers: {
            host: "http://localhost:9968",
            origin: "http://localhost:9968"
          }
        },
        // '/api': {
        //   target: 'https://www.ledongtennis.cn:8081',
        //   pathRewrite: { '^/api': '' },
        //   changeOrigin: true,
        //   secure: false,
        //   headers: {
        //     host: "https://www.ledongtennis.cn:8081",
        //     origin: "https://www.ledongtennis.cn:8081"
        //   }
        // },
        //env test
        // '/api': {
        //   target: 'http://10.133.34.21:31107',
        //   pathRewrite: { '^/api': '' },
        //   changeOrigin: true,
        //   secure: false,
        //   headers: {
        //     host: "http://10.133.34.21:31107",
        //     origin: "http://10.133.34.21:31107"
        //   }
        // },

      }
    },

    optimization: {
      moduleIds: "deterministic",
    },
  });
}
