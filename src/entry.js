import 'core-js/stable'
import 'regenerator-runtime/runtime'
import dva from 'dva'
import createLoading from 'dva-loading'
import nprogressDva from './middlewares/nprogress-dva'
import { message } from 'antd'
import { createBrowserHistory } from 'history'

// ================= 替换 moment =================
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
//= ================= 替换 moment =================

// 1. Initialize
// Create dva-core instance

const app = dva({
  history: createBrowserHistory(),
  onError (error) {
    message.error(error.message)
  }
})

app.use(createLoading({
  effects: true
}))
app.use(nprogressDva)

// 2. Model
app.model(require('./models/login').default)

// 3. Router
app.router(require('./routes'))

// 4. Start
app.start('#root')

// 缓存dva实例
window.DVA_INSTANCE = app
