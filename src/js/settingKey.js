const { Options } = require('#root/src/js/app/utils.js')

exports.index = () => {
    const input = document.getElementById('apiKey')
    input.value = Options.get('apiKey') || ''
    const button = document.getElementById('saveApiKey')
    button.addEventListener('click', () => {
        Options.set('apiKey', input.value)
    })
}