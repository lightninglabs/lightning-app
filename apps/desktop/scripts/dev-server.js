/* eslint-disable no-console */
import express from 'express'
import webpack from 'webpack'
import path from 'path'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import config from '../webpack.config.development'

const app = express()
const compiler = webpack(config)
const PORT = process.env.PORT || 4152

const middleware = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
})

app.use(middleware)
app.use(webpackHotMiddleware(compiler))

app.use(express.static('static'))
app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '..', 'app.dev.html'))
})

app.listen(PORT, 'localhost', (err) => {
  if (err) { console.error(err) }
})

console.log('Building...')
