const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

const helper = require('./helper')
const isProd = helper.isProd

const webpackConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'cheap-module-source-map',
  // entry: helper.getEntry(),
  entry: [helper.assetsPath(`src/entry`), 'webpack-hot-middleware/client'],
  output: helper.getOutput(),
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '@': helper.assetsPath('src'),
      'utils': helper.assetsPath('src/utils'),
    }
  },
  module: {
    rules: [
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        // cacheDirectory: true,
      },
      // include: helper.assetsPath('src'),
      // exclude: /node_modules/,
    },
    {
      test: /\.(css|less)$/,
      include: /node_modules|antd\.less/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
        helper.cssLoader(),
        helper.postcssLoader(),
        helper.lessLoader()
      ]
    },
    {
      test: /\.(css|less)$/,
      exclude: /node_modules|antd\.less|themes/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
        helper.cssLoader(true),
        helper.postcssLoader(),
        helper.lessLoader()
      ]
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]',
        publicPath: '../'
      }
    },
    {
      test: /\.(woff2?|woff|eot|svg|ttf|otf|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: url => `${helper.isFontFile(url) ? 'fonts' : 'media'}/${url}`,
      }
    },
    {
      test: /\.exe$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: url => `${helper.isFontFile(url) ? 'fonts' : 'media'}/${url}`,
      }
    }]
  },
  plugins: [
    new AntdDayjsWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      minify: isProd ? {
        html5: false,
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      } : {},
      filename: 'index.html',
      template: helper.assetsPath('public/index.html')
    }),
    new ProgressBarPlugin(),
  ].concat(isProd ? [] : [
    new webpack.HotModuleReplacementPlugin(),
  ]),
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
}

if(isProd) {
  webpackConfig.plugins.push(new HardSourceWebpackPlugin())
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    })
  )
  webpackConfig.optimization = {
    runtimeChunk: {
      name: 'manifest'
    },
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console:  'drop_console'
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    // splitChunks: {
    //   chunks: 'all',
    //   // chunks: 'async',
    //   minSize: 30000,
    //   // maxSize: 5000000,
    //   minChunks: 1,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   name: false,
    //   cacheGroups: {
    //     // 基础类库
    //     // vendors: {
    //     //   name: 'vendor',
    //     //   test: /[\\/]node_modules[\\/]/,
    //     //   priority: 10,
    //     //   chunks: 'initial',
    //     // },
    //     // // UI库
    //     // antdUI: {
    //     //   name: 'antd',
    //     //   priority: 20,
    //     //   test: /[\\/]node_modules[\\/]antd[\\/]/,
    //     // },
    //     // // 自定义组件
    //     // commons: {
    //     //   name: 'chunk-comomns',
    //     //   test: /src\/components/,
    //     //   minChunks: 3,
    //     //   priority: 2,
    //     //   reuseExistingChunk: true,
    //     // },
    //   }
    // }
  }
}

helper.isAnalyse && webpackConfig.plugins.push(new BundleAnalyzerPlugin({generateStatsFile: true}))
module.exports = webpackConfig

