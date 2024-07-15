const path = require('path')
const Notification = require(path.join(__dirname, '..', 'notification.js'))
const { ipcRenderer } = require('electron')
const { generatePrompt, isFileSelected, createMarkedInstance } = require(path.join(__dirname, '../../..', 'utils.js'))

class Modify {
    static build() {
        const container =  document.createElement('div')
        const textarea = document.createElement('textarea')
        textarea.setAttribute('id', 'ai-modify-text')
        textarea.setAttribute('placeholder', 'Enter your description')
        textarea.setAttribute('rows', '6')
        container.appendChild(textarea)
        const result = document.createElement('div')
        result.classList.add('markdown-body')
        const button = document.createElement('button')
        button.textContent = 'Run'
        button.addEventListener('click', async (event) => {
            event.preventDefault()
            if (isFileSelected()) {
                button.disabled = true
                button.textContent = 'Running...'
                try {
                    const description = textarea.value || ''
                    const modifyPrompt = await ipcRenderer.invoke('readFile', path.join(__dirname, '../../../..', 'prompts', 'modify.txt'))
                    const prompt = await generatePrompt(modifyPrompt, description)
                    const response = await ipcRenderer.invoke('aiGenerate', prompt)
                    createMarkedInstance(result, response[0].text)
                } catch (error) {
                    Notification.send(error)
                }
                
                button.disabled = false
                button.textContent = 'Run'
            }          
        })
        container.appendChild(button)
        container.appendChild(result)
        return container
    }
}

module.exports = Modify
