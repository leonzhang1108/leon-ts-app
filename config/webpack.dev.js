const merge = require("webpack-merge"),
  common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  // 原始源代码（仅限行）
  devtool: "cheap-module-eval-source-map"
});