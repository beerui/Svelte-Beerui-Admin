import { getToken, removeToken } from "./auth.js";
import { goto } from "$app/navigation";
import { log_out, user_current_info, web_login } from "../api/common.js";
import { openNotice } from "./index.js";
import {
    LOGIN_LOADING_STATUS,
    PERMISSION_ROUTER,
    PERMISSION_THEME_ROUTER,
    ROUTER_MAP,
    TOKEN,
    USER_INFO
} from "../lib/stores.js";

export function loginOut(message = '退出成功') {
    log_out().then(res => {
        removeToken()
        goto('/login', { replaceState: true })
    }).catch(err => {
        removeToken()
        goto('/login', { replaceState: true })
    })
}

export async function loginIn(query) {
    LOGIN_LOADING_STATUS.set(true)
    // 使用endpoints 模仿接口
    const res = await fetch('/api/router',{method: 'post', body: JSON.stringify(query)})
    const data = await res.json()
    console.log(data);
   
}
// 检测当前页面是否有权限查看 无权限跳到无权限页面
export const isPermissionRoute = (path, layout) => {
    const public_router = ['/login', '/403', '/error']
    if (public_router.includes(path)) return true
    let _theme_menu = [] // 驾驶舱 权限路由
    PERMISSION_THEME_ROUTER.subscribe(items => _theme_menu = items)
    // console.log('isPermissionRoute path', path)
    // console.log('isPermissionRoute layout', layout)
    // console.log('isPermissionRoute _theme_menu', _theme_menu)
    // console.log('isPermissionRoute ROUTER_MAP', ROUTER_MAP)

    /**
     * 驾驶舱页面 权限判断
     * 1. 权限路由中 path相等
     * 2. 进入 动态路由的详情页
     *  > 1. el.component === 'content'
     *  > 2. path.replace(/\/\d+$/, '') 动态 [slug] 详情页判断 截掉动态的部分 使 /water/plan/1 变成 /water/plan
     * @type {boolean}
     */
    const themeFlag = _theme_menu.some(el => el.path === path || (el.component === 'content' && path.replace(/\/\d+$/, '') === el.path))
    let adminFlag = false
    for(let i in ROUTER_MAP) {
        const item = ROUTER_MAP[i]
        if(item.path === path) adminFlag = true
    }
    if (!adminFlag && !themeFlag) goto('/403', { replaceState: true })
}
export const openPageRedirect = (list) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].redirect) {
            if (list[i].children.length > 0) {
                return openPageRedirect(list[i].children)
            }
        } else {
            return list[i]
        }
    }
}
// interface UserInfoType {
//     areaCode: "330602000000"
//     areaId: 7
//     areaLevel: 4
//     areaLevelPath: "-0000001-0000003-0000005-0000007"
//     areaName: "越城区"
//     currentRole: {roleId: 19, roleName: "测试"}
//     loginName: "motou"
//     roleIdAndRoleName: [{roleId: 19, roleName: "测试"}]
//     userAvatar: ""
//     userId: 6
//     userNick: "motou"
//     userTelephone: "11"
// }
export function getCurrent() {
    return new Promise((resolve, reject) => {
        user_current_info().then(res => {
            const { menuTree, userInfo } = res;
            USER_INFO.set(userInfo) // 用户信息
            const _theme_menu = [] // 驾驶舱 权限路由
            const _admin_menu = [] // 管理后台 权限路由
            menuTree.forEach(el => {
                if (el.key.indexOf('theme-') === -1) {
                    _admin_menu.push(el)
                } else {
                    _theme_menu.push(el)
                }
            })
            const __theme_menu = []
            expandThemeRoute(_theme_menu, __theme_menu)
            PERMISSION_ROUTER.set(_admin_menu) // 权限路由
            PERMISSION_THEME_ROUTER.set(__theme_menu) // 权限路由
            resolve(true)
        })
    })
}

function expandThemeRoute(list, menu) {
    list.forEach(el => {
        menu.push(el)
        if (el.children && el.children.length > 0) {
            return expandThemeRoute(el.children, menu)
        }
    })
}
