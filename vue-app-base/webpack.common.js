//yarn add html-webpack-plugin --dev 自动生成HTML插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
//插件加载
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    //打包入口文件
    entry: path.join(__dirname,'./src/main.js'),
    output: {
        //打包输出路径
        path: path.join(__dirname,'./dist'),
        //输出，
        filename: '[name].[hash:6].js'
    },
    //配置项通过别名来把原导入路径映射成一个新的导入路径
    resolve: {
        //在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在
        extensions: ['.js', '.vue', '.json'],//用于配置在尝试过程中用到的后缀列表
        alias: {
            'assets':path.join(__dirname,'assets'),
            'pages': path.join(__dirname,'src/pages'),
            'public':path.join(__dirname,'public'),
            'components':path.join(__dirname,'src/components')
        }
    },
    module: {
        rules: [
            {
                //yarn add eslint-loader --dev
                test: /\.(js|vue)$/,
                use: 'eslint-loader',
                enforce: 'pre'
            }
        ]
    },

    plugins: [
        //自动生成HTML插件
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new VueLoaderPlugin()
    ]
}