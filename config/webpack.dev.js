const webpackMerge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = webpackMerge.merge(common, {
  mode: 'development',
  // 原始源代码（仅限行）
  devtool: 'cheap-module-eval-source-map',
})
