const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  alias = require('./alias'),
  rules = require('./rules');
const isProd = process.env.NODE_ENV === 'PROD'


module.exports = {
  // 入口
  entry: "./src/index.tsx",
  // 输出
  output: {
    // 打包文件名
    filename: isProd ? "js/[name].[chunkhash].bundle.js" : "[name].bundle.js",
    // 输出路径
    path: path.resolve(__dirname, "../dist"),
    // 资源请求路径
    publicPath: isProd ? "./" : ""
  },
  module: {
    rules
  },
  plugins: [
    // 清除文件
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist']
    }),
    // 提取样式文件
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: !isProd ? '[name].css' : 'style/[name].[contenthash].css',
      chunkFilename: !isProd ? '[id].css' : 'style/[id].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      // title
      title: "Plasma Spark Tower",
      // 模板
      template: "./public/index.html",
      filename: './index.html',
      favicon: './public/favicon.ico',
      chunksSortMode: "none",
      hash: true
    })
  ],
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", ".png", ".jpg"],
    alias
  }
};