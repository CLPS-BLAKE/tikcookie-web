import axios from 'axios'
import { showToast } from 'vant'
import router from '../router'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api/v1', // 对应接口前缀
  timeout: 10000       // 10秒超时
})

// 1. 请求拦截器：发请求前自动带上 Bearer Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 2. 响应拦截器：统一处理成功与报错
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 按照文档：code === 0 表示成功
    if (res.code === 0) {
      return res.data
    }

    // 业务错误（code !== 0）直接弹出后端给的 msg
    showToast(res.msg || '操作失败')
    return Promise.reject(new Error(res.msg || 'Error'))
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        showToast('登录已失效，请重新登录')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
      } else if (status === 501) {
        showToast('后端接口开发中（HTTP 501）')
      } else {
        showToast(`请求失败: ${error.response.data?.msg || '网络异常'}`)
      }
    } else {
      showToast('网络连接超时，请检查后端是否已启动')
    }
    return Promise.reject(error)
  }
)

export default request