import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import { compose as composeRewire } from 'react-app-rewired'
import rewireSass from 'react-app-rewire-scss'
import rewireTs from 'react-app-rewire-typescript'

export default (
  config: webpack.Configuration,
  env: string,
): webpack.Configuration => {
  const rewires = composeRewire(rewireSass, rewireTs)

  return webpackMerge(rewires(config, env), {
    devtool: 'cheap-source-map',
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react',
      }),
    ],
  })
}
