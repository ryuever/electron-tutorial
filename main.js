const { ipcMain } = require('electron')
const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const contents = win.webContents

  console.log('contents ', contents)

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.on('ping', (args) => console.log(args))
  ipcMain.handle('ping', () => 'pong');
  createWindow()
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
