const path = require('path')
const Notification = require(path.join(__dirname, '..', 'notification.js'))
const Save = require(path.join(__dirname, '../../../save.js'))

class Language {
    static build() {
        const container = document.createElement('div')
        container.classList.add('language-settings')

        const languageSelect = document.createElement('select')
        languageSelect.id = 'language-select'

        const englishOption = document.createElement('option')
        englishOption.value = 'English'
        englishOption.textContent = 'English'

        const vietnameseOption = document.createElement('option')
        vietnameseOption.value = 'Vietnamese'
        vietnameseOption.textContent = 'Vietnamese'

        languageSelect.appendChild(englishOption)
        languageSelect.appendChild(vietnameseOption)

        languageSelect.value = Save.get('options.language') || 'English'

        const saveButton = document.createElement('button')
        saveButton.textContent = 'Save'
        saveButton.addEventListener('click', () => {
            const selectedLanguage = languageSelect.value
            try {
                Save.set('options.language', selectedLanguage)
                Notification.send('Language saved!')
            } catch (error) {
                Notification.send(`Error: ${error}`)
            }
        })

        container.appendChild(languageSelect)
        container.appendChild(saveButton)

        return container
    }
}

module.exports = Language
