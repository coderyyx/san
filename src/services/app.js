import request from 'utils/request'

export async function getLabList (params) {
  return request({
    mock: false,
    url: '/getLabList',
    method: 'GET',
    params
  })
}
let labList = []
export function * requestLabList (params) {
  if (!labList.length) {
    const resp = yield getLabList()
    if (resp.data && !Array.isArray(resp.data)) {
      resp.data = [resp.data]
    }
    labList = resp.data
  }
  return labList
}

export async function postSystemRegister (params) {
  return request({
    mock: false,
    url: '/systemRegister',
    method: 'POST',
    params
  })
}

// 移动端报告详情
export async function getReportDetailByAuto (params) {
  return request({
    url: '/report/getReportDetailByAuto',
    method: 'GET',
    params
  })
}
