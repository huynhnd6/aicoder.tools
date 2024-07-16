module.exports = () => {
    return {
        menus: [
            {
                name: 'Ai Coder',
                open: true,
                children: [
                    {
                        name: 'Modify',
                        active: true,
                        route: 'modify.index'
                    },
                ]
            },
            {
                name: 'Settings',
                children: [
                    {
                        name: 'Key',
                        active: false,
                        route: 'setting.key.index'
                    },
                    {
                        name: 'Language',
                        active: false,
                        route: 'setting-language'
                    }
                ]
            }
        ]
    }
}
