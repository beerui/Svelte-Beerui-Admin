import role from '$mock/role'
let total = role.length
export async function post({ request }) {
  const params = await request.json(); // or .json(), or .text(), etc
  return {
    body: { code:20000, data: {list: filterList(params), total: total},message: '获取成功' }
  }
}
const filterList = (params) => {
  let resultList = []
  resultList = role.filter(item => {
    return item.name.indexOf(params.name) !== -1
  })
  if(params.enable) {
    resultList = resultList.filter(item => {
      return item.enable === params.enable
    })
  }
  total = resultList.length
  const start = ((params.pageNum - 1) * params.pageSize)
  const end = (params.pageNum * params.pageSize - 1)
  return resultList.slice(start, end)
}