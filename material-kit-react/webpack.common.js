const HtmlWebpackPlugin = require("html-webpack-plugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

// css/css module 正则表达式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
// sass/sass module 正则表达式
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
// less/less module 正则表达式
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
// stylus/stylus module 正则表达式
const stylRegex = /\.styl$/;
const stylModuleRegex = /\.module\.styl$/;
// historyApiFallback: { index: "/*", disableDotRule: false },
module.exports = () => {
  return {
    entry: {
      index: './src/index.tsx'
    },
    target: ['web', 'es5'],
    output: {
      filename: '[name].[contenthash].min.js',
      path: path.resolve(__dirname, "dist/"),
    },
    plugins: [
      // 生成 index.html
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./src/index.html",
        favicon:'./src/assert/icondisk.png',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: '> 2.5%', // https://github.com/browserslist/browserslist
                  },
                ],
                ['@babel/preset-react'],
                ['@babel/typescript'],
              ],
              sourceType: 'unambiguous',
            },
          },
        },
        {
          test: /\.(jsx|js)?$/,
          use: ["babel-loader"],
          include: path.resolve(__dirname, 'src'),
        },
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: ["style-loader", "css-loader", "postcss-loader"]
        },
        {
          test: cssModuleRegex,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                }
              }
            },
            "postcss-loader"
          ]
        },
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
        },
        {
          test: sassModuleRegex,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                }
              }
            },
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          test: stylRegex,
          exclude: stylModuleRegex,
          use: ["style-loader", "css-loader", "postcss-loader", "stylus-loader"]
        },
        {
          test: stylModuleRegex,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                }
              }
            },
            "postcss-loader",
            "stylus-loader"
          ]
        },
       
        {
          test: /\.less$/,
          use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "less-loader" // compiles Less to CSS
          }]
      },
        {
          test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    }
  }
}
