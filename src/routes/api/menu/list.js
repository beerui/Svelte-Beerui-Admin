import routers from '$mock/router'

export async function post({ request }) {
  const type = request.headers.get("token")
  const params = await request.json(); // or .json(), or .text(), etc
  if(type === 'admin') {
    return {
      body: { code:20000, data: getRouters(routers, 'admin', params) }
    }
  }
  if(type === 'editor') {
    return {
      body: { code:20000, data: getRouters(routers, 'editor', params) }
    }
  }
  return {
    body: { code:20000, data: null,message: '获取权限失败' }
  }
}

const getRouters = (list, role, params) => {
  const data = filterRouters(list, role, params)
  const includeIds = []
  const result = data.filter(item => {
    if(!item.children) el.children = []
    item.children = data.filter(el => {
      if(item.id === el.parentId) includeIds.push(el.id)
      return item.id === el.parentId
    })
    return !includeIds.includes(item.id)
  })
  return result
}
const filterRouters = (list, role, params) => {
  return list.filter(item => {
    return item.roles.includes(role) && (item.title.indexOf(params.title) != -1)
  })
}
