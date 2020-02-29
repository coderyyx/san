const MOCK_CONFIG = require('./src/mocks/mock')

const proxy = {
  'GET /api/test': {
    code: 200,
    result: 'success'
  }
}

module.exports = Object.assign(proxy, MOCK_CONFIG)
