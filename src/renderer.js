const settingKey = require('./js/settingKey.js')



function loadScript(...args) {
    const routers = {
        'settingKey.index': settingKey.index
    }

    const routerName = args[0];
    if (routers[routerName]) {
        return routers[routerName](...args.slice(1));
    }

}

function loadBar(bar) {
    return fetch(`views/${bar}.html`)
    .then(res => res.text())
    .then(html => {
        document.getElementById(bar).innerHTML = html
        loadScript(`${bar}.index`)
    })
    .catch(err => {
        console.error(err)
    })
}

function navigateTo(page) {
    fetch(`views/${page}.html`)
    .then(res => res.text())
    .then(html => {
        const content = document.getElementById('content')
        content.innerHTML = html
        loadScript(`${page}.index`)
    })
    .catch(err => {
        console.error(err)
    })
}

document.addEventListener('DOMContentLoaded', () => {
    loadBar('menuBar')
    loadBar('folderBar')
    navigateTo('settingKey')
})
