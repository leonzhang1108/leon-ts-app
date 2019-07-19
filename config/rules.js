const path = require('path'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  tsImportPluginFactory = require('ts-import-plugin');

module.exports = [
  {
    test: /\.js$/,
    loader: "babel-loader",
    exclude: /node_modules/
  },
  // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
  {
    test: /\.tsx?$/,
    loader: "awesome-typescript-loader",
    options: {
      useBabel: false, // !important!
      getCustomTransformers: () => ({
        before: [tsImportPluginFactory({
          libraryName: 'antd',
          libraryDirectory: 'lib',
          style: true
        })]
      }),
    },
    exclude: [
      /node_modules\/mutationobserver-shim/g,
    ]
  },
  {
    test: /\.s(a|c)ss$/, // 匹配文件
    use: [process.env.NODE_ENV === 'PROD' ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          // you can specify a publicPath here
          // by default it use publicPath in webpackOptions.output
          publicPath: '../'
        }
      } : 'style-loader', // 使用<style>将css-loader内部样式注入到我们的HTML页面,
      'css-loader', // 加载.css文件将其转换为JS模块
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: './' // 写到目录即可，文件名强制要求是postcss.config.js
          }
        }
      }, 'sass-loader'
    ]
  },
  {
    test: /\.(le|c)ss$/, // 匹配文件
    exclude: /node_modules/,
    use: [process.env.NODE_ENV === 'PROD' ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          // you can specify a publicPath here
          // by default it use publicPath in webpackOptions.output
          publicPath: '../'
        }
      } : 'style-loader', // 使用<style>将css-loader内部样式注入到我们的HTML页面,
      'css-loader', // 加载.css文件将其转换为JS模块
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: './' // 写到目录即可，文件名强制要求是postcss.config.js
          }
        }
      }, 
      {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true
        }
      }
    ]
  },
  {
    test: /antd.*\.less$/, // 匹配文件
    use: [process.env.NODE_ENV === 'PROD' ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          // you can specify a publicPath here
          // by default it use publicPath in webpackOptions.output
          publicPath: '../'
        }
      } : 'style-loader', // 使用<style>将css-loader内部样式注入到我们的HTML页面,
      'css-loader', // 加载.css文件将其转换为JS模块
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: './' // 写到目录即可，文件名强制要求是postcss.config.js
          }
        }
      },
      {
        loader: "less-loader",
        options: {
          javascriptEnabled: true, //是否处理js引入less
        }
      },
    ]
  },
  {
    test: /\.(html)$/,
    use: {
      loader: "html-loader",
      options: {
        attrs: ["img:src", "img:data-src", "audio:src"],
        minimize: true
      }
    }
  },
  {
    test: /\.(png|svg|jpe?g|gif)$/i, // 图片处理
    use: [{
      loader: "url-loader",
      options: {
        name: "[name].[hash:5].[ext]",
        limit: 20 * 1024, // size <= 50kb
        outputPath: "img"
      }
    }]
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/, // 字体处理
    use: ["file-loader"]
  },
  {
    test: /\.(csv|tsv)$/, // 文件处理
    use: ["csv-loader"]
  },
  {
    test: /\.xml$/, // 文件处理
    use: ["xml-loader"]
  }
]