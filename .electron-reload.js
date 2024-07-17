const path = require('path')
const electronReload = require('electron-reload')

electronReload(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    awaitWriteFinish: true,
})
