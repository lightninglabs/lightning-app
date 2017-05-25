import path from 'path'
import webpack from 'webpack'
import validate from 'webpack-validator'
import merge from 'webpack-merge'
import baseConfig from './webpack.config.base'

const port = process.env.PORT || 4152

export default validate(merge(baseConfig, {
  debug: true,
  devtool: 'eval',

  entry: {
    app: [
      `webpack-hot-middleware/client?path=http://localhost:${ port }/__webpack_hmr`,
      'babel-polyfill',
      './index',
    ],
    vendor: ['react', 'redux', 'lodash'],
  },

  output: {
    publicPath: `http://localhost:${ port }/dist/`,
  },

  module: {
    loaders: [
      {
        test: /.css$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap',
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),
  ],
  resolve: {
    alias: {
      // 'react$': path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
      'lodash$': path.resolve(__dirname, './node_modules/lodash/lodash.min.js'),
    },
  },
  cache: true,

  target: 'electron-renderer',
}))
