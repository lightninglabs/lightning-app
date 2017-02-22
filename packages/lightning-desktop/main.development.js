/* eslint-disable global-require, no-console */

import { app, BrowserWindow } from 'electron'
import windowStateKeeper from 'electron-window-state'
import _ from 'lodash'
import observe from 'observe'
import cp from 'child_process'
import ps from 'ps-node'

let mainWindow = null

const isProcessRunning = command => new Promise((resolve, reject) => {
  ps.lookup({ command },
    (err, resultList) => {
      if (err) { throw new Error(err) }
      resultList[0] ? resolve(resultList[0]) : reject()
    }
  )
})

const runProcesses = (processes, logs) => {
  _.map(processes, (process) => {
    isProcessRunning(process.name)
      .then((p) => {
        console.log(`${ process.name } Already Running`, p)
      })
      .catch(() => {
        const prefix = `${ process.name }: `
        const instance = cp.execFile(process.name, process.args, { cwd: '../lightning-desktop/bin' }, (error) => {
          if (error) { logs.push(`${ error.code }: ${ error.errno }`); return }
        })
        instance.stdout.on('data', data => logs.push(prefix + data))
        instance.stderr.on('data', data => logs.push(prefix + data))
      })
  })
}

const logBuffer = []
const logs = observe(logBuffer)

const processes = [
  {
    name: 'lnd',
    args: [
      '--btcdhost=127.0.0.1',
      '--rpcuser=kek',
      '--rpcpass=kek',
      '--simnet',
      '--debuglevel=trace',
      '--debughtlc',
    ],
  }, {
    name: 'btcd',
    args: [
      '--rpcuser=kek',
      '--rpcpass=kek',
      '--simnet',
      '--miningaddr=4NyWssGkW6Nbwj3nXrJU54U2ijHgWaKZ1N19w',
    ],
  },
]

runProcesses(processes, logs)

const createWindow = () => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 750,
    defaultHeight: 500,
  })

  const { x, y, width, height } = mainWindowState
  mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    show: false,
    transparent: true,
    frame: false,
    title: 'Lightning',
  })

  mainWindowState.manage(mainWindow)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4152')
  } else {
    mainWindow.loadURL(`file://${ __dirname }/app.html`)
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()

    mainWindow.webContents.send('logs', logBuffer)
  })

  logs.on('change', (change) => {
    const log = logBuffer[change.index]
    mainWindow && mainWindow.webContents.send('log', log)
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// if (process.env.NODE_ENV === 'development') {
require('electron-debug')({ enabled: true })
// }

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// if (process.platform === 'darwin') {
//   const template = [
//     {
//       label: app.getName(),
//     },
//   ]
//   const menu = Menu.buildFromTemplate(template)
//   Menu.setApplicationMenu(menu)
// }

app.on('ready', createWindow)
