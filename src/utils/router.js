
export async function get() {
    const item = routers
    if (item) {
      return {
        body: { item }
      };
    }
   
    return {
      status: 404
    };
  }

const routers = [
    {
        path: '/admin',
        id: '1',
        title: '首页',
        hidden: false,
        icon: 'home',
        roles: ['admin', 'editor'],
        children: []
    },
    {
        path: '/admin/system',
        title: '系统管理',
        id: '8',
        icon: 'system',
        hidden: false,
        roles: ['admin', 'editor'],
        redirect: true,
        children: [
            {
                path: '/admin/system/menu',
                title: '菜单管理',
                id: '8-1',
                roles: ['admin', 'editor'],
                icon: '',
                children: []
            },
            {
                path: '/admin/system/user',
                title: '用户管理',
                id: '8-2',
                roles: ['admin'],
                icon: '',
                children: []
            },
            {
                path: '/admin/system/role',
                title: '角色管理',
                id: '8-3',
                roles: ['admin'],
                icon: '',
                children: []
            }
        ]
    }
]
