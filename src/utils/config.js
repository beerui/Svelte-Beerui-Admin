const isDev = process.env.NODE_ENV === 'development'

export const baseUrl = isDev ? '/prod-api' : ''
export const AUTH_MANAGE = isDev ? '/auth-manage' : '/auth-manage'
export const USER_MANAGE = isDev ? '/user-manage' : '/user-manage'
export const ROLE_MANAGE = isDev ? 'role-manage' : '/role-manage'
export const DEFAULT_AREA_ID = 7 // 越城区区域id
/**
 * 判断开发环境
 * dev true: development false: production
 */
export const UPLOAD_URL = isDev ? 'https://zsdn.zhihuihedao.cn/zsdn-file-manage/file/open/upload_files' : '/zsdn-file-manage/file/open/upload_files'
