import request from '../utils/request'
import { currentToken, clearAuthSession } from '../utils/identity.js'

// 1. 发送短信验证码（公开接口，文档 5.1.1）
export const sendSmsCodeAPI = (phone) => {
  return request.post('/auth/sms-code', { phone })
}

// 2. 手机验证码登录 / 自动注册（公开接口，文档 5.1.2）
export const loginAPI = (phone, code) => {
  return request.post('/auth/login', { phone, code })
}

// 3. 退出登录（文档 5.1.3）
export const logoutAPI = async () => {
  const token = currentToken(localStorage)
  // Logout intent revokes even an anonymous pending login generation immediately.
  clearAuthSession(localStorage)
  // Termination is allowed to send its captured old credential, never a later login's token.
  // No response-time cleanup: a new login started AFTER logout must survive its late result.
  return request.post('/auth/logout', undefined, { logoutToken: token })
}

// 4. 获取当前用户资料（文档 5.1.4）
export const getUserInfoAPI = () => {
  return request.get('/users/me')
}
// 5. 修改昵称 / 头像（文档 5.1.5，使用 PUT 请求）
export const updateUserInfoAPI = (data) => {
  return request.put('/users/me', data)
}
