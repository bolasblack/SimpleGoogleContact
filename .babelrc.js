const pkgConfig = require('./package.json')
const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  plugins: [
    ENV === 'development' ? 'react-hot-loader/babel' : undefined,
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
  ].filter(i => i),
  presets: [
    [
      '@babel/preset-env',
      {
        modules: ENV === 'test' ? 'commonjs' : false,
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
