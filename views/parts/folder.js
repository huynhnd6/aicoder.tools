const path = require('path')
const { Svg } = require(path.join(process.cwd(), 'controllers', 'utils.js'))
const Route = require(path.join(process.cwd(), 'route.js'))

module.exports = () => {
    const folderElement = document.getElementById('folder-bar')
    const container = document.createElement('div')
    const header = document.createElement('div')
    header.classList.add('page-folder-header')
    const headerSpan = document.createElement('span')
    const headerSelect = document.createElement('a')
    headerSpan.textContent = 'Select project folder'
    headerSpan.id = 'folder-name'
    
    headerSelect.innerHTML = Svg('folder')
    headerSelect.addEventListener('click', (event) => {
        event.preventDefault()
        Route('folder.select')
    })
    header.appendChild(headerSpan)
    header.appendChild(headerSelect)
    container.appendChild(header)
    const list = document.createElement('div')
    list.id = 'folder-list'
    container.appendChild(list)
    folderElement.appendChild(container)
    Route('folder.load')
}