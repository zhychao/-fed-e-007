const webpack = require('webpack')
const {merge} = require('webpack-merge')
const baseConfig = require('./webpack.common.js')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',//日志级别
    hot: true,
    open: true,
    contentBase:path.join(__dirname,'./dist'),
    publicPath:'/',
   // overlay: { warnings: false, errors: true },
  },

  module: {
    rules: [
      {
          //css文件处理
        test: /\.css?$/,
        //执行顺序从右到左
        use: ['vue-style-loader','css-loader']
      },
      {
        test: /\.styl(us)?$/,
        use: ['vue-style-loader','css-loader', 'stylus-loader']
      },
      {
        test: /\.(js|vue)$/,
        use: 'eslint-loader',
        enforce: 'pre'
      }, {
        test: /\.less?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      } ,{
        test: /\.vue$/,
        use: 'vue-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,//很重要
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10*1024,
            esModule: false,
          }
        }
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          }
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          }
        }
      }
    ]
  },

  plugins: [
      //热更新
    new webpack.HotModuleReplacementPlugin()
  ]
})