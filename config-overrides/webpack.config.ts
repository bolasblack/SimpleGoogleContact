import webpack from 'webpack'

export default (config: webpack.Configuration): webpack.Configuration => ({
  ...config,
  devtool: 'cheap-source-map',
  plugins: config.plugins!.concat(new webpack.ProvidePlugin({
    React: 'react',
  })),
})
