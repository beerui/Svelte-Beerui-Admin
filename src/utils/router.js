export default [
    {
        path: '/',
        id: '1',
        title: '首页',
        parentId: null,
        hidden: false,
        icon: 'home',
        key:'home',
        type: '2',
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
        type: '1',
        redirect: true,
        icon: 'system',
        key:'system',
        hidden: false,
        roles: ['admin', 'editor'],
        children: []
    },
    {
        path: '/system/menu',
        title: '菜单管理',
        parentId: '8',
        id: '8-1',
        type: '2',
        key:'systemMenu',
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
        type: '2',
        key:'systemUser',
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
        type: '2',
        key:'systemAdd',
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
        type: '2',
        key:'systemRole',
        roles: ['admin'],
        icon: '',
        hidden: false,
        children: []
    }
]
