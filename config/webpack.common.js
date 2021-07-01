const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const rules = require('./rules')
const isProd = process.env.NODE_ENV === 'PROD'
const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const configFile = path.resolve(__dirname, '../tsconfig.json')

module.exports = {
  // 入口
  entry: './src/index.tsx',
  // 输出
  output: {
    // 打包文件名
    filename: isProd ? 'js/[name].[chunkhash].bundle.js' : '[name].bundle.js',
    // 输出路径
    path: path.resolve(__dirname, '../dist'),
    // 资源请求路径
    publicPath: isProd ? './' : ''
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
      filename: isProd ? 'style/[name].[contenthash].css' : '[name].css',
      chunkFilename: isProd ? 'style/[id].[contenthash].css' : '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
      favicon: './public/favicon.ico',
      chunksSortMode: 'none',
      hash: true
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public/icon'),
          to: path.resolve(__dirname, '../dist/icon')
        },
        {
          from: path.resolve(__dirname, '../public/3d-models'),
          to: path.resolve(__dirname, '../dist/3d-models')
        },
        { 
          from: path.resolve(__dirname, '../public/manifest.json'),
          to: path.resolve(__dirname, '../dist/manifest.json')
        },
      ]
    })
  ],
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json', '.png', '.jpg', '.mp3', '.ogg', 'svg'],
    plugins: [ new TsConfigPathsPlugin({ configFile }) ],
    alias: {
      '@ant-design/icons/lib$': path.resolve(__dirname, '../src/constant/icons.ts')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',   // initial、async和all
      minSize: 30000,   // 形成一个新代码块最小的体积
      maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
      maxInitialRequests: 3,   // 最大初始化请求数
      automaticNameDelimiter: '~',   // 打包分割符
      name: true,
      cacheGroups: {
        vendors: { // 基本框架
          chunks: 'all',
          test: /(antd|react|react-dom|react-dom-router|redux|react-loadable)/,
          priority: 100,
          name: 'vendors',
        },
        d3Vendor: { // 将体积较大的d3单独提取包，指定页面需要的时候再异步加载
          test: /d3/,
          priority: 100, // 设置高于async-commons，避免打包到async-common中
          name: 'd3Vendor',
          chunks: 'async'
        },
        echartsVendor: { // 异步加载echarts包
          test: /(echarts|zrender)/,
          priority: 100, // 高于async-commons优先级
          name: 'echartsVendor',
          chunks: 'async'
        },
        trackingVendor: {
          test: /tracking/,
          priority: 100,
          name: 'trackingVendor',
          chunks: 'async'
        },
        flubberVendor: {
          test: /flubber/,
          priority: 100,
          name: 'flubberVendor',
          chunks: 'async'
        },
        particle: {
          test: /react-particles-js/,
          priority: 100,
          name: 'particleJsVendor',
          chunks: 'async'
        },
        matterjs: {
          test: /matter-js/,
          priority: 100,
          name: 'matterjsVendor',
          chunks: 'async'
        },
        three: {
          test: /three/,
          priority: 100,
          name: 'threejsVendor',
          chunks: 'async'
        },
      }
    }
  },
  stats: { children: false }
}
