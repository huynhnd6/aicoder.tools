const { dialog } = require('electron')
const path = require('path')
const Store = require('electron-store')
const store = new Store()
const FileTree = require(path.join(__dirname,'..', 'resources', 'js', 'file-tree.js'))

exports.openFolder = async (event) => {
    const win = event.sender.getOwnerBrowserWindow()
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openDirectory']
    })
    if (!canceled && filePaths.length > 0) {
        store.set('options.folderPath', filePaths[0])
        return filePaths[0]
    }
    return null
}

exports.getFileTree = async (event, folderPath) => {
    return FileTree.get(folderPath)
}
