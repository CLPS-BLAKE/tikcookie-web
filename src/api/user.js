import request from '../utils/request'

// 1. 发送短信验证码（公开接口，文档 5.1.1）
export const sendSmsCodeAPI = (phone) => {
  return request.post('/auth/sms-code', { phone })
}

// 2. 手机验证码登录 / 自动注册（公开接口，文档 5.1.2）
export const loginAPI = (phone, code) => {
  return request.post('/auth/login', { phone, code })
}

// 3. 退出登录（文档 5.1.3）
export const logoutAPI = () => {
  return request.post('/auth/logout')
}

// 4. 获取当前用户资料（文档 5.1.4）
export const getUserInfoAPI = () => {
  return request.get('/users/me')
}