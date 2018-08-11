const pkgConfig = require('./package.json')
const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  plugins: [
    [
      'transform-imports',
      {
        ramda: {
          transform: 'ramda/es/${member}',
          preventFullImport: true,
        },
        lodash: {
          transform: 'lodash/${member}',
          preventFullImport: true,
        },
      },
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
        targets: {
          browsers: [
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'last 2 Edge versions',
            'Safari >= 9',
          ],
        },
      },
    ],
  ],
}
