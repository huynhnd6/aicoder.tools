module.exports = () => {
    const contentElement = document.querySelector('.page-content')
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
    })
    container.appendChild(button)
    container.appendChild(result)
    contentElement.innerHTML = container.outerHTML
}