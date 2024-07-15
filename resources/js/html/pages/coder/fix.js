const path = require('path')
const Folder = require(path.join(__dirname, '..', '..', '..', 'folder.js'))
const Notification = require(path.join(__dirname, '..', 'notification.js'))
const { ipcRenderer } = require('electron')
const { Marked } = require('marked')
const { markedHighlight } = require('marked-highlight')
const hljs = require('highlight.js')

class FixCode {
    static build() {
        const container = document.createElement('div')
        const textarea = document.createElement('textarea')
        textarea.setAttribute('id', 'ai-fix-text')
        textarea.setAttribute('placeholder', 'Enter your description')
        textarea.setAttribute('rows', '6')
        container.appendChild(textarea)
        const result = document.createElement('div')
        result.classList.add('markdown-body')
        const button = document.createElement('button')
        button.textContent = 'Run'
        button.addEventListener('click', async (event) => {
            event.preventDefault()
            if (this.isFileSelected()) {
                button.disabled = true
                button.textContent = 'Running...'
                const prompt = await this.generatePrompt(textarea)
                const response = await ipcRenderer.invoke('aiGenerate', prompt)
                console.log(response)
                const marked = new Marked(
                    markedHighlight({
                        langPrefix: 'hljs language-',
                        highlight(code, lang, info) {
                            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                            return hljs.highlight(code, { language }).value;
                        }
                    })
                );
                result.innerHTML = marked.parse(response[0].text)
                this.copyToClipboard()
                button.disabled = false
                button.textContent = 'Run'
            }
        })
        container.appendChild(button)
        container.appendChild(result)
        return container
    }

    static copyToClipboard() {
        const copyContainer = document.querySelectorAll('.markdown-body pre')
        copyContainer.forEach(container => {
            const copyButton = document.createElement('a')
            copyButton.setAttribute('href', '#')
            copyButton.classList.add('copy-button')
            copyButton.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M10 8V7C10 6.05719 10 5.58579 10.2929 5.29289C10.5858 5 11.0572 5 12 5H17C17.9428 5 18.4142 5 18.7071 5.29289C19 5.58579 19 6.05719 19 7V12C19 12.9428 19 13.4142 18.7071 13.7071C18.4142 14 17.9428 14 17 14H16M7 19H12C12.9428 19 13.4142 19 13.7071 18.7071C14 18.4142 14 17.9428 14 17V12C14 11.0572 14 10.5858 13.7071 10.2929C13.4142 10 12.9428 10 12 10H7C6.05719 10 5.58579 10 5.29289 10.2929C5 10.5858 5 11.0572 5 12V17C5 17.9428 5 18.4142 5.29289 18.7071C5.58579 19 6.05719 19 7 19Z" stroke="#f2f2f2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>'
            container.appendChild(copyButton)
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(container.textContent)
                Notification.send('Content copied to clipboard!')
            })
        })
    }

    static async generatePrompt(textarea) {
        let prompt = `You are an AI assistant tasked with fixing code based on given requirements. You will be provided with file contents and a description of the issues to be addressed. Your goal is to implement these fixes while maintaining code quality and following best practices.\n\nYou will receive input in the following format:\n\n`
        const options = await ipcRenderer.invoke('getOptions')
        const folderPath = options.folderPath
        const promises = Folder.files.map(async filePath => {
            const text = await ipcRenderer.invoke('readFile', filePath)
            if (text) {
                const relativePath = filePath.replace(folderPath, '')
                prompt += `---${relativePath}---\n\n${text}\n\n`
            }
        });

        await Promise.all(promises)
        const description = textarea.value
        prompt += `<modification_description>\n${description}\n</modification_description>\n\nFollow these steps to complete the task:\n\n1. Carefully read the current implementation in the file_contents to understand its structure and behavior.\n\n2. Analyze the modification_description to identify the required fixes.\n\n3. Plan how to implement the fixes while maintaining code quality and following best practices.\n\n4. Make the necessary modifications to the code. Ensure that you:\n   - Maintain professional, production-quality code\n   - Follow best practices for software engineering, including code structure, naming conventions, and comments\n   - Preserve existing behavior except where changes are required to meet new requirements\n   - Optimize and improve the current structure and features if no new features are described\n\n5. Review your modified code to check that:\n   - It meets all new requirements\n   - It is free of errors and mistakes\n   - It is readable, well-structured, and properly commented\n   - It follows language-specific conventions and best practices\n\n6. Prepare your response in Markdown format, structured as follows:\n\n\`\`\`markdown\n## Changes Made\n[Describe the changes you made to the code]\n\n## Modified Files\n[For each modified file, include:]\n\n### [File path]\n\`\`\`[language]\n[Full contents of the modified file]\n\`\`\`\n\n## New Files (if applicable)\n[For each new file created, include:]\n\n### [New file path]\n\`\`\`[language]\n[Full contents of the new file]\n\`\`\`\n\`\`\`\n\nEnsure that your response includes the full contents of all modified or new files, not just the changed sections.\n\nIf you're satisfied that your modified implementation meets the standards for production-quality code, provide the complete modified source code in your response using the specified format.\n\nLanguage that I prefer the explanation to be in:\n\n ${options.language}`

        return prompt
    }

    static isFileSelected() {
        if (Folder.files.length === 0) {
            Notification.send('Please select a file first.')
            return
        }
        return true
    }
}

module.exports = FixCode
