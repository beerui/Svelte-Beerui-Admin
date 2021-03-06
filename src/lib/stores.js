import { writable } from 'svelte/store';
import {
    GET_MENU_ACTIVE,
    GET_MENU_COLLAPSE,
    getToken,
    setToken,
    SET_MENU_ACTIVE,
    SET_MENU_COLLAPSE
} from '$utils/auth';
import { browser } from '$app/env';
import { computedRouter } from "$utils/index";
// 登录状态
export const LOGIN_LOADING_STATUS = writable(false)
// tagsView
export const TAGS_VIEW = writable([])
// 展示平台状态
export const THEME_LOADING_STATUS = writable(false)
// 管理平台状态
export const ADMIN_LOADING_STATUS = writable(false)
// 扁平化权限菜单
export const ROUTER_MAP = {}
// 持久化 token
export const TOKEN = writable(browser ? getToken() : '');
// 用户信息
export const USER_INFO = writable({
    areaCode: '',
    areaId: '',
    areaLevel: '',
    areaLevelPath: '',
    areaName: '',
    currentRole: '',
    loginName: '',
    roleIdAndRoleName: '',
    userAvatar: '',
    userId: '',
    userNick: '',
    userTelephone: ''
});
// 权限菜单
export const PERMISSION_ROUTER = writable([]); // TODO: 打开权限路由后删除 router
// TODO: 打开权限路由后打开注释
PERMISSION_ROUTER.subscribe(items => {
  if (items && items.length > 0) computedRouter && computedRouter(items)
})

// TODO: 打开权限路由后删除
// setTimeout(() => {
//     PERMISSION_ROUTER.set(router)
//     computedRouter && computedRouter(router)
// }, 100)
// 菜单操作持久化
export const MENU = writable(GET_MENU_ACTIVE());
export const COLLAPSE = writable(GET_MENU_COLLAPSE());
MENU.subscribe(items => SET_MENU_ACTIVE(items))
COLLAPSE.subscribe(items => SET_MENU_COLLAPSE(items))
if (browser) {
  TOKEN.subscribe(value => setToken(value))
}
// 活水调度左侧菜单 展示隐藏
export const IsShowWaterNavBar = writable({ key: 'left_nav', value: false });
