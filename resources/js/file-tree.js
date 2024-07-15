'use strict'
const fs = require('fs')
const path = require('path')

class FileTree {
    constructor() {}

    static get(folderPath) {
        const files = fs.readdirSync(folderPath, { withFileTypes: true })
        const fileTree = {
            name: path.basename(folderPath),
            path: folderPath,
            children: [],
            type: 'folder'
        }

        files.sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1
            if (!a.isDirectory() && b.isDirectory()) return 1
            return 0
        })

        files.forEach(file => {
            const filePath = path.join(folderPath, file.name)
            if (file.isDirectory()) {
                fileTree.children.push(this.get(filePath))
            } else {
                fileTree.children.push({
                    name: file.name,
                    path: filePath,
                    type: 'file'
                })
            }
        })

        return fileTree
    }
}

module.exports = FileTree
