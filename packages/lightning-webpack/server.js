/* eslint-disable no-console */

import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import config from './webpack.config.development'

const app = express()
const compiler = webpack(config)
const PORT = process.env.PORT || 4152

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
}))

app.use(webpackHotMiddleware(compiler))

app.listen(PORT, 'localhost', (err) => {
  if (err) { console.error(err); return }
  console.log('============================')
  console.log()
  console.log('   STARTING LIGHTNING APP   ')
  console.log()
  console.log('============================')
  // console.log(`http://localhost:${ PORT }`)
})
