const Setting = require('../../setting.js')
const Route = require('../../route.js')

module.exports = () => {
    const sidebar = document.querySelector('.page-sidebar')
    const ol = document.createElement('ol')
    const menus = Setting().menus
    menus.forEach(menu => {
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
                Route(child.route)
            }
            a.href = `#${child.content}`
            a.textContent = child.name
            a.addEventListener('click', (event) => {
                event.preventDefault()
                const menuItems = document.querySelectorAll(`.page-sidebar li`)
                menuItems.forEach(item => {
                    item.classList.remove('active')
                })
                Route(child.route)
                liChild.classList.add('active')
            })
            liChild.appendChild(a)
            olChildren.appendChild(liChild)
        })
        details.appendChild(olChildren)
        li.appendChild(details)
        ol.appendChild(li)
        sidebar.appendChild(ol)
    })
}