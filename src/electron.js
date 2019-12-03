require('v8-compile-cache')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const isDev = require('electron-is-dev')
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true, nodeIntegrationInWorker: true }, width: 900, height: 680 })
  mainWindow.loadURL(isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.on('closed', () => (mainWindow = null))
}

// app.commandLine.appendSwitch('disable-gpu')
// app.commandLine.appendSwitch('enable-transparent-visuals')
// app.disableHardwareAcceleration()

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})