export default [
    {
        path: '/',
        id: '1',
        title: '首页',
        parentId: null,
        hidden: false,
        icon: 'home',
        roles: ['admin', 'editor'],
        //  if set true, the tag will affix in the tags-view
        meta: { affix: false },
        children: []
    },
    {
        path: '/system',
        title: '系统管理',
        parentId: null,
        id: '8',
        redirect: true,
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
        path: '/system/add',
        title: '用户新增',
        parentId: '8-2',
        id: '8-2-1',
        roles: ['admin'],
        icon: '',
        hidden: true,  
        children:[]
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
    },
    {
        path: '/system/role1',
        title: '角色管理1',
        parentId: '8',
        id: '8-4',
        roles: ['admin'],
        icon: '',
        hidden: false,
        children: []
    },
    {
        path: '/system/role2',
        title: '角色管理2',
        parentId: '8',
        id: '8-5',
        roles: ['admin'],
        icon: '',
        hidden: false,
        children: []
    },
    {
        path: '/system/role3',
        title: '角色管理字长一点啊啊啊啊啊',
        parentId: '8',
        id: '8-6',
        roles: ['admin'],
        icon: '',
        hidden: false,
        children: []
    },
    {
        path: '/system/role4',
        title: '角色管理字长一点啊啊啊啊啊',
        parentId: '8',
        id: '8-7',
        roles: ['admin'],
        icon: '',
        hidden: false,
        children: []
    },
    {
        path: '/system/role5',
        title: '测试用户',
        parentId: '8',
        id: '8-8',
        roles: ['admin'],
        icon: '',
        hidden: false,
        children: []
    }
]
