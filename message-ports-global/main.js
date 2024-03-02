const { BrowserWindow, app, MessageChannelMain } = require('electron')
const path = require('node:path')

app.whenReady().then(async () => {
  // create the windows.
  const mainWindow = new BrowserWindow({
    show: true,
    webPreferences: {
      contextIsolation: false,
      preload: path.join(__dirname, 'preloadMain.js')
    }
  })
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  const secondaryWindow = new BrowserWindow({
    show: true,
    webPreferences: {
      contextIsolation: false,
      preload: path.join(__dirname, 'preloadSecondary.js')
    }
  })
  secondaryWindow.loadFile(path.join(__dirname, 'index.html'))


  // set up the channel.
  const { port1, port2 } = new MessageChannelMain()

  // once the webContents are ready, send a port to each webContents with postMessage.
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })

  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.webContents.postMessage('port', null, [port2])
  })
})