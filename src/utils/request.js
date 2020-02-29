import axios from 'axios'
import { domain } from '@/config'
import { isSucc } from 'utils'
import { message } from 'antd'

const AllowEmptyParamsUrl = [
  '/item/postItemOrParent',
  '/lab/postSampleRegisterInfo',
  '/config/postRegisteredBackFill',
  '/sampleManage/postPatientSampleInfo',
  '/sampleManage/postSampleReportDetail'
]

const fetch = axios.create({
  baseURL: domain,
  timeout: 1000 * 60 * 5,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  transformRequest: [(params) => {
    if (params instanceof FormData) {
      return params
    }
    const ret = []
    for (const it in params) {
      let items = params[it] || params[it] === 0 ? params[it] : ''
      items = typeof items === 'object' ? JSON.stringify(items) : items
      ret.push(`${encodeURIComponent(it)}=${encodeURIComponent(items)}&`)
    }
    return ret.join('')
  }]
})

function isParamsNeedToken (url) {
  return !/login|oauth/gi.test(url)
}

function filterEmptyParamsUrl (url) {
  return AllowEmptyParamsUrl.some(_ => _ === url)
}

// 定时器
let timer
// 当前时间
let last = Date.now()

/**
 *
 * @param {Object} options url , method , params , type
 * @return {Object}
 */
export default function request (options = {}) {
  let opt = {
    url: options.url,
    method: options.method || 'get'
  }
  options.params = options.params || {}
  // is need Token
  if (isParamsNeedToken(options.url)) {
    options.params.usertoken = sessionStorage.getItem('userToken') || ''
    options.params.labId = sessionStorage.getItem('currentLab') && JSON.parse(sessionStorage.getItem('currentLab')).departmentId || ''
  }
  if (options.type === 'file') {
    opt = {
      ...opt,
      ...requestFile(options)
    }
  } else {
    opt = {
      ...opt,
      ...requestNormal(options)
    }
  }
  return promiseHttp(opt)
}

function requestNormal (options) {
  const opt = {}
  if ((options.method).toLowerCase() === 'get') {
    opt.params = options.params
  } else {
    const data = options.params
    // 允许特定url传空字段
    if (opt.params && !filterEmptyParamsUrl(options.url)) {
      Object.keys(options.params).forEach(key => {
        if (options.params[key]) {
          data[key] = options.params[key]
        }
      })
    }
    opt.data = data
  }
  return opt
}

function requestFile (options) {
  const opt = {}
  const formData = new FormData()
  for (const attr in options.params) {
    if (options.multiFiles && attr === 'files') {
      for (let i = 0; i < options.params[attr].length; i++) {
        formData.append(attr, options.params[attr][i])
      }
    } else {
      formData.append(attr, options.params[attr])
    }
  }
  opt.data = formData
  opt.headers = { 'Content-Type': 'multipart/form-data' }
  return opt
}

function promiseHttp (options) {
  return fetch(options).then((response) => {
    const now = Date.now()
    if (response.data && !isSucc(response.data)) {
      if (response.data.code === 300 && response.data.data === '用户未登录') {
        if (now > last + 250) {
          clearTimeout(timer)
          timer = setTimeout(() => {
            window.DVA_INSTANCE._store.dispatch({ type: 'app/logout' })
          }, 4)
        } else {
          last = now
        }
      } else {
        if (options.data.command === 'LAB_NO_INPUT' || options.data.sampleExternalIds) {
          if (response.data.code === 400) {
            return response.data
          }
        } else if (options.url.indexOf('/lab/exportSampleFormatCheck') > -1) {
          return response && response.data
        } else {
          const msg = response.data && response.data.data || '未知错误，请重试!'
          message.error(msg)
        }
      }
      return undefined
    }
    return response && response.data
  }).catch((error) => {
    // 网络或系统错误抛出
    const msg = error.message || '网络错误'
    message.error(msg)
  })
}
