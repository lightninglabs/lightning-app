/* eslint-disable no-console, consistent-return */
/* eslint generator-star-spacing: 0 */

import 'babel-polyfill'
import _ from 'lodash'
import os from 'os'
import webpack from 'webpack'
import packager from 'electron-packager'
import del from 'del'
import minimist from 'minimist'
import prodCfg from '../webpack.config.production'
import electronCfg from '../webpack.config.electron'
import pkg from '../package.json'


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
  icon: argv.icon || argv.i || 'assets/ln-logo',
  ignore: [
    '^/test($|/)',
    '^/release($|/)',
    '^/main.dev.js',
  ]
  .concat(devDeps)
  .concat(depsMinusLodash),
}

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

  const icon = DEFAULT_OPTS.icon + ({
    'darwin': '.icns',
    'win32': '.ico',
  }[plat] || '.png')

  const opts = {
    ...DEFAULT_OPTS,
    icon,
    platform: plat,
    arch,
    appVersion: pkg.version || DEFAULT_OPTS.version,
    out: '../../release',
    protocols: [{
      name: 'Lightning',
      schemes: ['lightning'],
    }],
  }

  packager(opts, cb)
}


function log(plat, arch) {
  return (err, filepath) => {
    if (err) return console.error(err, filepath)
    console.log(`${ plat }-${ arch } finished!`)
  }
}

function startPack() {
  console.log('Start pack...')

  Promise.all(
    [
      del('../../release', { force: true }),
      build(electronCfg),
      build(prodCfg),
    ],
  ).then(() => {
    if (shouldBuildAll) {
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
  }).catch((error) => {
    console.log('Error:', JSON.stringify(error, null, 2))
    console.log('Retrying...')
    startPack()
  })
}

const version = argv.version || argv.v
DEFAULT_OPTS.electronVersion = version || '1.4.6'
startPack()
