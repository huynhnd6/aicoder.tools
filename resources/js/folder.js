'use strict'

class Folder {
    static files = []

    static build(fileTree, parentElement, ml=0) {
        this.files = []
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
                        this.selected(item)
                    }
                })
                detailsElement.appendChild(summaryElement)
                itemElement.appendChild(detailsElement)
                Folder.build(item, detailsElement, ml+1)
            } else if (item.type === 'file') {
                itemElement.classList.add('file-item')
                const nameElement = document.createElement('span')
                nameElement.style.marginLeft = `${ml}rem`
                nameElement.textContent = item.name
                itemElement.appendChild(nameElement)
                itemElement.addEventListener('click', (event) => {
                    event.preventDefault()
                    this.selected(item)
                })
            }
            listElement.appendChild(itemElement)
        })

        parentElement.appendChild(listElement)
    }

    static selected(file) {
        const selectedElement = document.querySelector(`[data-path="${file.path.replace(/\\/g, '\\\\')}"]`)
        if (selectedElement.classList.contains('active')) {
            this.removeSelected(file)
            this.removeParentPath(file.path)
            return
        }
        this.addSelected(file)
        
    }

    static removeParrents(path) {
        this.files.forEach(file => {
            console.log(file)
            if (path.startsWith(file) && path !== file) {
                const selectedElement = document.querySelector(`[data-path="${file.replace(/\\/g, '\\\\')}"]`)
                selectedElement.classList.remove('active')
                this.removeFile(file)
                console.log(path + ' removed: ' + file)
            }
        })
    }

    static addSelected(file) {
        const selectedElement = document.querySelector(`[data-path="${file.path.replace(/\\/g, '\\\\')}"]`)
        if (file.type === 'folder') {
            file.children.forEach(child => {
                this.addSelected(child)
            })
        }
        if (!this.files.includes(file.path)) {
            this.files.push(file.path)
        }
        selectedElement.classList.add('active')
    }

    static removeSelected(file) {
        if (file.type === 'folder') {
            file.children.forEach(child => {
                this.removeSelected(child)
            })
        }
        this.removeFile(file.path)
        
    }

    static removeParentPath(path) {
        const parts = path.split('\\')
        let parentPath = parts.slice(0, -1).join('\\')
        while (this.files.includes(parentPath)) {
            this.removeFile(parentPath)
            this.removeParentPath(parentPath)
        }
        
    }

    static removeFile(path) {
        const selectedElement = document.querySelector(`[data-path="${path.replace(/\\/g, '\\\\')}"]`)
        const index = this.files.findIndex(f => f === path)
        if (index !== -1) {
            this.files.splice(index, 1)
        }
        if (selectedElement) {
            selectedElement.classList.remove('active')
        }
    }
}

module.exports = Folder
