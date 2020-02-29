const fs = require('fs')
const path = require('path')
const less = require('less')

const lessContent = fs.readFileSync(path.resolve(__dirname, '../src/themes/index.less'), 'utf8')

function lessToCss (data, fileName) {
  return new Promise((resolve, reject) => {
    less.render(data, {
      paths: [path.resolve(__dirname, '../src/themes')]
    }).then((output) => {
      fs.writeFileSync(path.resolve(__dirname, '../public/' + fileName + '.css'), output.css)
      resolve()
    }).catch(err => {
      console.log(err)
    })
  })
}

lessToCss(lessContent, 'normal').then(() => {
  const content = lessContent.replace('@import \'./normal.less\';', '@import \'./blue.less\';')
  lessToCss(content, 'blue').then(() => {
    const content = lessContent.replace('@import \'./normal.less\';', '@import \'./pink.less\';')
    lessToCss(content, 'pink')
  })
}).catch(err => {
  console.log(err)
})
