if (process.env.NODE_ENV === 'development') {
    require('../.electron-reload.js')
}

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store')
new Store()

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        icon: path.join(__dirname, 'assets/images/icon.png'),
        width: 1200,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    mainWindow.loadFile(path.join(__dirname, 'index.html'))

    if (process.env.NODE_ENV !== 'development') {
        win.removeMenu()
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})