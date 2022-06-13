import { browser } from "$app/env";

const TokenKey = 'jw_token'
const AccountKey = 'ACCOUNT_INFO'
const WindKey = 'WIND_INFO'
const MenuKey = 'MENU_ACTIVE'
const CollapseKey = 'MENU_COLLAPSE'

export function setToken(token) {
    browser && localStorage.setItem(TokenKey, token)
}

export function getToken() {
    return browser && (localStorage.getItem(TokenKey) || '')
}

export function removeToken() {
    setToken('')
}

export function setAccount(data) {
    const account = { account: btoa(data.account || ''), password: btoa(data.password || '') }
    browser && localStorage.setItem(AccountKey, JSON.stringify(account))
}

export function getAccount() {
    if (browser) {
        const data = JSON.parse(localStorage.getItem(AccountKey))
        let account = null
        if (data) {
            account = { account: atob(data.account) === 'undefined' ? '' : '', password: atob(data.password) === 'undefined' ? '' : '' }
        }
        return account
    }
    return null
}

export function setWind(data) {
    browser && localStorage.setItem(WindKey, JSON.stringify({ data: data, time: new Date().getTime() }))
}

export function getWind() {
    if (browser) {
        const data = JSON.parse(localStorage.getItem(WindKey))
        if (data && data.time > (new Date().getTime() - 24*60*60*1000)) {
            return data.data
        }
    }
    return null
}

export function removeAccount() {
    setAccount('')
}


export function SET_MENU_COLLAPSE(menu) {
    browser && localStorage.setItem(CollapseKey, JSON.stringify(menu))
}

export function GET_MENU_COLLAPSE() {
    return browser && (JSON.parse(localStorage.getItem(CollapseKey)) || { collapse: false })
}

export function SET_MENU_ACTIVE(menu) {
    browser && localStorage.setItem(MenuKey, JSON.stringify(menu))
}

export function GET_MENU_ACTIVE() {
    return browser && (JSON.parse(localStorage.getItem(MenuKey)) || { active: '1', type: '' })
}

export function CLEAR_MENU_ACTIVE() {
    return browser && localStorage.setItem(MenuKey, '{}')
}
