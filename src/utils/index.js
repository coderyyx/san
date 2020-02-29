import React from 'react'
import ReactLoading from 'react-loading'

const isDebug = false
const isPord = true

export function deepCopy (source) {
  const result = Array.isArray(source) ? [] : {}
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.bind(source, key)) {
      result[key] = typeof source[key] === 'object' && source[key] !== null && !(source[key] instanceof RegExp) ? deepCopy(source[key]) : source[key]
    }
  }
  return result
}

export function Debug (msg, color = 'black') {
  const debug = (msg = '') => {
    console.log('%c ====Debug====> ' + msg, `color:${color}`)
  }
  if (!isDebug || isPord) {
    return
  }
  if (typeof (msg) === 'string') {
    debug(msg)
  } else if (typeof (msg) === 'object') {
    debug('object')
    console.log(msg)
  } else {
    debug(typeof (msg))
    console.log(msg)
  }
}

export const red = (msg) => Debug(msg, 'red')
export const green = (msg) => Debug(msg, 'green')
export const blue = (msg) => Debug(msg, 'blue')

export function isSucc (resp) {
  const code = resp && parseInt(resp.code)
  return code && !isNaN(code) && code === 200 && resp.message === 'SUCCESS' && resp.data !== undefined
}

export function getRect (element) {
  const xy = element.getBoundingClientRect()
  const top = xy.top - document.documentElement.clientTop + document.documentElement.scrollTop // document.documentElement.clientTop 在IE67中始终为2，其他高级点的浏览器为0
  const bottom = xy.bottom
  const left = xy.left - document.documentElement.clientLeft + document.documentElement.scrollLeft // document.documentElement.clientLeft 在IE67中始终为2，其他高级点的浏览器为0
  const right = xy.right
  const width = xy.width || right - left // IE67不存在width 使用right - left获得
  const height = xy.height || bottom - top

  return { top, right, bottom, left, width, height }
}

export function hasClass (el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass (el, className) {
  if (!el) {
    return
  }
  if (hasClass(el, className)) {
    return
  }
  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass (el, className) {
  let el_class = ' ' + el.className + ' ' // 获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
  el_class = el_class.replace(/(\s+)/gi, ' ') // 将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
  let removed = el_class.replace(' ' + className + ' ', ' ') // 在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
  removed = removed.replace(/(^\s+)|(\s+$)/g, '') // 去掉首尾空格. ex) 'bcd ' -> 'bcd'
  el.className = removed // 替换原来的 class.
}

export function getDpi () {
  if (!window.globalDpi) {
    const arrDPI = []
    if (window.screen.deviceXDPI) {
      arrDPI[0] = window.screen.deviceXDPI
      arrDPI[1] = window.screen.deviceYDPI
    } else {
      const tmpNode = document.createElement('DIV')
      tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
      document.body.appendChild(tmpNode)
      arrDPI[0] = parseInt(tmpNode.offsetWidth)
      arrDPI[1] = parseInt(tmpNode.offsetHeight)
      tmpNode.parentNode.removeChild(tmpNode)
    }
    window.globalDpi = arrDPI[0] || 96
  }
  return window.globalDpi
}

export function px2mm (value, dpi) {
  if (!dpi) dpi = getDpi()
  const inch = value / dpi
  return inch * 25.4
}

export function mm2px (value, dpi) {
  if (!dpi) dpi = getDpi()
  const inch = value / 25.4
  return inch * dpi
}

export function sortReports (sortIds, reports) {
  const reportHash = reports.reduce((result, report) => {
    result[report.reportId] = report
    return result
  }, {})
  return sortIds.map(reportId => reportHash[reportId])
}

// chrome浏览器版本判断
export function isChrome () {
  if (window.isChrome === undefined) {
    const Index = window.navigator.userAgent.indexOf('Chrome')
    const userAgent = window.navigator.userAgent
    const chromeVersion = userAgent.slice(Index + 7, Index + 9)
    window.isChrome = chromeVersion < 50
  }
  return window.isChrome
}

// A4的尺寸是210mm×297mm
// A5的尺寸是148mm×210mm
export function getSize (type, mmWidth, mmHeight) {
  const dpi = getDpi()
  if (type === 'A4') { mmWidth = 210; mmHeight = 297 }
  if (type === 'A5') { mmWidth = 210; mmHeight = 148 }
  let pxWidth = mm2px(mmWidth, dpi)
  let pxHeight = mm2px(mmHeight, dpi)
  pxWidth = Math.floor(pxWidth / 10) * 10
  pxHeight = Math.floor(pxHeight / 10) * 10
  return [pxWidth, pxHeight]
}

export function getFunValue (code, currentValue, vars = {}, cb) {
  let replacedCode = code.replace(/\$_([\w]+)/g, 'vars[\'$1\']')
  replacedCode = replacedCode.replace(/\$_/g, 'value')
  try {
    const func = new Function(['value', 'vars'], replacedCode) // eslint-disable-line no-new-func
    const result = func(currentValue, vars)
    cb && cb(result, null)
  } catch (err) {
    cb && cb(null, err)
  }
}

// 对应function
// function (value, vars) {
//   var idx = null;
//   if(vars['trunId'] === 'ed126fdaab3c47d18db78f466333a67b'){ idx = 0; return idx };
//   if(vars['trunId'] === '3d6100b33500434bbf49192e78a49b53'){ idx = 1; return idx };
//   if(vars['trunId'] === '88ac334516614b9f890ba9ade9802a65'){ idx = 2; return idx };
//   return idx;
// }
export function getDynamicValue (dataList, currentValue, vars = {}, cb) {
  const conditions = ['var idx = null']
  try {
    dataList.forEach((cond, index) => {
      let cond2 = cond.key.replace(/\$_([\w]+)/g, 'vars[\'$1\']')
      cond2 = cond2.replace(/\$_/g, 'value')
      conditions.push(`if(${cond2}){ idx = ${index}; return idx }`)
    })
    conditions.push('return idx;')
    const proc = conditions.join(';')
    // console.log(proc)
    const func = new Function(['value', 'vars'], proc) // eslint-disable-line no-new-func
    const idx = func(currentValue, vars)
    const dataItem = dataList[idx]
    let result = null
    if (idx !== null) {
      result = (dataItem && dataItem.notHold && 'notHold' || dataItem && dataItem.value)
    } else {
      result = currentValue
    }
    cb && cb(result, null)
  } catch (err) {
    console.log(err)
    cb && cb(null, err)
  }
}

export function renderLoading (onClose) {
  return <div className='reactLoading'>
    <ReactLoading type={'spin'} color={'rgb(16, 142, 233)'} height={80} width={80} />
    <span>请稍候...</span>
    { onClose && <div className='closeBtn' onClick={onClose}>关闭</div> }
  </div>
}

/**
 * 验证文件类型
 * @param {File} blob 文件对象
 * @param {function} done 返回格式
 */
export const vaildImgType = (blob, done) => {
  var reader = new FileReader()
  reader.onload = () => {
    var buf = new DataView(reader.result)
    done(buf.byteLength > 1 ? ({
      ffd8: 'jpg',
      8950: 'png',
      4749: 'gif',
      '424d': 'bmp'
    })[`${buf.getUint16(0).toString(16)}`] : undefined)
  }
  reader.readAsArrayBuffer(blob)
}
