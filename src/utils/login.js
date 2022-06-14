import { getToken, removeRole, getRole } from "./auth.js";
import { goto } from "$app/navigation";
import { log_out, user_current_info, login } from "../api/common.js";
import { openNotice } from "./index.js";
import {
    LOGIN_LOADING_STATUS,
    PERMISSION_ROUTER,
    PERMISSION_THEME_ROUTER,
    ROUTER_MAP,
    CURRENT_ROLE
} from "../lib/stores.js";

export function loginOut(message = '退出成功') {
    removeRole()
    goto('/login', { replaceState: true })
}

export async function loginIn(query) {
    LOGIN_LOADING_STATUS.set(true)
    login(query).then(async (res) => {
        if(res) {
            CURRENT_ROLE.set(res)
            await getCurrent()
            let _admin_menu = [] // 管理后台 权限路由
            PERMISSION_ROUTER.subscribe(items => _admin_menu = items)
            if (_admin_menu.length === 0) {
                openNotice({ message: '无菜单权限！', type: 'error' })
                LOGIN_LOADING_STATUS.set(false)
                return
            }
            if (_admin_menu.length > 0) {
                const _menu = openPageRedirect(_admin_menu)
                goto(_menu.path, { replaceState: true })
                LOGIN_LOADING_STATUS.set(false)
                return
            }
            goto('/', { replaceState: true })
        } else {
            LOGIN_LOADING_STATUS.set(false)
            openNotice({ message: '用户名密码错误!', type: 'error' })
        }
    })
   
}
// 检测当前页面是否有权限查看 无权限跳到无权限页面
export const isPermissionRoute = (path, layout) => {
    const public_router = ['/login', '/403', '/error']
    if (public_router.includes(path)) return true
    let _theme_menu = [] // 驾驶舱 权限路由
    PERMISSION_ROUTER.subscribe(items => _theme_menu = items)
    /**
     * 页面 权限判断
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
export function getCurrent() {
    return new Promise((resolve, reject) => {
        user_current_info({type: getRole()}).then(res => {
            PERMISSION_ROUTER.set(res) // 权限路由
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
