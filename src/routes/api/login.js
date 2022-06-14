export async function post({ request }) {
  const data = await request.json(); // or .json(), or .text(), etc
  if(data.account === 'admin' || data.account === 'editor') {
    return {
      body: { code:20000, data: data.account, message: '登录成功' }
    }
  }
  return {
    body: { code:20000, data: null, message: '用户名或密码错误' }
  }
}
