import webpack from 'webpack'
import path from 'path'
import validate from 'webpack-validator'

export default validate({
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['babel?cacheDirectory'],
        exclude: /node_modules\/(?!lightning-core|lightning-core-ui)/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file',
      },
    ],
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',

    // https://github.com/webpack/webpack/issues/1114
    // libraryTarget: 'commonjs2',
  },

  // https://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    root: __dirname,
    extensions: ['', '.js', '.jsx', '.json'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
    alias: {
      'redux-grpc-middlware': 'packages/redux-grpc-middlware',
      'lightning-notifications': 'packages/lightning-notifications',
      'lightning-store': 'packages/lightning-store',
    },
  },

  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ],

  resolveLoader: {
    root: path.resolve(__dirname, 'node_modules'),
  },

  externals: [
    // put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
  ],
})
