import axios from 'axios'
import { showToast } from 'vant'
import router from '../router'
import { getAuthSession, matchesAuthSession, clearAuthSession } from './identity.js'

// 创建 axios 实例
const transport = axios.create({
  baseURL: '/api/v1', // 对应接口前缀
  timeout: 10000       // 10秒超时
})

const applyToken = (config, token) => {
  config.headers = axios.AxiosHeaders.from(config.headers)
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  else config.headers.delete('Authorization')
}

// Capture ownership synchronously at CALL time, before Axios queues any interceptor.
// A request created by A must never be rebound to B's token later in that queue.
function request(configOrUrl, config) {
  const options = typeof configOrUrl === 'string' ? { ...config, url: configOrUrl } : { ...configOrUrl }
  const method = (options.method || transport.defaults.method || 'get').toLowerCase()
  const ownedLogout = Object.prototype.hasOwnProperty.call(options, 'logoutToken')
  if (ownedLogout && (options.url !== '/auth/logout' || method !== 'post')) {
    return Promise.reject(new axios.AxiosError('退出凭证只能用于退出请求', 'AUTH_SESSION_CHANGED'))
  }
  const anonymous = options.url === '/auth/login' || options.url === '/auth/sms-code'
  const snapshot = anonymous || ownedLogout ? null : getAuthSession(localStorage)
  const token = ownedLogout ? options.logoutToken : snapshot?.token || ''
  const adapter = options.adapter || transport.defaults.adapter
  const guardedAdapter = dispatchConfig => {
    if ((ownedLogout && (dispatchConfig.url !== '/auth/logout' || dispatchConfig.method !== 'post')) ||
        (snapshot && !matchesAuthSession(localStorage, snapshot))) {
      return Promise.reject(new axios.AxiosError('账号认证已变更，已阻止请求发送', 'AUTH_SESSION_CHANGED', dispatchConfig))
    }
    // This is AFTER transforms/interceptors, immediately BEFORE the real adapter.
    // Anonymous requests stay anonymous; owned logout uses only its captured old token.
    applyToken(dispatchConfig, token)
    dispatchConfig.authSessionToken = token
    dispatchConfig.ownedLogout = ownedLogout
    return axios.getAdapter(adapter, dispatchConfig)(dispatchConfig)
  }
  return transport.request({ ...options, method, authSessionToken: token, ownedLogout, adapter: guardedAdapter })
}
request.defaults = transport.defaults
request.interceptors = transport.interceptors
request.request = request
for (const method of ['get', 'delete', 'head', 'options']) {
  request[method] = (url, config) => request({ ...config, method, url })
}
for (const method of ['post', 'put', 'patch']) {
  request[method] = (url, data, config) => request({ ...config, method, url, data })
}

// 1. The interceptor only applies the already-captured token; it never rereads B.
transport.interceptors.request.use(
  (config) => {
    applyToken(config, config.authSessionToken)
    return config
  },
  error => { throw error },
  { synchronous: true }
)

// 2. 响应拦截器：统一处理成功与报错
transport.interceptors.response.use(
  (response) => {
    const res = response.data
    // 按照文档：code === 0 表示成功
    if (res.code === 0) {
      return res.data
    }

    // 业务错误（code !== 0）直接弹出后端给的 msg
    if (!response.config.silent) showToast(res.msg || '操作失败')
    const error = new Error(res.msg || 'Error')
    error.code = res.code
    return Promise.reject(error)
  },
  (error) => {
    if (error.code === 'AUTH_SESSION_CHANGED') return Promise.reject(error)
    const silent = error.config?.silent
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        if (!error.config?.ownedLogout && clearAuthSession(localStorage, error.config?.authSessionToken)) {
          if (!silent) showToast('登录已失效，请重新登录')
          router.push('/login')
        }
      } else if (status === 501) {
        if (!silent) showToast('后端接口开发中（HTTP 501）')
      } else {
        if (!silent) showToast(`请求失败: ${error.response.data?.msg || '网络异常'}`)
      }
    } else {
      if (!silent) showToast('网络连接超时，请检查后端是否已启动')
    }
    return Promise.reject(error)
  }
)

export default request
