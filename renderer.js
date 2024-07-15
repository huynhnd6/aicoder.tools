const { ipcRenderer } = require('electron')
const path = require('path')
const Folder = require(path.join(__dirname, 'resources', 'js', 'folder.js'))
const MenuBar = require(path.join(__dirname, 'resources', 'js', 'html', 'menu.js'))

//Build menu bar
MenuBar.build('menu-bar')

const aiApiKeySubmit = () => {
    const apiKey = document.getElementById('ai-api-key-text').value
    try {
        ipcRenderer.send('aiApiKeySave', apiKey)
        pageNotification('Api key saved!')
    } catch(error) {
        console.error('Error:', error)
        pageNotification('An error occurred while generating content. Please try again later.')
    }
}

ipcRenderer.invoke('getOptions').then((options) => {
    if(options.folderPath) {
        const folderListElement = document.getElementById('ai-coder-folder-list')
        getFolderList(options.folderPath)
    }
})

const aiCoderFolderSelect = async () => {
    const folderPath = await ipcRenderer.invoke('openFolder')
    if (folderPath) {
        getFolderList(folderPath)
    }
}

const getFolderList = async (folderPath) => {
    const fileTree = await ipcRenderer.invoke('getFileTree', folderPath)
    const folderNameElement = document.getElementById('ai-coder-folder-name')
    folderNameElement.textContent = fileTree.name
    const folderListElement = document.getElementById('ai-coder-folder-list')
    folderListElement.innerHTML = ''
    Folder.build(fileTree, folderListElement)
}

document.getElementById('ai-coder-folder-select').addEventListener('click', aiCoderFolderSelect)
