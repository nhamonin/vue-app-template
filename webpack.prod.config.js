const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
  entry: [
    "./dist/js/index.js",
    './dist/scss/index.scss'
  ],
  output: {
    path: path.resolve(__dirname, './src'),
    filename: "js/app.[hash].js",
    publicPath: './src'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  },
  mode: 'production',
  module: {
    rules: [{
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: ExtractTextPlugin.extract({
          use: [{
              loader: 'css-loader',
              options: {
                url: true
              }
            },
            {
              loader: "resolve-url-loader"
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './dist/imgs',
            publicPath: './src/imgs'
          }
        }]
      },
      {
        test: /\.(gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.svg$/,
        use: [{
            loader: 'svg-loader'
          },
          {
            loader: 'svg-inline-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/main.[hash].css',
      allChunks: true
    }),
    new CopyWebpackPlugin([{
        from: './dist/fonts',
        to: '../src/fonts'
      },
      {
        from: './dist/icons',
        to: '../src/icons'
      },
      {
        from: './dist/imgs',
        to: '../src/imgs'
      }
    ]),
    new VueLoaderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      minify: true,
      template: './index.template.ejs',
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        }
      }
    })
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      img: path.resolve(__dirname, 'src/imgs'),
      icon: path.resolve(__dirname, 'src/icons')
    }
  },
  node: {
    module: 'empty',
    fsevents: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};