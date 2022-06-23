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

/**
 * 新增菜单
 */
 export function createMenu(data) {
  return request({
    url: '/api/menu/add',
    method: 'post',
    data
  })
}


/**
 * 修改菜单
 */
 export function updateMenu(data) {
  return request({
    url: '/api/menu/edit',
    method: 'post',
    data
  })
}
/**
 * 删除菜单
 */
 export function deleteMenu(data) {
  return request({
    url: '/api/menu/delete',
    method: 'post',
    data
  })
}
/**
 * 用户列表
 */
 export function fetchRoleList(data) {
  return request({
    url: '/api/role/list',
    method: 'post',
    data
  })
}


