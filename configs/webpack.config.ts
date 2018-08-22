import path from 'path'

import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import EventHooksPlugin from 'event-hooks-webpack-plugin'
import { PromiseTask } from 'event-hooks-webpack-plugin/lib/tasks'
import { InterpolateWebpackPlugin } from 'interpolate-webpack-plugin'
import {} from 'webpack-dev-server'
import { config as baseConfig } from './webpack.config.base'

import { generateActionsRequireFile } from '../scripts/code_generators'

const interpolateWebpackPlugin = new InterpolateWebpackPlugin()

export async function getStandardConfig(): Promise<
  Partial<webpack.Configuration>
> {
  return {
    plugins: [
      new webpack.WatchIgnorePlugin([/node_modules/]),
      new CleanWebpackPlugin(['dist'], {
        root: path.resolve(__dirname, '../'),
        verbose: true,
      }),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        inject: 'head',
        chunks: ['main'],
      }),
      new CopyWebpackPlugin([
        {
          from: 'public',
          to: '.',
          ignore: ['index.html'],
        },
      ]),
      interpolateWebpackPlugin,
      new webpack.DefinePlugin({
        ...(await interpolateWebpackPlugin.definePlugin()),
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      }),
      new EventHooksPlugin({
        watchRun: new PromiseTask(async () => {
          await generateActionsRequireFile()
        }),
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

export default async () => webpackMerge(baseConfig, await getStandardConfig())
