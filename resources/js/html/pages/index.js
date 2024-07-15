const path = require('path')
const api = require(path.join(__dirname, 'settings', 'api.js'))
const Language = require(path.join(__dirname, 'settings', 'language.js'))
const Modify = require(path.join(__dirname, 'coder', 'modify.js'))
const FixCode = require(path.join(__dirname, 'coder', 'fix.js'))

class Page {
    static builds(name) {
        const contentElement = document.getElementById('page-content')
        contentElement.innerHTML = ''
        const actions = {
            'setting-api': api.build(),
            'ai-modify': Modify.build(),
            'setting-language': Language.build(),
            'ai-fix-code': FixCode.build(),
        }
        if (actions[name]) {
            contentElement.appendChild(actions[name])
        }
    }
}

module.exports = Page
