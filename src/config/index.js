
import normarlLogo from '@/assets/admin/normal.png'
import blueLogo from '@/assets/admin/blue.png'
import pinkLogo from '@/assets/admin/pink.png'

const development = {
  url: 'http://172.16.26.99:8000' // lqq
}

const test = {
  url: ''
}

const production = {
  url: window.local && window.local.domain
}

const domains = {
  development,
  test,
  production
}

const env = process.env.TEST_ENV === 'true' ? test : process.env.NODE_ENV

const domain = domains[env].url

const basicInfo = {
  name: '111',
  prefix: '',
  footerText: '版权所有 © biosan',
  logoSrcMap: {
    normal: normarlLogo,
    pink: pinkLogo,
    blue: blueLogo
  },
  logoText: '1',
  version: '1.x'
}

export {
  domain,
  basicInfo,
}
