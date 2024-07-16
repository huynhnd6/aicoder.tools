const fs = require('fs')
const path = require('path')
const Store = require('electron-store')
const Options = new Store()

function Svg(name) {
    const iconPath = path.join(process.cwd(), 'assets/icons', `${name}.svg`)
    return fs.readFileSync(iconPath, 'utf8')
}

module.exports = {
    Svg,
    Options,
}