import webpack from 'webpack'

export default (config: webpack.Configuration) => ({
  ...config,
  plugins: config.plugins!.concat(new webpack.ProvidePlugin({
    React: 'react',
  })),
})
