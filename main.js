const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store')
const store = new Store()

if (process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    })
}

function createWindow() {
    const win = new BrowserWindow({
        icon: path.join(__dirname, 'assets/images/icon.png'),
        width: 1200,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })


    win.loadFile('index.html')
    if (process.env.NODE_ENV !== 'development') {
        win.removeMenu()
    }
    if (store.get('options').length === 0) {
        store.set('options', { apiKey: null, language: 'English', 'folderPath': null })
    }

    const fileHandlers = require('./ipc-handlers/file-handlers')
    const optionsHandlers = require('./ipc-handlers/options-handlers')
    const aiHandlers = require('./ipc-handlers/ai-handlers')
    const folderHandlers = require('./ipc-handlers/folder-handlers')

    ipcMain.on('aiApiKeySave', optionsHandlers.saveApiKey)
    ipcMain.on('languageSave', optionsHandlers.saveLanguage)
    ipcMain.handle('getOptions', optionsHandlers.getOptions)

    ipcMain.handle('readFile', fileHandlers.readFile)

    ipcMain.handle('aiGenerate', aiHandlers.generateContent)

    ipcMain.handle('openFolder', folderHandlers.openFolder)
    ipcMain.handle('getFileTree', folderHandlers.getFileTree)
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
