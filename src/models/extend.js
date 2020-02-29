import modelExtend from 'dva-model-extend'
const model = {
  state: {
    modelExtend: true
  },
  reducers: {
    update (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    setState (state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    * updateState ({ payload = {} }, { put }) {
      yield put({ type: 'update', payload })
    }
  }
}

const pageModel = modelExtend(model, {

  state: {
    pageList: [],
    pagination: {
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 1
    }
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { pageList, pagination } = payload
      return {
        ...state,
        pageList,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }
  }

})

export {
  model,
  pageModel
}
