const Store = require('electron-store')
const store = new Store()

exports.saveApiKey = (event, apiKey) => {
    store.set('options.apiKey', apiKey)
}

exports.saveLanguage = (event, language) => {
    store.set('options.language', language)
}

exports.getOptions = () => {
    return store.get('options')
}
