/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-01-06 10:55:55
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-23 13:46:43
 * @content: edit your page content
 */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const Dotenv = require('dotenv-webpack');
var proxy = require('http-proxy-middleware');
module.exports = env => {
  return merge(common(env), {
    mode: 'production',
    // devtool: 'inline-source-map',
    output: {
      publicPath: '/',
      filename: "js/[name].js",
    },
    plugins: [
      new Dotenv({
        path: path.resolve(__dirname, `.env.product`)
      }),
    ],
    optimization: {
      moduleIds: "deterministic",
    },
  });
}
