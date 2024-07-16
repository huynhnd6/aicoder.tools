const { Options } = require('#root/controllers/Utils.js')
module.exports = () => {
    const Route = require('#root/route.js')
    const contentElement = document.getElementById('content')
    const container = document.createElement('div')
    const input = document.createElement('input')
    input.setAttribute('id', 'key')
    input.setAttribute('placeholder', 'Enter your API key')
    const key = Options.get('key') || ''
    input.value = key
    container.appendChild(input)
    const button = document.createElement('button')
    button.textContent = 'Save'
    button.addEventListener('click', () => {
        const key = input.value
        Route('setting.key.save', key)
    })
    container.appendChild(button)
    contentElement.innerHTML = ''
    contentElement.appendChild(container)
}
