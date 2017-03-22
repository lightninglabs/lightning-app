/* eslint-disable no-console, consistent-return */
/* eslint generator-star-spacing: 0 */

import 'babel-polyfill'
import _ from 'lodash'
import os from 'os'
import webpack from 'webpack'
import packager from 'electron-packager'
import del from 'del'
import minimist from 'minimist'
import cfg from './webpack.config.production'
import pkg from './package.json'

import electronCfg from './webpack.config.electron'

const argv = minimist(process.argv.slice(2))
const toNodePath = name => `/node_modules/${ name }($|/)`
const devDeps = Object
  .keys(pkg.devDependencies)
  .map(toNodePath)

const depsExternal = Object
  .keys(pkg.dependencies)
  .filter(name => !electronCfg.externals.includes(name))
  .map(toNodePath)

// Because GRPC Needs Lodash But Wont Install It For Some Reason
const depsMinusLodash =
  _.remove(depsExternal, path => path !== '/node_modules/lodash($|/)')

const appName = argv.name || argv.n || pkg.productName
const shouldUseAsar = argv.asar || argv.a || false
const shouldBuildAll = argv.all || false

const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '^/test($|/)',
    '^/release($|/)',
    '^/main.development.js',
  ]
  .concat(devDeps)
  .concat(depsMinusLodash),
}

const icon = argv.icon || argv.i || 'app/app'
if (icon) DEFAULT_OPTS.icon = icon

function build(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return

  const iconObj = {
    icon: DEFAULT_OPTS.icon + (() => {
      let extension = '.png'
      if (plat === 'darwin') extension = '.icns'
      if (plat === 'win32') extension = '.ico'

      return extension
    })(),
  }

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    // 'prune': true,
    appVersion: pkg.version || DEFAULT_OPTS.version,
    out: '../../release',
    protocols: [{
      name: 'Lightning',
      schemes: ['lightning'],
    }],
  })

  packager(opts, cb)
}


function log(plat, arch) {
  return (err, filepath) => {
    if (err) return console.error(err, filepath)
    console.log(`${ plat }-${ arch } finished!`)
  }
}

async function startPack() {
  console.log('start pack...')

  try {
    await del('../../release', { force: true })
    await build(electronCfg)
    await build(cfg)

    if (shouldBuildAll) {
      // const archs = ['ia32', 'x64']
      const archs = ['x64']
      const platforms = ['linux', 'win32', 'darwin']

      platforms.forEach((plat) => {
        archs.forEach((arch) => {
          pack(plat, arch, log(plat, arch))
        })
      })
    } else {
      // build for current platform only
      pack(os.platform(), os.arch(), log(os.platform(), os.arch()))
    }
  } catch (error) {
    console.error(error)
  }
}


const version = argv.version || argv.v
DEFAULT_OPTS.electronVersion = version || '1.4.6'
startPack()
