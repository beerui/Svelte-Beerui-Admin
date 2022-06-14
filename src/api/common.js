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
 * 退出登录
 */
export function log_out() {
  return request({
    url: '/user/base/log_out',
    method: 'get'
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
 * 用户切换成指定角色
 * @param roleId: string
 */
export function user_switch_role(roleId) {
  return request({
    url: USER_MANAGE + '/user/role/user_switch_role?roleId=' + roleId,
    method: 'get'
  })
}
/**
 * 严重程度下拉框
 * @url http://192.168.1.13:11001/project/39/interface/api/94
 */
export function severityLevelSelect(data) {
  return request({
    url: '/duty-manager/duty/water_issue/get_theme_type_select',
    method: 'post',
    data: data
  })
}

/**
 * 问题类型下拉框
 * @url http://192.168.1.13:11001/project/39/interface/api/120
 */
 export function problemTypeSelect(data) {
  return request({
    url: '/duty-manager/duty/water_issue/get_problem_theme',
    method: 'post',
    data: data
  })
}

/**
 * 问题来源下拉框
 * @url http://192.168.1.13:11001/project/39/interface/api/118
 */
 export function problemSourceSelect(data) {
  return request({
    url: '/duty-manager/duty/water_issue/get_problem_source_select',
    method: 'post',
    data: data
  })
}

/**
 * 控制类型下拉框
 * @url http://192.168.1.13:11001/project/39/interface/api/130
 */
 export function controlModeSelect(data) {
  return request({
    url: '/zsdn-devices-manage/select_value/control_mode',
    method: 'get',
    params: data
  })
}

/**
 * 数据接入下拉框
 * @url http://192.168.1.13:11001/project/39/interface/api/131
 */
 export function dataJoinSelect(data) {
  return request({
    url: '/zsdn-devices-manage/select_value/data_join',
    method: 'get',
    params: data
  })
}

/**
 * 获取水体等级/河湖长等级下拉
 * http://192.168.1.13:11001/project/39/interface/api/161
 */
export function getWaterGrade() {
  return request({
    url: '/base-manage/water_enum/get_water_grade',
    method: 'get'
  })
}

/**
 * 获取水质下拉
 * http://192.168.1.13:11001/project/39/interface/api/162
 */
export function getWaterQuality() {
  return request({
    url: '/base-manage/water_enum/get_water_quality',
    method: 'get'
  })
}

/**
 * 获取控制等级下拉
 * http://192.168.1.13:11001/project/39/interface/api/164
 */
export function getControlSection() {
  return request({
    url: '/base-manage/water_enum/get_control_section',
    method: 'get'
  })
}

/**
 * 获取流域下拉
 * http://192.168.1.13:11001/project/39/interface/api/163
 */
 export function getWaterBasin() {
  return request({
    url: '/base-manage/water_enum/get_water_basin',
    method: 'get'
  })
}

export function uploader(data) {
  return request({
    url: '/zsdn-file-manage/file/open/upload_files',
    method: 'post',
    data:data
  })
}
