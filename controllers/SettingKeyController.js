const SettingKeyView = require('#root/views/SettingKey.js')
const { Options } = require('./Utils.js')

exports.index = () => {
    return SettingKeyView()
}

exports.save = (key) => {
    Options.set('key', key)
}
