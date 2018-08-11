import path from 'path'
import webpack, { Configuration } from 'webpack'
import Sass from 'sass'

export const NODE_ENV = process.env.NODE_ENV || 'development'

export const isDev = NODE_ENV === 'development'

export const config: Configuration = {
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  context: path.resolve(__dirname, '..'),
  devtool: 'cheap-source-map',
  node: {
    __filename: true,
    __dirname: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    mainFields: ['typescript:main', 'jsnext:main', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, '../src')],
        use: ['ts-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: Sass,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isDev ? '[name].[hash].js' : '[name].[chunkhash].js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      regeneratorRuntime: 'regenerator-runtime',
      React: 'react',
    }),
  ],
}
