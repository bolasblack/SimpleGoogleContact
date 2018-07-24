const path = require('path')
require('ts-node').register({
  files: true,
  project: path.resolve(__dirname, "../tsconfig.test.json"),
})

module.exports = {
  webpack: require('./webpack.config.ts').default,
}
