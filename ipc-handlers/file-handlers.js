const fs = require('fs')

exports.readFile = async (event, filePath) => {
    try {
        const fileStats = await fs.promises.stat(filePath);
        if(fileStats.isFile()) {
            const content = await fs.promises.readFile(filePath, 'utf8')
            return content
        }
        return null
    } catch (error) {
        console.error('Error reading file:', error)
        throw error
    }
}
