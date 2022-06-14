export default [
    {
        path: '/',
        id: '1',
        title: '首页',
        parentId: null,
        hidden: false,
        icon: 'home',
        roles: ['admin', 'editor'],
        children: []
    },
    {
        path: '/system',
        title: '系统管理',
        parentId: null,
        id: '8',
        icon: 'system',
        hidden: false,
        roles: ['admin', 'editor'],
        children: []
    },
    {
        path: '/system/menu',
        title: '菜单管理',
        parentId: '8',
        id: '8-1',
        roles: ['admin', 'editor'],
        icon: '',
        hidden: false,
        children: []
    },
    {
        path: '/system/user',
        title: '用户管理',
        parentId: '8',
        id: '8-2',
        roles: ['admin'],
        icon: '',
        hidden: false,
        children: []
    },
    {
        path: '/system/role',
        title: '角色管理',
        parentId: '8',
        id: '8-3',
        roles: ['admin'],
        icon: '',
        hidden: false,
        children: []
    }
]
