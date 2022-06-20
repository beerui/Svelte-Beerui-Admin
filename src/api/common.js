import request from "$utils/request.js"

/**
 * 登录
 * @param data {{account: string, password: string}}
 */
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data: data
  })
}
/**
 * 获取当前用户的基本信息
 */
export function user_current_info(params) {
  return request({
    url: '/api/user_current_info',
    method: 'get',
    params
  })
}

/**
 * 获取当前用户菜单
 */
 export function fetchMenuList(data) {
  return request({
    url: '/api/menu/list',
    method: 'post',
    data
  })
}

