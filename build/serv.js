const Koa = require('koa')
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const history = require('koa-connect-history-api-fallback')
const webpackcfg = require('./webpack.config')

const app = new Koa()
const compiler = webpack(webpackcfg)
const koaHotMiddleware = webpackHotMiddleware(compiler)
const koaDevMiddleware = webpackDevMiddleware(compiler, {
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: true,
    assets: true
  },
  publicPath: '/',
})

const port = process.env.PORT

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    koaHotMiddleware.publish({ action: 'reload' })
  })
})
app.use(history({}))
app.use(async (ctx, next) => {
  await koaDevMiddleware(ctx.req, {
    end: (content) => {
      ctx.body = content
    },
    setHeader: (name, value) => {
      ctx.set(name, value)
    }
  }, next)
})
app.use(async (ctx, next) => {
  await new Promise((resolve) => koaHotMiddleware(ctx.req, ctx.res, resolve))
  next()
})
// app.use(proxyMiddleware)
// app.get('*', function (request, response){
//   response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
// })
app.listen(port, () => {
  koaDevMiddleware.waitUntilValid(function () {
    console.log(`> Listening at http://localhost:${port}\n`)
  })
})
