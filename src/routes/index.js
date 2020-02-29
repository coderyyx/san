import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { Route, Switch, routerRedux } from 'dva/router'
import LoginLayout from '@/Layout/LoginLayout'
import routes from './router'

const { ConnectedRouter } = routerRedux

const RouterConfig = ({ history, app }) => {
  return (
    <ConnectedRouter history={history}>
      <ConfigProvider locale={zhCN}>
        <Switch>
          <Route path='/' component={LoginLayout} />
        </Switch>
      </ConfigProvider>
    </ConnectedRouter>
  )
}

export default RouterConfig

export {
  routes
}
