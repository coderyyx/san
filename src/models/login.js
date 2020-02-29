import modelExtend from 'dva-model-extend'
import { model } from './extend'
import { isSucc } from 'utils'
import { getLabList } from '@/services/app'
// import { routerRedux } from 'dva/router'

export default modelExtend(model, {
  namespace: 'login',
  state: {
    browerToken: ''
  },
  reducers: {}
})
