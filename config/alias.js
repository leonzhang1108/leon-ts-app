const path = require('path');

// 创建 import 或 require 的别名，来确保模块引入变得更简单
module.exports = {
  "@cpt": path.resolve(__dirname, "../src/components"),
  "@constant": path.resolve(__dirname, "../src/constant"),
  "@pages": path.resolve(__dirname, "../src/pages"),
  "@models": path.resolve(__dirname, "../src/models"),
  "@utils": path.resolve(__dirname, "../src/utils"),
  "@reducers": path.resolve(__dirname, "../src/reducers"),
  "@actions": path.resolve(__dirname, "../src/actions"),
  "@img": path.resolve(__dirname, "../src/img"),
  "@interface": path.resolve(__dirname, "../src/interface"),
};