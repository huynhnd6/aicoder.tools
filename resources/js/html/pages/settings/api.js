const { ipcRenderer } = require('electron')
const path = require('path')
const Notification = require(path.join(__dirname, '..', 'notification.js'))

class SettingApi {

    static build() {
        const input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('id', 'ai-api-key-text')
        input.setAttribute('placeholder', 'Enter your API key')
        ipcRenderer.invoke('getOptions').then((options) => {
            input.value = options.apiKey || ''
        })
        const button = document.createElement('button')
        button.setAttribute('id', 'ai-api-key-submit')
        button.textContent = 'Save'
        button.addEventListener('click', (event) => {
            event.preventDefault()
            try {
                ipcRenderer.send('aiApiKeySave', input.value)
                Notification.send('Api key saved!')
            } catch (error) {
                Notification.send(`Error: ${error}`)
            }
            
            
        })
        const container = document.createElement('div')
        container.setAttribute('id', 'setting-key')
        container.appendChild(input)
        container.appendChild(button)
        return container
    }
}

module.exports = SettingApi