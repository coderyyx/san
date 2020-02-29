const join = require('path').join
const isProd = process.env.NODE_ENV === 'production'
const isOnline = process.env.ONELINE === 'true'
const isAnalyse = process.env.ANALYSE === 'true'

const assetsPath = (...relativePath) => join(__dirname, '..', ...relativePath)
const isFontFile = url => /\.(woff2?|eot|svg|ttf|otf)(\?.*)?$/.test(url)
const isCssSourceMap = false

const getEntry = () => {
  let files = {
    'local': [assetsPath(`src/local`)],
    'admin': [assetsPath(`src/entry`)]
  }
  return Object.keys(files).reduce((entry, key) => ({
    ...entry,
    [key]: isProd ? entry[`${key}`] : entry[`${key}`].concat(['webpack-hot-middleware/client'])
  }), files)
}

const getOutput = () => {
  return Object.assign({
    path: assetsPath('dist'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  }, isProd ? {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
  } : {})
}

const postcssLoader = () => {
  return {
    loader: 'postcss-loader',
  }
}

const lessLoader = () => {
  return {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true,
      modifyVars: {
        "@icon-url": "'/fonts/iconfont'", //iconfont本地化
        '@input-height-base': '28px',
      },
      sourceMap: !isProd && isCssSourceMap
    }
  }
}

const cssLoader = (module = false) => {
  let loader = {
    loader: 'css-loader',
    options: {}
  }
  if (!isProd && isCssSourceMap) loader.options = Object.assign(loader.options, { sourceMap: true, importLoaders: 1 })
  if (module) loader.options = Object.assign(loader.options, { modules: {localIdentName: '[name]__[local]__[hash:base64:5]'} })

  return loader
}

module.exports = {
  isProd,
  isAnalyse,
  isFontFile,
  assetsPath,
  getEntry,
  getOutput,

  postcssLoader,
  lessLoader,
  cssLoader
}

