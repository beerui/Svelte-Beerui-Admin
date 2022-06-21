import routers from '$utils/router'
// mock menu data
export async function get({request}) {
  // const current = request.url.searchParams.get('type')
  const current = request.headers.get("token")
  if(current === 'admin') {
    return {
      body: { code:20000, data: getRouters(routers, 'admin') }
    }
  }
  if(current === 'editor') {
    return {
      body: { code:20000, data: getRouters(routers, 'editor') }
    }
  }
  return {
    body: { code:20000, data: null,message: '获取权限失败' }
  }
}
const getRouters = (list, role) => {
  const data = filterRouters(list, role)
  const result = data.filter(item => {
    if(!item.children) el.children = []
    item.children = data.filter(el => {
      return item.id === el.parentId
    })
    return !item.parentId
  })
  return result
}

const filterRouters = (list, role) => {
  return list.filter(item => {
    return item.roles.includes(role)
  })
}
