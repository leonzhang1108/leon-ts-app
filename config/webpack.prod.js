const merge = require("webpack-merge"),
  common = require("./webpack.common.js"),
  OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  // 原始源代码
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.(png|svg|jpe?g|gif)$/i, // 图片处理
      use: [{
        loader: 'image-webpack-loader',
        options: {
          // Compress JPEG images
          mozjpeg: {
            progressive: true,
            quality: 65
          },
          // Compress PNG images
          optipng: {
            enabled: false
          },
          //  Compress PNG images
          pngquant: {
            quality: '65-90',
            speed: 4
          },
          // Compress GIF images
          gifsicle: {
            interlaced: false
          }
        }
      }]
    }]
  },
  plugins: [
    new OptimizeCssAssetsPlugin()
  ]
});