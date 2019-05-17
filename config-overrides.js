const {
    override,
    fixBabelImports,
    addLessLoader,
    addDecoratorsLegacy,
    addWebpackAlias,
    enableEslintTypescript
  } = require('customize-cra')
  const { CustomizeAntd } = require('./src/config/antd')
  
  module.exports = override(
    enableEslintTypescript(),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: CustomizeAntd
    }),
    addDecoratorsLegacy(),
    addWebpackAlias({
    })
  )