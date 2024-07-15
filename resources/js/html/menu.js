const path = require('path')
const Page = require(path.join(__dirname, 'pages', 'index.js'))

class MenuBar {

    static menus = [
        {
            name: 'Ai Coder',
            open: true,
            children: [
                {
                    name: 'Modify',
                    active: true,
                    content: 'ai-modify'
                },
                // {
                //     name: 'Fix',
                //     active: true,
                //     content: 'ai-fix-code'
                // }
            ]
        },
        {
            name: 'Settings',
            children: [
                {
                    name: 'Key',
                    active: false,
                    content: 'setting-api'
                },
                {
                    name: 'Language',
                    active: false,
                    content: 'setting-language'
                }
            ]
        }
    ]    

    static build(id) {
        const ol = document.createElement('ol')
        this.menus.forEach(menu => {
            const li = document.createElement('li')
            const details = document.createElement('details')
            const olChildren = document.createElement('ol')
            const summary = document.createElement('summary')
            summary.textContent = menu.name
            details.appendChild(summary)
            details.open = menu.open

            menu.children.forEach(child => {
                const liChild = document.createElement('li')
                const a = document.createElement('a')
                if (child.active) {
                    liChild.classList.add('active')
                    Page.builds(child.content)
                }
                a.href = `#${child.content}`
                a.textContent = child.name
                a.addEventListener('click', (event) => {
                    event.preventDefault()
                    const menuItems = document.querySelectorAll(`#${id} li`)
                    menuItems.forEach(item => {
                        item.classList.remove('active')
                    })
                    Page.builds(child.content)
                    liChild.classList.add('active')
                })
                liChild.appendChild(a)
                olChildren.appendChild(liChild)
            })
            details.appendChild(olChildren)
            li.appendChild(details)
            ol.appendChild(li)
            document.getElementById(id).appendChild(ol)
        })
    }
}

module.exports = MenuBar