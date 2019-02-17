/* config-overrides.js */
const tsImportPluginFactory = require('ts-import-plugin')
const { getLoader } = require("react-app-rewired")
const rewireLess = require('react-app-rewire-less')
const path = require('path')
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
module.exports = function override(config, env) {
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  )

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [ tsImportPluginFactory({
        libraryDirectory: 'es',
        libraryName: 'antd',
        style: true,
      }) ]
    })
  }

  // 修改基础样式
  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true
    // modifyVars: { 
    //   "@primary-color": "#1DA57A" 
    // },
  })(config, env)  

  config.plugins.push(
    new HappyPack({
      id: 'happyBabel',
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }],
      threadPool: happyThreadPool,
      verbose: true
    })
  )

  return config
}