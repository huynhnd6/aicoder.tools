const { ipcRenderer } = require('electron')
const Notification = require('./html/pages/notification.js')
const { Marked } = require('marked')
const { markedHighlight } = require('marked-highlight')
const hljs = require('highlight.js')
const fs = require('fs')
const path = require('path')

function createMarkedInstance(resultElement, result) {
    const maked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang, info) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        })
    )
    resultElement.innerHTML = maked.parse(result)
    copyToClipboard()
}

function loadSvgIcon(name) {
    const iconPath = path.join(__dirname, '../../assets/icons', `${name}.svg`)
    return fs.readFileSync(iconPath, 'utf8')
}

function copyToClipboard() {
    const copyContainer = document.querySelectorAll('.markdown-body pre')
    copyContainer.forEach(container => {
        const copyButton = document.createElement('a')
        copyButton.setAttribute('href', '#')
        copyButton.classList.add('copy-button')
        copyButton.innerHTML = loadSvgIcon('copy')
        container.appendChild(copyButton)
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(container.textContent)
            Notification.send('Content copied to clipboard!')
        })
    })
}

async function generatePrompt(prompt, description) {
    let fileContents = ''
    const options = await ipcRenderer.invoke('getOptions')
    prompt = prompt.replace('{{MODIFICATION_DESCRIPTION}}', description).replace('{{LANGUAGE}}', options.language)
    const folderPath = options.folderPath
    const promises = Folder.files.map(async filePath => {
        const text = await ipcRenderer.invoke('readFile', filePath)
        if (text) {
            const relativePath = filePath.replace(folderPath, '')
            fileContents += `---${relativePath}---\n\n${text}\n\n`
        }
    });
    await Promise.all(promises)
    prompt = prompt.replace('{{FILE_CONTENTS}}', fileContents)

    return prompt
}

function isFileSelected() {
    if (Folder.files.length === 0) {
        Notification.send('Please select a file first.')
        return
    }
    return true
}

module.exports = {
    loadSvgIcon,
    copyToClipboard,
    generatePrompt,
    isFileSelected,
    createMarkedInstance
}
