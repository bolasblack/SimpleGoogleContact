import path from 'path'

import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {} from 'webpack-dev-server'
import { config as baseConfig } from './webpack.config.base'

export function getStandardConfig(): Partial<webpack.Configuration> {
  return {
    plugins: [
      new webpack.WatchIgnorePlugin([/node_modules/]),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      }),
      new CleanWebpackPlugin(['dist'], {
        root: path.resolve(__dirname, '../'),
        verbose: true,
      }),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        inject: 'head',
        chunks: ['main'],
      }),
    ],
    optimization: {
      namedChunks: true,
      namedModules: true,
      // concatenateModules 选项会改掉模块里变量的名字，但有些地方可能
      // 会用到 Function#name ，所以只好关掉
      concatenateModules: false,
    },
    devServer: {
      host: '127.0.0.1',
      port: 9327,
      contentBase: path.resolve(__dirname, '../public'),
      publicPath: baseConfig.output!.publicPath,
    },
  }
}

export default () => webpackMerge(baseConfig, getStandardConfig())
