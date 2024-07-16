const Modify = require('./controllers/modify.js')
const FolderManager = require('./controllers/FolderManager.js')
const SettingKeyController = require('./controllers/SettingKeyController.js')

module.exports = (...args) => {
    const routers = {
        'modify.index': Modify.index,
        'modify.store': Modify.store,
        'folder.select': FolderManager.selectFolder,
        'folder.load': FolderManager.loadFolder,
        'setting.key.index': SettingKeyController.index,
        'setting.key.save': SettingKeyController.save,
    }

    const routerName = args[0];
    if (routers[routerName]) {
        return routers[routerName](...args.slice(1));
    } else {
        throw new Error(`Route '${routerName}' not found.`);
    }
}
