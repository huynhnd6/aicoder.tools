const path = require('path')
const { ipcRenderer } = require('electron')
const { Options } = require('./Utils.js')
const fs = require('fs')
const FileManager = require('./FileManager.js')

class FolderManager {
    static #folderPath = Options.get('folderPath') || null

    static get folderPath() {
        return this.#folderPath
    }

    static set folderPath(newPath) {
        this.#folderPath = newPath
        Options.set('folderPath', newPath)
    }

    static selectFolder = async () => {
        try {
            this.folderPath = await ipcRenderer.invoke('selectFolder')
            this.loadFolder()
        } catch (err) {
            console.error(err)
        }
    }

    static getFolderName = (folderPath = this.#folderPath) => {
        return path.basename(folderPath)
    }

    static getChildrens = (folderPath = this.#folderPath) => {
        if (!this.#folderPath) return []

        const files = fs.readdirSync(folderPath, { withFileTypes: true })
        const fileTree = {
            name: this.getFolderName(folderPath),
            path: folderPath,
            children: [],
            type: 'folder',
        }

        files.sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1
            if (!a.isDirectory() && b.isDirectory()) return 1
            return 0
        })

        files.forEach(file => {
            if (file.name.startsWith('.')) {
                return
            }
            const filePath = path.join(folderPath, file.name)
            if (file.isDirectory()) {
                fileTree.children.push(this.getChildrens(filePath))
            } else {
                fileTree.children.push({
                    name: file.name,
                    path: filePath,
                    type: 'file',
                })
            }
        })

        return fileTree
    }

    static loadFolder = () => {
        const folderNameElement = document.getElementById('folder-name')
        folderNameElement.textContent = this.getFolderName()

        const listElement = document.getElementById('folder-list')
        listElement.innerHTML = ''
        this.loadChildrens(this.getChildrens(), listElement)
    }

    static loadChildrens(fileTree, parentElement, ml = 0) {
        const listElement = document.createElement('ol')
        fileTree.children.forEach(item => {
            const itemElement = document.createElement('li')
            itemElement.setAttribute('data-path', item.path)
            if (item.type === 'folder') {
                itemElement.classList.add('folder-item')
                const detailsElement = document.createElement('details')
                const summaryElement = document.createElement('summary')
                summaryElement.style.marginLeft = `${ml}rem`
                summaryElement.textContent = item.name
                summaryElement.addEventListener('click', (event) => {
                    event.preventDefault()
                    const rect = summaryElement.getBoundingClientRect()
                    const clickX = event.clientX - rect.left
                    if (clickX < 20) {
                        detailsElement.open = !detailsElement.open
                    } else {
                        FileManager.toggleFileSelection(item)
                    }
                })
                detailsElement.appendChild(summaryElement)
                itemElement.appendChild(detailsElement)
                this.loadChildrens(item, detailsElement, ml + 1)
            } else if (item.type === 'file') {
                itemElement.classList.add('file-item')
                const nameElement = document.createElement('span')
                nameElement.style.marginLeft = `${ml}rem`
                nameElement.textContent = item.name
                itemElement.appendChild(nameElement)
                itemElement.addEventListener('click', (event) => {
                    event.preventDefault()
                    FileManager.toggleFileSelection(item)
                })
            }
            listElement.appendChild(itemElement)
        })
        parentElement.appendChild(listElement)
    }
}

module.exports = FolderManager
