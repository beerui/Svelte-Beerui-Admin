export default [
    {
        path: '/admin',
        id: '1',
        title: '首页',
        icon: 'home',
        children: []
    },
    {
        path: '/admin/water',
        title: '水域管理',
        id: '2',
        icon: 'water',
        redirect: true,
        children: [
            {
                path: '/admin/water/river',
                title: '河道管理',
                id: '2-1',
                icon: '',
                meta: {},
                children: [
                    {
                        path: '/admin/water/river/detail',
                        title: '河道详情',
                        id: '2-1-1',
                        icon: '',
                        hidden: true,
                        meta: {},
                        children: [
                            {
                                path: '/admin/water/river/map',
                                title: '河道地图',
                                id: '2-1-1-1',
                                icon: '',
                                hidden: true,
                                meta: {},
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                path: '/admin/water/lakeChief',
                title: '河湖长管理',
                id: '2-2',
                icon: '',
                meta: {},
                children: [
                    {
                        path: '/admin/water/lakeChief/map',
                        title: '详情',
                        id: '2-3-1',
                        icon: '',
                        hidden: true,
                        meta: {},
                        children: []
                    },
                    {
                        path: '/admin/water/lakeChief/record',
                        title: '河湖长详情',
                        id: '2-3-3',
                        icon: '',
                        hidden: true,
                        meta: {},
                        children: []
                    },
                    {
                        path: '/admin/water/lakeChief/relative',
                        title: '河长关系图',
                        id: '2-3-2',
                        icon: '',
                        hidden: true,
                        meta: {},
                        children: []
                    }
                ]
            },
            {
                path: '/admin/water/riverTour',
                title: '巡河管理',
                id: '2-3',
                icon: '',
                meta: {},
                redirect: true,
                children: [
                    {
                        path: '/admin/water/riverTour/record',
                        title: '巡河记录',
                        id: '2-3-1',
                        icon: '',
                        hidden: false,
                        meta: {},
                        children: []
                    }
                    // {
                    //     path: '/admin/water/riverTour/detail',
                    //     title: '详情',
                    //     id: '2-3-2',
                    //     icon: '',
                    //     hidden: true,
                    //     meta: {},
                    //     children: []
                    // }
                ]
            },
            // 水情管理
            {
              path: '/admin/water/waterRegimen',
              title: '水情管理',
              id: '2-4',
              icon: '',
              meta: {},
              redirect: true,
              children: [
                {
                  path: '/admin/water/waterRegimen/level',
                  title: '河道水情',
                  id: '2-4-1',
                  hidden: false,
                  children: [
                    {
                      path: '/admin/water/waterRegimen/level/detailList',
                      title: '河道水情详细表',
                      id: '2-4-1-1',
                      hidden: true,
                      children: []
                    }
                  ]
                },
                {
                  path: '/admin/water/waterRegimen/reservoir',
                  title: '水库水情',
                  id: '2-4-2',
                  hidden: false,
                  children: [
                    {
                      path: '/admin/water/waterRegimen/reservoir/detailList',
                      title: '水库水情详细表',
                      id: '2-4-2-1',
                      hidden: true,
                      children: []
                    }
                  ]
                },
                {
                  path: '/admin/water/waterRegimen/checkgate',
                  title: '堰闸水情',
                  id: '2-4-3',
                  hidden: false,
                  children: [
                    {
                      path: '/admin/water/waterRegimen/checkgate/detailList',
                      title: '堰闸水情详细表',
                      id: '2-4-3-1',
                      hidden: true,
                      children: []
                    }
                  ]
                }
              ]
            },
            // {
            //     path: '/admin/water/level',
            //     title: '水位管理', // 水情管理-河道水情
            //     id: '2-4',
            //     icon: '',
            //     meta: {},
            //     children: []
            // },
            {
              path: '/admin/water/rainManagement',
              title: '雨情(降水)管理',
              id: '2-5',
              icon: '',
              meta: {},
              hidden: false,
              children: [
                {
                  path: '/admin/water/rainManagement/detailList',
                  title: '降水详细表',
                  id: '2-5-1',
                  hidden: true,
                  children: []
                },
              ]
            },
            {
                path: '/admin/water/quality',
                title: '水质管理',
                id: '2-6',
                icon: '',
                meta: {},
                children: []
            },
            {
              path: '/admin/water/discharge',
              title: '排水口管理',
              id: '2-7',
              icon: '',
              meta: {},
              children: []
            },
            {
              path: '/admin/water/hydrology',
              title: '水文站管理',
              id: '2-8',
              icon: '',
              meta: {},
              children: []
            }
        ]
    },
    {
        path: '/admin/problem',
        id: '3',
        title: '问题管理',
        icon: 'problem',
        redirect: true,
        children: [
            {
                path: '/admin/problem/management',
                title: '问题列表',
                id: '3-1',
                children: [
                    {
                        path: '/admin/problem/management/detail',
                        title: '详情',
                        id: '3-1-1',
                        hidden: true,
                        children: []
                    },
                    {
                        path: '/admin/problem/management/report',
                        title: '上报',
                        id: '3-1-2',
                        hidden: true,
                        children: []
                    }
                ]
            }
        ]
    },
    {
        path: '/admin/pollution',
        id: '4',
        title: '污水零直排区',
        icon: 'pollution',
        redirect: true,
        children: [
            // {
            //     path: '/admin/pollution/engineering',
            //     title: '工程信息管理',
            //     id: '4-1',
            //     icon: '',
            //     meta: {},
            //     children: []
            // },
            {
                path: '/admin/pollution/zero',
                title: '零直排项目管理',
                id: '4-2',
                icon: '',
                meta: {},
                children: []
            },
            {
                path: '/admin/pollution/oldHouse',
                title: '老旧小区改造项目',
                id: '4-3',
                icon: '',
                meta: {},
                children: []
            },
        ]
    },
    {
        path: '/admin/pump',
        id: '5',
        title: '泵闸站',
        icon: 'pump',
        redirect: true,
        children: [
            {
                path: '/admin/pump/pumpStation',
                title: '泵站管理',
                id: '5-1',
                icon: '',
                meta: {},
                children: []
            },
            {
                path: '/admin/pump/sluiceGateStation',
                title: '闸站管理',
                id: '5-2',
                icon: '',
                meta: {},
                children: [
                    {
                        path: '/admin/pump/sluiceGateStation/handle',
                        title: '闸站新增/修改',
                        id: '5-2-1',
                        icon: '',
                        hidden: true,
                        meta: {},
                        children: []
                    }
                ]
            },
            {
                path: '/admin/pump/waterWorks',
                title: '水厂管理',
                id: '5-3',
                icon: '',
                meta: {},
                children: [
                    {
                        path: '/admin/pump/waterWorks/handle',
                        title: '水厂新增/修改',
                        id: '5-3-1',
                        icon: '',
                        hidden: true,
                        meta: {},
                        children: []
                    }
                ]
            },
            {
                path: '/admin/pump/operation',
                title: '运维管理',
                id: '5-4',
                icon: '',
                meta: {},
                children: []
            }
        ]
    },
    {
        path: '/admin/send',
        id: '6',
        title: '传感设备',
        icon: 'send',
        redirect: true,
        children: [
            {
                path: '/admin/send/monitoring',
                title: '视频监控',
                id: '6-1',
                icon: '',
                meta: {},
                children: []
            },
            {
                path: '/admin/send/airport',
                title: '无人机机场管理',
                id: '6-2',
                icon: '',
                meta: {},
                redirect: true,
                children: [
                    {
                        path: '/admin/send/airport/airport',
                        title: '机场管理',
                        id: '6-2-1',
                        icon: '',
                        meta: {},
                        children: []
                    }
                    // {
                    //     path: '/admin/send/airport/airline',
                    //     title: '航线查看',
                    //     id: '6-2-2',
                    //     icon: '',
                    //     meta: {},
                    //     children: []
                    // }
                ]
            },
            {
                path: '/admin/send/waterLevel',
                title: '水位传感设备',
                id: '6-3',
                icon: '',
                meta: {},
                children: []
            },
        ]
    },
    {
        path: '/admin/adjust',
        id: '7',
        title: '调度管理',
        icon: 'adjust',
        hidden: true,
        children: []
    },
    {
        path: '/admin/system',
        title: '系统管理',
        id: '8',
        icon: 'system',
        hidden: false,
        redirect: true,
        children: [
            {
                path: '/admin/system/menu',
                title: '菜单管理',
                id: '8-1',
                icon: '',
                children: []
            },
            {
                path: '/admin/system/interface',
                title: '接口管理',
                id: '8-2',
                icon: '',
                children: []
            },
            {
                path: '/admin/system/user',
                title: '用户管理',
                id: '8-3',
                icon: '',
                children: [
                    {
                        path: '/admin/system/user/resetPassword',
                        title: '密码重置',
                        hidden: true,
                        id: '8-2-1',
                        icon: '',
                        children: []
                    }
                ]
            },
            {
                path: '/admin/system/role',
                title: '角色管理',
                id: '8-4',
                icon: '',
                children: [
                    {
                        path: '/admin/system/detail',
                        title: '角色详情',
                        id: '8-4-1',
                        hidden: true,
                        icon: '',
                        children: []
                    }
                ]
            },
            // {
            //     path: '/admin/system/project',
            //     title: '项目管理',
            //     id: '8-5',
            //     icon: '',
            //     children: []
            // },
            {
                path: '/admin/system/document',
                title: '文档管理',
                id: '8-6',
                icon: '',
                children: [
                    {
                        path: '/admin/system/document/add',
                        title: '上传文档',
                        hidden: true,
                        id: '8-6-1',
                        icon: '',
                    }
                ]
            },
            {
                path: '/admin/system/message',
                title: '消息管理',
                id: '8-7',
                icon: '',
                children: [
                    {
                        path: '/admin/system/message/add',
                        title: '发布通知',
                        hidden: true,
                        id: '8-7-1',
                        icon: '',
                    },
                    {
                        path: '/admin/system/message/set',
                        title: '预警消息配置',
                        hidden: true,
                        id: '8-7-2',
                        icon: '',
                        children: []
                    }
                ]
            },
            {
                path: '/admin/system/org',
                title: '区划机构管理',
                id: '8-8',
                icon: '',
                children: []
            },
            {
                path: '/admin/system/platformManagement',
                title: '平台保障管理',
                id: '8-9',
                icon: '',
                children: []
            }
        ]
    },
    // {
    //     path: '/admin/pipe',
    //     title: '水管平台',
    //     id: '9',
    //     icon: 'pipe',
    //     hidden: false,
    //     redirect: true,
    //     children: [
    //         {
    //             path: '/admin/pipe/channelWater',
    //             title: '水道水情',
    //             id: '9-1',
    //             icon: '',
    //             children: []
    //         },
    //         {
    //             path: '/admin/pipe/precipitation',
    //             title: '降水表',
    //             id: '9-2',
    //             icon: '',
    //             children: []
    //         },
    //         {
    //             path: '/admin/pipe/reservoir',
    //             title: '水库水情',
    //             id: '9-3',
    //             icon: '',
    //             children: []
    //         },
    //         {
    //             path: '/admin/pipe/hydrologicStation',
    //             title: '水文站基础信息',
    //             id: '9-4',
    //             icon: '',
    //             children: []
    //         },
    //         {
    //             path: '/admin/pipe/weirGateWaterLevelGauge',
    //             title: '堰闸水位表',
    //             id: '9-5',
    //             icon: '',
    //             children: []
    //         }
    //     ]
    // }
]
