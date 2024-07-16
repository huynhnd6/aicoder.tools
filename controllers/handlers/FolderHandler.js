const { dialog } = require('electron')

exports.select = async (event) => {
    const win = event.sender.getOwnerBrowserWindow()
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openDirectory']
    })
    if (!canceled && filePaths.length > 0) {
        return filePaths[0]
    }
    return null
}