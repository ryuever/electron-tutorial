const { BrowserWindow, app, ipcMain, MessageChannelMain } = require('electron')
const path = require('node:path')

app.whenReady().then(async () => {
  // The worker process is a hidden BrowserWindow, so that it will have access
  // to a full Blink context (including e.g. <canvas>, audio, fetch(), etc.)
  const worker = new BrowserWindow({
    show: false,
    webPreferences: { 
      nodeIntegration: true,
      preload: path.join(__dirname, 'worker.js')
    }
  })
  worker.loadFile(path.join(__dirname, 'index.html'))

  // await worker.loadFile('worker.html')

  // The main window will send work to the worker process and receive results
  // over a MessagePort.
  const mainWindow = new BrowserWindow({
    webPreferences: { 
      nodeIntegration: true,
      preload: path.join(__dirname, 'app.js')
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // mainWindow.loadFile('app.html')

  // We can't use ipcMain.handle() here, because the reply needs to transfer a
  // MessagePort.
  // Listen for message sent from the top-level frame
  mainWindow.webContents.mainFrame.ipc.on('request-worker-channel', (event) => {
    // Create a new channel ...
    const { port1, port2 } = new MessageChannelMain()
    // ... send one end to the worker ...
    worker.webContents.postMessage('new-client', null, [port1])
    // ... and the other end to the main window.
    event.senderFrame.postMessage('provide-worker-channel', null, [port2])
    // Now the main window and the worker can communicate with each other
    // without going through the main process!
  })
})